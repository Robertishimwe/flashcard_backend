import { objectType } from "nexus";
//user
export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("flashCards", {
      type: "FlashCard",
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .flashCards();
      },
    });
  },
});
