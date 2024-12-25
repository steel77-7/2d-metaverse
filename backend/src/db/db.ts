
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Element = prisma.element;
const User = prisma.user;
const Avatar = prisma.avatar;

export { User, Avatar ,Element};
