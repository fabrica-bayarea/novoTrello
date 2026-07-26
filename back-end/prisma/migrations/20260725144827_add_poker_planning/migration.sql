-- CreateTable
CREATE TABLE "public"."PokerSession" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokerSessionTask" (
    "sessionId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PokerSessionTask_pkey" PRIMARY KEY ("sessionId","taskId")
);

-- CreateIndex
CREATE INDEX "PokerSession_boardId_idx" ON "public"."PokerSession"("boardId");

-- CreateIndex
CREATE INDEX "PokerSession_createdById_idx" ON "public"."PokerSession"("createdById");

-- CreateIndex
CREATE INDEX "PokerSessionTask_taskId_idx" ON "public"."PokerSessionTask"("taskId");

-- AddForeignKey
ALTER TABLE "public"."PokerSession" ADD CONSTRAINT "PokerSession_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokerSession" ADD CONSTRAINT "PokerSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokerSessionTask" ADD CONSTRAINT "PokerSessionTask_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."PokerSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokerSessionTask" ADD CONSTRAINT "PokerSessionTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
