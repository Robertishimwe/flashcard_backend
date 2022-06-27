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
  idArg,
  intArg,
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
        const { userId } = context;
        if (!userId) {
          throw new Error("Cannot view a flashcards without logging in.");
        }
        return context.prisma.flashCard.findMany({
          where: { postedBy: { id: userId } },
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
        const newflashcard: any = context.prisma.flashCard.create({
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
    });
  },
});

export const FlashCardUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updatecard", {
      type: "FlashCard",
      args: {
        id: nonNull(intArg()),
      },

      resolve(parent, args, context) {
        const { userId } = context;
        const { id } = args;

        if (!userId) {
          throw new Error("Cannot update a flashcard without logging in.");
        }
        if (!id) {
          throw new Error("Cannot update a flashcard without an id.");
        }
        const newflashcard = context.prisma.flashCard.update({
          where: { id: args.id },
          data: {
            done: true,
          },
        });
        return newflashcard;
      },
    });
  },
});
