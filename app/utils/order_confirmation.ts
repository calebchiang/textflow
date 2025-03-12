import { prisma } from "../../prisma/prisma.server";

/**
 * Fetches all `order_confirmation` automations for a given store, including recipients.
 */
export async function getOrderConfirmationAutomations(storeId: string) {
    try {
      const automations = await prisma.automation.findMany({
        where: {
          storeId: storeId,
          event: "order_confirmation",
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
      console.error("Error fetching order confirmation automations:", error);
      throw new Error("Failed to retrieve order confirmation automations");
    }
  }

/**
 * Checks if a customer is a recipient of any `order_confirmation` automation.
 */
export async function getMatchingOrderConfirmationAutomations(storeId: string, customerId: string) {
    try {
      const automations = await prisma.automation.findMany({
        where: {
          storeId: storeId,
          event: "order_confirmation",
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
      console.error("Error checking matching order confirmation automations:", error);
      throw new Error("Failed to check matching order confirmation automations");
    }
  }

/**
 * Retrieves the SMS message content for an `order_confirmation` automation.
 */
export async function getOrderConfirmationMessage(automationId: string) {
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
      console.error("Error fetching order confirmation message:", error);
      throw new Error("Failed to retrieve order confirmation message");
    }
  }
  