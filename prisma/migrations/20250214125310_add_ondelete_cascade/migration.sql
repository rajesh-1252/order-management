-- DropForeignKey
ALTER TABLE "OrderProductMap" DROP CONSTRAINT "OrderProductMap_orderId_fkey";

-- AddForeignKey
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
