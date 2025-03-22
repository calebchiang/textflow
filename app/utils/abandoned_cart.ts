import { prisma } from "../../prisma/prisma.server";

/**
 * Saves an abandoned cart entry to the database.
 */
export async function saveAbandonedCart({
  storeId,
  checkoutId,
  customerId,
}: {
  storeId: string;
  checkoutId: string;
  customerId?: string; // Optional since guest users may not have an ID
}) {
  try {
    // Check if an abandoned cart already exists for this checkout
    const existingCart = await prisma.abandonedCart.findUnique({
      where: { checkoutId },
    });

    if (existingCart) {
      console.log(`⚠️ Abandoned cart already exists for checkout: ${checkoutId}`);
      return existingCart;
    }

    // Calculate expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create a new abandoned cart entry
    const abandonedCart = await prisma.abandonedCart.create({
      data: {
        storeId,
        checkoutId,
        customerId: customerId || null, // Handle guest users
        expiresAt,
      },
    });

    console.log(`✅ Saved abandoned cart for checkout: ${checkoutId}`);
    return abandonedCart;
  } catch (error) {
    console.error("❌ Error saving abandoned cart:", error);
    throw new Error("Failed to save abandoned cart");
  }
}

/**
 * Fetches all expired abandoned carts (carts where expiresAt is in the past).
 */
export async function getExpiredAbandonedCarts() {
  try {
    const now = new Date();

    const expiredCarts = await prisma.abandonedCart.findMany({
      where: {
        expiresAt: {
          lte: now, // Find carts where expiresAt is less than or equal to the current time
        },
      },
      include: {
        customer: true, // Include customer details to access phone number
      },
    });

    console.log(`📌 Found ${expiredCarts.length} expired abandoned carts.`);
    return expiredCarts;
  } catch (error) {
    console.error("❌ Error fetching expired abandoned carts:", error);
    throw new Error("Failed to fetch expired abandoned carts");
  }
}
