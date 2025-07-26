/*
  Warnings:

  - Added the required column `authorIv` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleIv` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Clipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Reflection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "authorIv" TEXT NOT NULL,
ADD COLUMN     "titleIv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Clipping" ADD COLUMN     "iv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reflection" ADD COLUMN     "iv" TEXT NOT NULL;
