import { addCustomerToDatabase, updateCustomerInDatabase, deleteCustomerFromDatabase } from "../utils/customers";

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

export async function handleCustomerUpdateWebhook(shop: string, payload: any) {
    try {
      console.log(`📩 Handling CUSTOMER UPDATE webhook for shop: ${shop}`);
  
      const customerData = {
        id: payload.id.toString(), // Ensure ID is stored as a string
        storeId: shop,
        firstName: payload.first_name || null,
        lastName: payload.last_name || null,
        email: payload.email || null,
        phoneNumber: payload.phone || null,
      };
  
      // Update customer in the database
      const result = await updateCustomerInDatabase(customerData);
  
      if (result.success) {
        console.log(`✅ Customer ${customerData.id} updated successfully.`);
      } else {
        console.warn(`⚠️ Customer ${customerData.id} not found, could not update.`);
      }
  
      return { success: true };
    } catch (error) {
      console.error("❌ Error processing CUSTOMER UPDATE webhook:", error);
      return { success: false, error: "Failed to process customer update webhook" };
    }
  }

  export async function handleCustomerDeleteWebhook(shop: string, payload: any) {
    try {
      console.log(`📩 Handling CUSTOMER DELETE webhook for shop: ${shop}`);
  
      const customerId = payload.id.toString(); // Ensure ID is stored as a string
  
      // Delete customer from the database
      const result = await deleteCustomerFromDatabase(customerId);
  
      if (result.success) {
        console.log(`✅ Customer ${customerId} deleted successfully.`);
      } else {
        console.warn(`⚠️ Customer ${customerId} not found, could not delete.`);
      }
  
      return { success: true };
    } catch (error) {
      console.error("❌ Error processing CUSTOMER DELETE webhook:", error);
      return { success: false, error: "Failed to process customer delete webhook" };
    }
  }