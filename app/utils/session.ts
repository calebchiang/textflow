import { prisma } from "../../prisma/prisma.server";

/**
 * Checks if a store has completed setup.
 */
export async function hasCompletedSetup(shop: string) {
  const session = await prisma.session.findFirst({
    where: { shop },
    select: { hasCompletedSetup: true },
  });

  return session?.hasCompletedSetup ?? false;
}

/**
 * Marks a store as having completed setup.
 */
export async function markSetupComplete(shop: string) {
  await prisma.session.updateMany({
    where: { shop },
    data: { hasCompletedSetup: true },
  });
}
