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

  public async getCompatible(partId: number) {
    const compatableWithPart =
      await this.prismaService.partCompatibility.findMany({
        select: { part2Id: true },
        where: {
          part1Id: {
            equals: partId,
          },
        },
      });

    return compatableWithPart.map((value) => value.part2Id);
  }

  public async getAll() {
    return this.prismaService.part.findMany();
  }
}
