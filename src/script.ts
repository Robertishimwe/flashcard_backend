import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newflashcard = await prisma.flashCard.create({
    data: {
      category: "tech",
      title: "what is GraphQL?",
      description:
        "GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.",
      done: false,
    },
  });
  const allflashcards = await prisma.flashCard.findMany();
  console.log(allflashcards);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
