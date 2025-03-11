import { addCustomerToDatabase } from "../utils/customers";

export async function handleCustomerCreateWebhook(shop: string, payload: any) {
  try {
    console.log(`📩 Handling CUSTOMER CREATE webhook for shop: ${shop}`);

    const customerData = {
      id: payload.id.toString(), // Ensure ID is stored as a string
      storeId: shop,
      firstName: payload.first_name || null,
      lastName: payload.last_name || null,
      email: payload.email || null,
      phoneNumber: payload.phone || null,
      createdAt: new Date(payload.created_at),
    };

    // Add customer to database
    const result = await addCustomerToDatabase(customerData);

    if (result.success) {
      console.log(`✅ Customer ${customerData.id} added successfully.`);
    } else {
      console.warn(`⚠️ Customer ${customerData.id} already exists.`);
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error processing CUSTOMER CREATE webhook:", error);
    return { success: false, error: "Failed to process customer webhook" };
  }
}
