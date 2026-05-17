-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic" VARCHAR(255),
    "score" INTEGER,
    "strong" TEXT,
    "weak" TEXT,
    "summary" TEXT,
    "next_rec" TEXT,
    "duration" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_messages" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diary_rules" (
    "id" UUID NOT NULL,
    "lesson_id" UUID,
    "topic" VARCHAR(255),
    "title" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diary_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lessons_status_idx" ON "lessons"("status");

-- CreateIndex
CREATE INDEX "lessons_date_idx" ON "lessons"("date");

-- CreateIndex
CREATE INDEX "lesson_messages_lesson_id_idx" ON "lesson_messages"("lesson_id");

-- CreateIndex
CREATE INDEX "diary_rules_topic_idx" ON "diary_rules"("topic");

-- AddForeignKey
ALTER TABLE "lesson_messages" ADD CONSTRAINT "lesson_messages_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diary_rules" ADD CONSTRAINT "diary_rules_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
