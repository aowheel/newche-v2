/*
  Warnings:

  - You are about to drop the column `attendance` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'UNDECIDED');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "attendance",
ADD COLUMN     "status" "Status" NOT NULL;
