-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "netid" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "passwordVersion" TEXT,
    "entry" TIMESTAMP(3) NOT NULL,
    "dimission" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "level" INTEGER NOT NULL,
    "dorm" TEXT,
    "school" TEXT,
    "qq" TEXT,
    "phone" TEXT,
    "short" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_netid_key" ON "User"("netid");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");
