import { prisma } from "../../prisma/prisma.server";

/**
 * saving automation data in database using prisma
 */
export async function createAutomation({
  storeId,
  event,
  message,
  status,
  delayMinutes,
  recipients,
}: {
  storeId: string;
  event: string;
  message: string;
  status: boolean;
  delayMinutes?: number;
  recipients: string[];
}) {
  try {
    // Check if all recipients exist
    const existingCustomers = await prisma.customer.findMany({
      where: { id: { in: recipients } },
      select: { id: true },
    });

    const existingCustomerIds = existingCustomers.map((customer) => customer.id);
    console.log("Existing customer IDs:", existingCustomerIds);

    // If some recipients are missing, log them and throw an error
    const missingRecipients = recipients.filter((id) => !existingCustomerIds.includes(id));
    if (missingRecipients.length > 0) {
      console.error("Missing recipients:", missingRecipients);
      throw new Error(`Some recipients were not found: ${missingRecipients.join(", ")}`);
    }

    // Save automation with valid recipients
    const automation = await prisma.automation.create({
      data: {
        storeId,
        event,
        message,
        status,
        delayMinutes: delayMinutes ?? 0,
        recipients: {
          create: existingCustomerIds.map((customerId) => ({
            customer: { connect: { id: customerId } },
          })),
        },
      },
      include: {
        recipients: true,
      },
    });

    return automation;
  } catch (error) {
    console.error("Error creating automation:", error);
    throw new Error("Failed to create automation");
  }
}

/**
 * Retrieves all automations for a given store ID.
 */
export async function getAutomationsForStore(storeId: string) {
  try {
    const automations = await prisma.automation.findMany({
      where: { storeId },
      include: {
        recipients: {
          include: {
            customer: true, // Fetch customer details for each recipient
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Sort by most recent automations
    });

    return automations;
  } catch (error) {
    console.error("Error fetching automations:", error);
    throw new Error("Failed to retrieve automations");
  }
}

/**
 * Updates an existing automation in the database
 */
export async function editAutomation({
  automationId,
  storeId,
  event,
  message,
  delayMinutes,
  recipients,
}: {
  automationId: string;
  storeId: string;
  event: string;
  message: string;
  delayMinutes?: number;
  recipients: string[];
}) {
  try {
    // Check if the automation exists
    const existingAutomation = await prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!existingAutomation) {
      throw new Error("Automation not found");
    }

    // Check if all recipients exist
    const existingCustomers = await prisma.customer.findMany({
      where: { id: { in: recipients } },
      select: { id: true },
    });

    const existingCustomerIds = existingCustomers.map((customer) => customer.id);
    console.log("Existing customer IDs:", existingCustomerIds);

    // Find missing recipients
    const missingRecipients = recipients.filter((id) => !existingCustomerIds.includes(id));
    if (missingRecipients.length > 0) {
      console.error("Missing recipients:", missingRecipients);
      throw new Error(`Some recipients were not found: ${missingRecipients.join(", ")}`);
    }

    // Update the automation
    const updatedAutomation = await prisma.automation.update({
      where: { id: automationId },
      data: {
        event,
        message,
        delayMinutes: delayMinutes ?? 0,
        recipients: {
          deleteMany: {}, // Remove existing recipients
          create: existingCustomerIds.map((customerId) => ({
            customer: { connect: { id: customerId } },
          })),
        },
      },
      include: {
        recipients: true,
      },
    });

    return updatedAutomation;
  } catch (error) {
    console.error("Error updating automation:", error);
    throw new Error("Failed to update automation");
  }
}