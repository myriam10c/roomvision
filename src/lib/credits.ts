import { prisma } from './prisma'

export async function deductCredits(userId: string, amount: number = 1, reason?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.credits < amount) {
    throw new Error('Insufficient credits')
  }
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
    }),
    prisma.creditTransaction.create({
      data: { userId, amount: -amount, type: 'USAGE', reason },
    }),
  ])
  
  return user.credits - amount
}

export async function addCredits(userId: string, amount: number, reason?: string) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: { userId, amount, type: 'PURCHASE', reason },
    }),
  ])
}
