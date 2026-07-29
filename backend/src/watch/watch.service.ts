import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// compatability dependency table:
/* cases <|- movement <|- hands
          |- bezel     |- rotor
                       |- dial
                       |- glass
*/
// as we can see this is a simple tree
// we query only 2 times to know the compatable parts

@Injectable()
export class WatchService {
  constructor(private prismaService: PrismaService) {}

  public async getCompatible(
    caseId: number | undefined,
    movementId: number | undefined,
  ) {
    // Step 1: Resolve the case ID (use provided or find first available)
    const resolvedCaseId =
      caseId ??
      (
        await this.prismaService.part.findFirst({
          where: { type: { equals: 'CASE' } },
          select: { id: true },
        })
      )?.id;

    if (!resolvedCaseId) {
      throw new Error('No case found in database');
    }

    // Step 2: If movement is provided, validate compatibility with case
    if (movementId !== undefined) {
      const isCompatible = await this.prismaService.partCompatibility.findFirst(
        {
          where: {
            part1Id: resolvedCaseId,
            part2Id: movementId,
          },
        },
      );

      if (!isCompatible) {
        throw new Error(
          `Movement ${movementId} is not compatible with case ${resolvedCaseId}`,
        );
      }
    }

    // Step 3: Get all parts compatible with the case (movement, bezel)
    const compatibleWithCase =
      await this.prismaService.partCompatibility.findMany({
        where: {
          part1Id: resolvedCaseId,
        },
        include: {
          part2: true, // This gets us the actual compatible parts (movement, bezel)
        },
      });

    // Step 4: If no movement specified, find the first compatible movement
    let resolvedMovementId = movementId;
    if (resolvedMovementId === undefined) {
      const compatibleMovement = compatibleWithCase.find(
        (comp) => comp.part2.type === 'MOVEMENT',
      );

      if (!compatibleMovement) {
        throw new Error(`No movement compatible with case ${resolvedCaseId}`);
      }

      resolvedMovementId = compatibleMovement.part2Id;
    }

    // Step 5: Get all parts compatible with the movement (hands, rotor, dial, glass)
    const compatibleWithMovement =
      await this.prismaService.partCompatibility.findMany({
        where: {
          part1Id: resolvedMovementId,
        },
        include: {
          part2: true,
        },
      });

    // Step 6: Combine all compatible parts
    // From case: bezel (and movement, but we already have that)
    // From movement: hands, rotor, dial, glass
    const allCompatibleParts = [
      ...compatibleWithCase.map((comp) => comp.part2),
      ...compatibleWithMovement.map((comp) => comp.part2),
    ];

    return allCompatibleParts;
  }

  public async getAll() {
    return this.prismaService.part.findMany();
  }
}
