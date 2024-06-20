import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Start transaction
  await prisma.$executeRaw`BEGIN;`
})

afterEach(async () => {
  // Rollback transaction
  await prisma.$executeRaw`ROLLBACK;`
})
