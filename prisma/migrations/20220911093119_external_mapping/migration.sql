-- CreateTable
CREATE TABLE "ExternalMapping" (
    "id" SERIAL NOT NULL,
    "netid" TEXT NOT NULL,
    "larkUnionId" TEXT NOT NULL,
    "wechatOpenId" TEXT NOT NULL,

    CONSTRAINT "ExternalMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalMapping_netid_key" ON "ExternalMapping"("netid");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalMapping_larkUnionId_key" ON "ExternalMapping"("larkUnionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalMapping_wechatOpenId_key" ON "ExternalMapping"("wechatOpenId");

-- AddForeignKey
ALTER TABLE "ExternalMapping" ADD CONSTRAINT "ExternalMapping_netid_fkey" FOREIGN KEY ("netid") REFERENCES "User"("netid") ON DELETE RESTRICT ON UPDATE CASCADE;
