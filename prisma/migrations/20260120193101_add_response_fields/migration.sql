-- AlterTable
ALTER TABLE "FarmerResponse" ADD COLUMN     "message" TEXT,
ADD COLUMN     "pricePerKg" DOUBLE PRECISION NOT NULL DEFAULT 0;
