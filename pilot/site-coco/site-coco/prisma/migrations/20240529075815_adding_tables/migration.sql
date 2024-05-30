/*
  Warnings:

  - A unique constraint covering the columns `[metaId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prefsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metaId" TEXT,
ADD COLUMN     "prefsId" TEXT;

-- CreateTable
CREATE TABLE "User_Meta" (
    "id" TEXT NOT NULL,
    "height" TEXT,
    "hairColor" TEXT,
    "dressingSize" TEXT,
    "seasonColors" TEXT[],
    "age" TEXT,
    "skinTone" TEXT,
    "stylingSeason" TEXT,
    "irisColor" TEXT,
    "ethnicity" TEXT,
    "bodyType" TEXT,
    "genderFemale" BOOLEAN,

    CONSTRAINT "User_Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Pref" (
    "id" TEXT NOT NULL,
    "dislikes" JSONB,
    "likes" JSONB,

    CONSTRAINT "User_Pref_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Meta_id_key" ON "User_Meta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Pref_id_key" ON "User_Pref"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_metaId_key" ON "User"("metaId");

-- CreateIndex
CREATE UNIQUE INDEX "User_prefsId_key" ON "User"("prefsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "User_Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_prefsId_fkey" FOREIGN KEY ("prefsId") REFERENCES "User_Pref"("id") ON DELETE CASCADE ON UPDATE CASCADE;
