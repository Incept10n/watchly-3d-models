-- CreateEnum
CREATE TYPE "PartType" AS ENUM ('CASE', 'MOVEMENT', 'DIAL', 'BEZEL', 'HANDS', 'ROTOR', 'CRYSTAL');

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PartType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "modelUrl" TEXT NOT NULL,
    "itemUrl" TEXT NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartCompatibility" (
    "part1Id" INTEGER NOT NULL,
    "part2Id" INTEGER NOT NULL,

    CONSTRAINT "PartCompatibility_pkey" PRIMARY KEY ("part1Id","part2Id")
);

-- AddForeignKey
ALTER TABLE "PartCompatibility" ADD CONSTRAINT "PartCompatibility_part1Id_fkey" FOREIGN KEY ("part1Id") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartCompatibility" ADD CONSTRAINT "PartCompatibility_part2Id_fkey" FOREIGN KEY ("part2Id") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
