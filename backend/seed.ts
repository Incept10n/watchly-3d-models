import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { PartType } from './generated/prisma/enums';

const pool = new Pool({ connectionString: process.env.WH_DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedPart = {
  name: string;
  description: string;
  cost: number;
  type: PartType;
  modelUrl: string;
  pictureUrl: string;
};

// modelUrl paths are served by the frontend from its public/ dir
const parts: SeedPart[] = [
  {
    name: 'Submariner Case',
    description: 'Oyster-steel case, brushed lugs, screw-down crown',
    cost: 450,
    type: PartType.CASE,
    modelUrl: '/models/case/case.glb',
    pictureUrl: '/pictures/case/case.png',
  },

  {
    name: 'Calibre 3135',
    description: 'Automatic movement, 48h power reserve',
    cost: 1200,
    type: PartType.MOVEMENT,
    modelUrl: '',
    pictureUrl: '/pictures/movement/first.png',
  },
  {
    name: 'Calibre 3285',
    description: 'Automatic movement with chronometer cert',
    cost: 1500,
    type: PartType.MOVEMENT,
    modelUrl: '',
    pictureUrl: '/pictures/movement/second.png',
  },

  {
    name: 'Blue Ceramic Bezel',
    description: 'Unidirectional ceramic bezel, glossy finish',
    cost: 210,
    type: PartType.BEZEL,
    modelUrl: '/models/bezel/blueBezel.glb',
    pictureUrl: '/pictures/bezel/blueBezel.png',
  },
  {
    name: 'Stainless Steel Bezel',
    description: 'Polished steel bezel with brushed edge',
    cost: 140,
    type: PartType.BEZEL,
    modelUrl: '/models/bezel/standardBezel.glb',
    pictureUrl: '/pictures/bezel/standardBezel.png',
  },
  {
    name: 'Triangulated Bezel',
    description: 'Angular bezel with faceted markers',
    cost: 180,
    type: PartType.BEZEL,
    modelUrl: '/models/bezel/triagnleBezel.glb',
    pictureUrl: '/pictures/bezel/triangleBezel.png',
  },

  {
    name: 'Mercedes Hands',
    description: 'Classic Mercedes hour hand, luminous fill',
    cost: 90,
    type: PartType.HANDS,
    modelUrl: '/models/hands/defaultHands.glb',
    pictureUrl: '/pictures/hands/defaultHands.png',
  },
  {
    name: 'Slim Dagger Hands',
    description: 'Minimal dagger hands, brushed steel',
    cost: 110,
    type: PartType.HANDS,
    modelUrl: '/models/hands/smallArrows.glb',
    pictureUrl: '/pictures/hands/smallArrows.png',
  },

  {
    name: 'Brushed Steel Rotor',
    description: 'Peripheral rotor with brushed finishing',
    cost: 160,
    type: PartType.ROTOR,
    modelUrl: '/models/rotor/dummyRotor.glb',
    pictureUrl: '/pictures/rotor/dummyRotor.png',
  },

  {
    name: 'Emerald Green Dial',
    description: 'Sunburst green dial with applied indices',
    cost: 250,
    type: PartType.DIAL,
    modelUrl: '/models/dial/greenDial.glb',
    pictureUrl: '/pictures/dial/greenDial.png',
  },
  {
    name: 'Viox Starry Dial',
    description: 'Midnight dial with star guilloche pattern',
    cost: 300,
    type: PartType.DIAL,
    modelUrl: '/models/dial/vioxDial.glb',
    pictureUrl: '/pictures/dial/vioxDial.png',
  },

  {
    name: 'Sapphire Crystal',
    description: 'Flat sapphire with anti-reflective coating',
    cost: 120,
    type: PartType.CRYSTAL,
    modelUrl: '/models/crystal/defaultCrystal.glb',
    pictureUrl: '/pictures/crystal/defaultCrystal.png',
  },
  {
    name: 'No-Date Sapphire Crystal',
    description: 'Sapphire without date cyclops',
    cost: 130,
    type: PartType.CRYSTAL,
    modelUrl: '/models/crystal/noDateCrystal.glb',
    pictureUrl: '/pictures/crystal/noDateCrystal.png',
  },
];

async function main() {
  await prisma.partCompatibility.deleteMany();
  await prisma.part.deleteMany();

  const createdByType = new Map<PartType, number[]>();

  for (const part of parts) {
    const created = await prisma.part.create({
      data: {
        name: part.name,
        description: part.description,
        cost: part.cost,
        type: part.type,
        modelUrl: part.modelUrl,
        pictureUrl: part.pictureUrl,
        itemUrl: '',
      },
    });
    createdByType.set(part.type, [
      ...(createdByType.get(part.type) ?? []),
      created.id,
    ]);
  }

  const cases = createdByType.get(PartType.CASE) ?? [];
  const movements = createdByType.get(PartType.MOVEMENT) ?? [];
  const bezels = createdByType.get(PartType.BEZEL) ?? [];
  const hands = createdByType.get(PartType.HANDS) ?? [];
  const rotors = createdByType.get(PartType.ROTOR) ?? [];
  const dials = createdByType.get(PartType.DIAL) ?? [];
  const crystals = createdByType.get(PartType.CRYSTAL) ?? [];

  const rows: { part1Id: number; part2Id: number }[] = [];

  for (const caseId of cases) {
    for (const movementId of movements)
      rows.push({ part1Id: caseId, part2Id: movementId });
    for (const bezelId of bezels)
      rows.push({ part1Id: caseId, part2Id: bezelId });
  }

  for (const movementId of movements) {
    for (const handsId of hands)
      rows.push({ part1Id: movementId, part2Id: handsId });
    for (const rotorId of rotors)
      rows.push({ part1Id: movementId, part2Id: rotorId });
    for (const dialId of dials)
      rows.push({ part1Id: movementId, part2Id: dialId });
    for (const crystalId of crystals)
      rows.push({ part1Id: movementId, part2Id: crystalId });
  }

  await prisma.partCompatibility.createMany({ data: rows });

  console.log(
    `Seeded ${parts.length} parts and ${rows.length} compatibility rows`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
