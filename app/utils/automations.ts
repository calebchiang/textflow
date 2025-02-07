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
    console.log("Received recipients:", recipients);

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
