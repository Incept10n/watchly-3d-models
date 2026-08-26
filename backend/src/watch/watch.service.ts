import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChosenWatch, FormDependencyTreeResponse } from './types';
import { Part, PartType } from 'generated/prisma/client';

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

const withNumberCost = (part: Part) => ({
  ...part,
  cost: Number(part.cost),
});

@Injectable()
export class WatchService {
  constructor(private prismaService: PrismaService) {}

  public async formDependencyTree(
    currentTree: ChosenWatch,
  ): Promise<FormDependencyTreeResponse> {
    // Query 1: Get parts compatible with the CASE
    const compatibleWithCase =
      await this.prismaService.partCompatibility.findMany({
        include: { part2: true },
        where: { part1Id: currentTree.CASE.id },
      });

    // Check MOVEMENT compatibility with CASE
    if (
      !compatibleWithCase
        .map((part) => part.part2Id)
        .includes(currentTree.MOVEMENT.id)
    ) {
      const firstCompatibleMovement = compatibleWithCase.find(
        (part) => part.part2.type === 'MOVEMENT',
      );
      if (!firstCompatibleMovement)
        throw new Error(
          `no compatible movement to the case with id ${currentTree.CASE.id}`,
        );

      currentTree.MOVEMENT = firstCompatibleMovement.part2;
    }

    // Check BEZEL compatibility with CASE
    if (
      !compatibleWithCase
        .map((part) => part.part2Id)
        .includes(currentTree.BEZEL.id)
    ) {
      const firstCompatibleBezel = compatibleWithCase.find(
        (part) => part.part2.type === 'BEZEL',
      );

      if (!firstCompatibleBezel)
        throw new Error(
          `no compatible bezel to the case with id ${currentTree.CASE.id}`,
        );

      currentTree.BEZEL = firstCompatibleBezel.part2;
    }

    // Query 2: Get parts compatible with the MOVEMENT
    const compatibleWithMovement =
      await this.prismaService.partCompatibility.findMany({
        include: { part2: true },
        where: { part1Id: currentTree.MOVEMENT.id },
      });

    // Check HANDS compatibility with MOVEMENT
    if (
      !compatibleWithMovement
        .map((part) => part.part2Id)
        .includes(currentTree.HANDS.id)
    ) {
      const firstCompatibleHands = compatibleWithMovement.find(
        (part) => part.part2.type === 'HANDS',
      );
      if (!firstCompatibleHands)
        throw new Error(
          `no compatible hands to the movement with id ${currentTree.MOVEMENT.id}`,
        );

      currentTree.HANDS = firstCompatibleHands.part2;
    }

    // Check ROTOR compatibility with MOVEMENT
    if (
      !compatibleWithMovement
        .map((part) => part.part2Id)
        .includes(currentTree.ROTOR.id)
    ) {
      const firstCompatibleRotor = compatibleWithMovement.find(
        (part) => part.part2.type === 'ROTOR',
      );
      if (!firstCompatibleRotor)
        throw new Error(
          `no compatible rotor to the movement with id ${currentTree.MOVEMENT.id}`,
        );

      currentTree.ROTOR = firstCompatibleRotor.part2;
    }

    // Check DIAL compatibility with MOVEMENT
    if (
      !compatibleWithMovement
        .map((part) => part.part2Id)
        .includes(currentTree.DIAL.id)
    ) {
      const firstCompatibleDial = compatibleWithMovement.find(
        (part) => part.part2.type === 'DIAL',
      );
      if (!firstCompatibleDial)
        throw new Error(
          `no compatible dial to the movement with id ${currentTree.MOVEMENT.id}`,
        );

      currentTree.DIAL = firstCompatibleDial.part2;
    }

    // Check GLASS compatibility with MOVEMENT
    if (
      !compatibleWithMovement
        .map((part) => part.part2Id)
        .includes(currentTree.CRYSTAL.id)
    ) {
      const firstCompatibleGlass = compatibleWithMovement.find(
        (part) => part.part2.type === 'CRYSTAL',
      );
      if (!firstCompatibleGlass)
        throw new Error(
          `no compatible glass to the movement with id ${currentTree.MOVEMENT.id}`,
        );

      currentTree.CRYSTAL = firstCompatibleGlass.part2;
    }

    const compatability = await this.getCompatible([
      currentTree.CASE.id,
      currentTree.MOVEMENT.id,
    ]);

    const typedTree = Object.fromEntries(
      Object.entries(currentTree).map(([key, part]) => [
        key,
        withNumberCost(part),
      ]),
    ) as unknown as ChosenWatch;

    return { currentTree: typedTree, compatability };
  }

  public async getCompatible(partIds: number[]): Promise<CompatabilityArray> {
    const allCompatibleItems =
      await this.prismaService.partCompatibility.findMany({
        select: { part1Id: true, part2Id: true },
        where: { part1Id: { in: partIds } },
      });

    const allCases = await this.prismaService.part.findMany({
      select: { id: true },
      where: { type: 'CASE' },
    });

    return partIds
      .map((baseId) => {
        const compatableIds = allCompatibleItems
          .filter((item) => item.part1Id === baseId)
          .map((item) => item.part2Id);

        return { baseId, compatableIds };
      })
      .concat(
        allCases.map((caseItem) => {
          return { baseId: caseItem.id, compatableIds: [caseItem.id] };
        }),
      );
  }

  public async getAll() {
    const parts = await this.prismaService.part.findMany();
    return parts.map(withNumberCost);
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

    return {
      ids: finalIds,
      compatability: await this.getCompatible([firstCase.id, firstMovementId]),
    };
  }

  private PartNotPresentInDbException(partType: PartType) {
    return new Error(
      `cannot start app because there is not a single ${partType} in the database`,
    );
  }
}
