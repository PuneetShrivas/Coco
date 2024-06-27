-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "productQuestions" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "baseImageURL" TEXT,
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User_Meta" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "long" DOUBLE PRECISION;
