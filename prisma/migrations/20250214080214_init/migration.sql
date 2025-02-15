-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "orderDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProductMap" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "OrderProductMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderProductMap_orderId_productId_key" ON "OrderProductMap"("orderId", "productId");

-- AddForeignKey
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
