const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const User = prisma.user
const Element = prisma.element
export { 
User,Element
}




