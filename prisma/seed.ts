import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@vexyn.app" },
    update: {},
    create: {
      email: "admin@vexyn.app",
      name: "Admin Vexyn",
      role: "ADMIN",
    },
  });

  await prisma.marketplaceApp.upsert({
    where: { slug: "finance-app" },
    update: {},
    create: {
      slug: "finance-app",
      name: "Finance App",
      description: "Controle financeiro e visualização de transações.",
      owned: true,
    },
  });

  await prisma.marketplaceApp.upsert({
    where: { slug: "productivity-app" },
    update: {},
    create: {
      slug: "productivity-app",
      name: "Productivity App",
      description: "Ferramentas de produtividade para equipes.",
      owned: false,
    },
  });

  await prisma.financeTransaction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      title: "Venda de assinatura",
      amount: 120.0,
      type: "income",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
