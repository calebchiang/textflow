import { prisma } from "../../prisma/prisma.server";

/**
 * Fetches all `order_shipped` automations for a given store, including recipients.
 */
export async function getOrderShippedAutomations(storeId: string) {
    try {
      const automations = await prisma.automation.findMany({
        where: {
          storeId: storeId,
          event: "order_shipped",
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
      console.error("Error fetching order shipped automations:", error);
      throw new Error("Failed to retrieve order shipped automations");
    }
}

/**
 * Checks if a customer is a recipient of any `order_shipped` automation.
 */
export async function getMatchingOrderShippedAutomations(storeId: string, customerId: string) {
    try {
      const automations = await prisma.automation.findMany({
        where: {
          storeId: storeId,
          event: "order_shipped",
          status: true, // Only fetch enabled automations
          recipients: {
            some: { customerId: customerId }, // Check if the customer is linked
          },
        },
        include: {
          recipients: {
            include: {
              customer: true, // Fetch customer details for reference
            },
          },
        },
      });

      return automations;
    } catch (error) {
      console.error("Error checking matching order shipped automations:", error);
      throw new Error("Failed to check matching order shipped automations");
    }
}

/**
 * Retrieves the SMS message content for an `order_shipped` automation.
 */
export async function getOrderShippedMessage(automationId: string) {
    try {
      const automation = await prisma.automation.findUnique({
        where: { id: automationId },
        select: { message: true }, // Only fetch the message content
      });

      if (!automation) {
        throw new Error("Automation not found");
      }

      return automation.message; // Message may contain placeholders like {first_name}
    } catch (error) {
      console.error("Error fetching order shipped message:", error);
      throw new Error("Failed to retrieve order shipped message");
    }
}
