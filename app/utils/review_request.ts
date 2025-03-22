import { prisma } from "../../prisma/prisma.server";

/**
 * Fetches all `review_request` automations for a given store, including recipients.
 */
export async function getReviewRequestAutomations(storeId: string) {
    try {
        const automations = await prisma.automation.findMany({
            where: {
                storeId: storeId,
                event: "review_request",
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
        console.error("❌ Error fetching review request automations:", error);
        throw new Error("Failed to retrieve review request automations");
    }
}

/**
 * Checks if a customer is a recipient of any `review_request` automation.
 */
export async function getMatchingReviewRequestAutomations(storeId: string, customerId: string) {
    try {
        const automations = await prisma.automation.findMany({
            where: {
                storeId: storeId,
                event: "review_request",
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
        console.error("❌ Error checking matching review request automations:", error);
        throw new Error("Failed to check matching review request automations");
    }
}

/**
 * Retrieves the SMS message content for a `review_request` automation.
 */
export async function getReviewRequestMessage(automationId: string) {
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
        console.error("❌ Error fetching review request message:", error);
        throw new Error("Failed to retrieve review request message");
    }
}
