import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WatchService {
  constructor(private prismaService: PrismaService) {}

  public async getCompatable(baseIds: number[]) {
    // First, find all compatibility records where any of the provided IDs
    // are either part1 or part2
    // this is already bad
    const compatibilities = await this.prismaService.partCompatibility.findMany(
      {
        where: {
          OR: [
            {
              part1Id: {
                in: baseIds,
              },
            },
            {
              part2Id: {
                in: baseIds,
              },
            },
          ],
        },
        include: {
          part1: true,
          part2: true,
        },
      },
    );

    // Extract the compatible parts from the compatibility records
    const compatibleParts = new Map<number, any>();

    compatibilities.forEach((compatibility) => {
      // If part1Id is in the base IDs, then part2 is compatible
      if (baseIds.includes(compatibility.part1Id)) {
        if (!compatibleParts.has(compatibility.part2.id)) {
          compatibleParts.set(compatibility.part2.id, compatibility.part2);
        }
      }

      // If part2Id is in the base IDs, then part1 is compatible
      if (baseIds.includes(compatibility.part2Id)) {
        if (!compatibleParts.has(compatibility.part1.id)) {
          compatibleParts.set(compatibility.part1.id, compatibility.part1);
        }
      }
    });

    return Array.from(compatibleParts.values());
  }

  public async getAll() {
    return this.prismaService.part.findMany();
  }
}
