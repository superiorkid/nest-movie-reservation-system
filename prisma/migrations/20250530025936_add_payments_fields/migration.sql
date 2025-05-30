-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "payment_intent_id" TEXT,
ADD COLUMN     "payment_method" TEXT;
