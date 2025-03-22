import { prisma } from "../../prisma/prisma.server";

/**
 * Fetches all `send_limited_time_promotion` automations for a given store, including recipients.
 */
export async function getPromotionAutomations(storeId: string) {
  try {
    const automations = await prisma.automation.findMany({
      where: {
        storeId: storeId,
        event: "send_limited_time_promotion",
        status: true, // Only fetch enabled automations
      },
      include: {
        recipients: {
          include: {
            customer: true, // Fetch recipient details
          },
        },
      },
    });

    return automations;
  } catch (error) {
    console.error("Error fetching promotion automations:", error);
    throw new Error("Failed to retrieve promotion automations");
  }
}

/**
 * Checks if a customer is a recipient of any `send_limited_time_promotion` automation.
 */
export async function getMatchingPromotionAutomations(storeId: string, customerId: string) {
  try {
    const automations = await prisma.automation.findMany({
      where: {
        storeId: storeId,
        event: "send_limited_time_promotion",
        status: true,
        recipients: {
          some: { customerId: customerId },
        },
      },
      include: {
        recipients: {
          include: {
            customer: true,
          },
        },
      },
    });

    return automations;
  } catch (error) {
    console.error("Error checking matching promotion automations:", error);
    throw new Error("Failed to check matching promotion automations");
  }
}

/**
 * Retrieves the SMS message content for a `send_limited_time_promotion` automation.
 */
export async function getPromotionMessage(automationId: string) {
  try {
    const automation = await prisma.automation.findUnique({
      where: { id: automationId },
      select: { message: true },
    });

    if (!automation) {
      throw new Error("Automation not found");
    }

    return automation.message;
  } catch (error) {
    console.error("Error fetching promotion message:", error);
    throw new Error("Failed to retrieve promotion message");
  }
}

export async function getPromotionAutomationById(automationId: string) {
    try {
      return await prisma.automation.findUnique({
        where: { id: automationId },
        include: {
          recipients: {
            include: { customer: true },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching promotion automation by ID:", error);
      throw new Error("Failed to retrieve automation");
    }
  }
  