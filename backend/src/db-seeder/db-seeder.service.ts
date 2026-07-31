import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeedPartDto } from './db-seeder.controller';
import { PartType } from 'generated/prisma/enums';

const PARENT_TYPE: Record<PartType, PartType | null> = {
  CASE: null,

  MOVEMENT: PartType.CASE,
  BEZEL: PartType.CASE,

  DIAL: PartType.MOVEMENT,
  HANDS: PartType.MOVEMENT,
  ROTOR: PartType.MOVEMENT,
  CRYSTAL: PartType.MOVEMENT,
};

@Injectable()
export class DbSeederService {
  constructor(private readonly prisma: PrismaService) {}

  async createPart(dto: SeedPartDto) {
    const part = await this.prisma.part.create({
      data: {
        name: dto.name,
        description: dto.description,
        cost: dto.cost,
        type: dto.type,
        modelUrl: dto.modelUrl,
        itemUrl: dto.itemUrl,
      },
    });

    if (dto.compatibilityIds.length === 0) {
      return part;
    }

    const compatibilityData = dto.compatibilityIds.map((id) => {
      switch (dto.type) {
        case PartType.MOVEMENT:
        case PartType.BEZEL:
          return {
            part1Id: id,
            part2Id: part.id,
          };

        case PartType.DIAL:
        case PartType.HANDS:
        case PartType.ROTOR:
        case PartType.CRYSTAL:
          return {
            part1Id: id,
            part2Id: part.id,
          };

        default:
          return null;
      }
    });

    const filtered = compatibilityData.filter(
      (x): x is { part1Id: number; part2Id: number } => x !== null,
    );

    if (filtered.length > 0) {
      await this.prisma.partCompatibility.createMany({
        data: filtered,
      });
    }

    return part;
  }

  async getAllParts() {
    return this.prisma.part.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
        type: true,
        cost: true,
      },
    });
  }

  async getPart(id: number) {
    const part = await this.prisma.part.findUnique({
      where: { id },
      include: {
        compatibilitiesAsPart1: true,
        compatibilitiesAsPart2: true,
      },
    });

    if (!part) {
      return null;
    }

    return {
      id: part.id,
      name: part.name,
      description: part.description,
      cost: Number(part.cost),
      type: part.type,
      modelUrl: part.modelUrl,
      itemUrl: part.itemUrl,

      compatibilityIds: part.compatibilitiesAsPart2.map((c) => c.part1Id),
    };
  }

  async updatePart(id: number, dto: SeedPartDto) {
    const part = await this.prisma.part.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        cost: dto.cost,
        type: dto.type,
        modelUrl: dto.modelUrl,
        itemUrl: dto.itemUrl,
      },
    });

    await this.prisma.partCompatibility.deleteMany({
      where: {
        part2Id: id,
      },
    });

    if (dto.type !== PartType.CASE && dto.compatibilityIds.length > 0) {
      await this.prisma.partCompatibility.createMany({
        data: dto.compatibilityIds.map((parentId) => ({
          part1Id: parentId,
          part2Id: id,
        })),
      });
    }

    return part;
  }

  async deletePart(id: number) {
    await this.prisma.part.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  }

  async getCompatibleOptions(type: PartType) {
    const parentType = PARENT_TYPE[type];

    if (!parentType) {
      return [];
    }

    return this.prisma.part.findMany({
      where: {
        type: parentType,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
