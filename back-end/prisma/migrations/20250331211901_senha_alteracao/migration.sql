/*
  Warnings:

  - Made the column `senha` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `senha` VARCHAR(191) NOT NULL;
