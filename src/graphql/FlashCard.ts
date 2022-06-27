import {
  booleanArg,
  extendType,
  nonNull,
  enumType,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  list,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { Prisma } from "@prisma/client";

export const FlashCard = objectType({
  name: "FlashCard",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("category");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.boolean("done");
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.flashCard
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
  },
});
export const FlashCardOrderByInput = inputObjectType({
  name: "FlashCardOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("title", { type: Sort });
    t.field("category", { type: Sort });
    t.field("id", { type: Sort });
  },
});
export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const FlashCardQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("flashCardlist", {
      type: "FlashCard",
      args: {
        orderBy: arg({ type: list(nonNull(FlashCardOrderByInput)) }),
      },
      resolve(parent, args, context, info) {
        return context.prisma.flashCard.findMany({
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.FlashCardOrderByWithRelationInput>
            | undefined,
        });
      },
    });
  },
});

export const FlashCardMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("create", {
      type: "FlashCard",
      args: {
        category: nonNull(stringArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        done: nonNull(booleanArg()),
      },

      resolve(parent, args, context) {
        const { userId } = context;
        if (!userId) {
          throw new Error("Cannot post a flashcard without logging in.");
        }
        const newflashcard = context.prisma.flashCard.create({
          data: {
            category: args.category,
            title: args.title,
            description: args.description,
            done: args.done,
            postedBy: { connect: { id: userId } },
          },
        });
        return newflashcard;
      },
      // const { category, title, description, done } = args; // 4

      // let idCount = flashCards.length + 1; // 5
      //   const flashCard = {
      //     id: idCount,
      //     category: category,
      //     title: title,
      //     description: description,
      //     done: done,
      //   };
      //   flashCards.push(flashCard);
      //   return flashCard;
      // },
    });
  },
});
