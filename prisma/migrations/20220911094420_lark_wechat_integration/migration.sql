/*
  Warnings:

  - You are about to drop the `ExternalMapping` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[larkUnionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wechatOpenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ExternalMapping" DROP CONSTRAINT "ExternalMapping_netid_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "larkUnionId" TEXT,
ADD COLUMN     "wechatOpenId" TEXT;

-- DropTable
DROP TABLE "ExternalMapping";

-- CreateIndex
CREATE UNIQUE INDEX "User_larkUnionId_key" ON "User"("larkUnionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_wechatOpenId_key" ON "User"("wechatOpenId");
