import { prisma } from "../../prisma/prisma.server";
import { GraphQLClient, gql } from "graphql-request";

/**
 * Fetches customers from Shopify Admin API and saves them in the database.
 */
export async function syncCustomersFromShopify(storeId: string, accessToken: string) {
  const endpoint = `https://${storeId}/admin/api/2024-01/graphql.json`;

  const client = new GraphQLClient(endpoint, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  const query = gql`
    query {
      customers(first: 100) {
        edges {
          node {
            id
            firstName
            lastName
            email
            phone
            createdAt
          }
        }
      }
    }
  `;

  try {
    // Fetch customers from Shopify
    const data = await client.request(query);
    const customers = data.customers.edges.map((edge) => edge.node);

    let addedCount = 0;

    // Store customers in database
    for (const customer of customers) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { id: customer.id },
      });

      if (!existingCustomer) {
        await prisma.customer.create({
          data: {
            id: customer.id,
            storeId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phone,
            createdAt: new Date(customer.createdAt),
          },
        });
        addedCount++;
      }
    }

    console.log(`✅ Synced ${addedCount} new customers for ${storeId}`);

    return { success: true, count: addedCount };
  } catch (error) {
    console.error("❌ Error syncing customers:", error);
    return { success: false, error: "Failed to sync customers" };
  }
}

/**
 * Fetches all customers linked to a given store ID.
 */
export async function getCustomersForStore(storeId: string) {
  return await prisma.customer.findMany({
    where: { storeId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
  });
}

/**
 * Adds a new customer to the database if they don't already exist.
 */
export async function addCustomerToDatabase(customer: {
  id: string;
  storeId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  createdAt: string;
}) {
  try {
    // Check if the customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customer.id },
    });

    if (existingCustomer) {
      console.log(`✅ Customer ${customer.id} already exists in the database.`);
      return { success: false, message: "Customer already exists" };
    }

    // Insert the new customer
    await prisma.customer.create({
      data: {
        id: customer.id,
        storeId: customer.storeId,
        firstName: customer.firstName || null,
        lastName: customer.lastName || null,
        email: customer.email || null,
        phoneNumber: customer.phoneNumber || null,
        createdAt: new Date(customer.createdAt), // Ensure correct timestamp format
      },
    });

    console.log(`✅ New customer ${customer.id} added to the database.`);
    return { success: true, message: "Customer added successfully" };
  } catch (error) {
    console.error("❌ Error adding customer to the database:", error);
    return { success: false, message: "Database error" };
  }
}
