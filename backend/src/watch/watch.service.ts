import { Injectable } from '@nestjs/common';
import { PartType } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

// compatability dependency table:
/* cases <|- movement <|- hands
          |- bezel     |- rotor
                       |- dial
                       |- glass
*/
// as we can see this is a simple tree
// we query only 2 times to know the compatable parts

type CompatabilityPair = {
  baseId: number;
  compatableIds: number[];
};
type CompatabilityArray = CompatabilityPair[];

@Injectable()
export class WatchService {
  constructor(private prismaService: PrismaService) {}

  public async getCompatible(partIds: number[]): Promise<CompatabilityArray> {
    const allCompatibleItems =
      await this.prismaService.partCompatibility.findMany({
        select: { part1Id: true, part2Id: true },
        where: { part1Id: { in: partIds } },
      });

    return partIds.map((baseId) => {
      const compatableIds = allCompatibleItems
        .filter((item) => item.part1Id === baseId)
        .map((item) => item.part2Id);

      return { baseId, compatableIds };
    });
  }

  public async getAll() {
    return this.prismaService.part.findMany();
  }

  public async getFirstCompatableSequence() {
    const finalIds: number[] = [];

    // start with first case
    const firstCase = await this.prismaService.part.findFirst({
      select: { id: true },
      where: { type: { equals: 'CASE' } },
    });

    if (!firstCase) throw this.PartNotPresentInDbException('CASE');

    finalIds.push(firstCase.id);

    const compatibleToCase =
      await this.prismaService.partCompatibility.findMany({
        include: { part2: true },
        where: { part1Id: firstCase.id },
      });

    const firstMovementId = compatibleToCase.find(
      (compToCase) => compToCase.part2.type === 'MOVEMENT',
    )?.part2Id;

    if (!firstMovementId) throw this.PartNotPresentInDbException('MOVEMENT');
    finalIds.push(firstMovementId);

    const firstBezelId = compatibleToCase.find(
      (compToCase) => compToCase.part2.type === 'BEZEL',
    )?.part2Id;

    if (!firstBezelId) throw this.PartNotPresentInDbException('BEZEL');
    finalIds.push(firstBezelId);

    const compatibleToMovement =
      await this.prismaService.partCompatibility.findMany({
        include: { part2: true },
        where: { part1Id: firstMovementId },
      });

    const firstHand = compatibleToMovement.find(
      (compToCase) => compToCase.part2.type === 'HANDS',
    )?.part2Id;

    if (!firstHand) throw this.PartNotPresentInDbException('HANDS');
    finalIds.push(firstHand);

    const firstRotor = compatibleToMovement.find(
      (compToCase) => compToCase.part2.type === 'ROTOR',
    )?.part2Id;

    if (!firstRotor) throw this.PartNotPresentInDbException('ROTOR');
    finalIds.push(firstRotor);

    const firstDial = compatibleToMovement.find(
      (compToCase) => compToCase.part2.type === 'DIAL',
    )?.part2Id;

    if (!firstDial) throw this.PartNotPresentInDbException('DIAL');
    finalIds.push(firstDial);

    const firstGlass = compatibleToMovement.find(
      (compToCase) => compToCase.part2.type === 'CRYSTAL',
    )?.part2Id;

    if (!firstGlass) throw this.PartNotPresentInDbException('CRYSTAL');
    finalIds.push(firstGlass);

    return finalIds;
  }

  private PartNotPresentInDbException(partType: PartType) {
    return new Error(
      `cannot start app because there is not a single ${partType} in the database`,
    );
  }
}
