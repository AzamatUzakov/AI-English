"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_service_1 = require("../src/prisma/prisma.service");
const prisma = new prisma_service_1.PrismaService();
async function main() {
    const topics = ['Test Lesson 1', 'Test Lesson 2', 'Test Lesson 3'];
    const now = new Date().toISOString();
    for (const topic of topics) {
        await prisma.lesson.create({
            data: {
                topic,
                status: 'active',
                date: now,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        console.log(`Created lesson: ${topic}`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create_test_lessons.js.map