import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder only: real password hashing arrives with the auth API (PLAN task 4),
// which will also update this seed so the demo account can actually sign in.
const PLACEHOLDER_HASH = "!not-a-real-hash";

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: "demo@teamtasker.dev" },
    update: {},
    create: { email: "demo@teamtasker.dev", name: "Demo User", passwordHash: PLACEHOLDER_HASH },
  });

  const existing = await prisma.workspace.findFirst({
    where: { name: "Demo Team", memberships: { some: { userId: demo.id } } },
  });
  if (existing) {
    console.log("Seed data already present, nothing to do.");
    return;
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Team",
      memberships: { create: { userId: demo.id, role: "OWNER" } },
      labels: {
        create: [
          { name: "bug", color: "#dc2626" },
          { name: "feature", color: "#2563eb" },
        ],
      },
      projects: {
        create: {
          name: "Website Launch",
          description: "Sample project created by the seed script.",
          tasks: {
            create: [
              {
                title: "Write launch announcement",
                status: "TODO",
                priority: "HIGH",
                position: 1,
                creatorId: demo.id,
              },
              {
                title: "Design landing page",
                status: "DOING",
                priority: "MEDIUM",
                position: 1,
                creatorId: demo.id,
                assigneeId: demo.id,
              },
              {
                title: "Set up analytics",
                status: "DONE",
                priority: "LOW",
                position: 1,
                creatorId: demo.id,
              },
            ],
          },
        },
      },
    },
  });
  console.log(`Seeded workspace "${workspace.name}".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
