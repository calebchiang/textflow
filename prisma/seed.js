import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("🌱 Seeding test data...");

  try {
    const customers = await prisma.customer.createMany({
      data: [
        {
          id: "test_customer_1",
          storeId: "textflow-dev.myshopify.com",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "1234567890",
        },
        {
          id: "test_customer_2",
          storeId: "textflow-dev.myshopify.com",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phoneNumber: "9876543210",
        },
        {
          id: "test_customer_3",
          storeId: "textflow-dev.myshopify.com",
          firstName: "Alice",
          lastName: "Brown",
          email: "alice@example.com",
          phoneNumber: "5555555555",
        },
      ],
      skipDuplicates: true,
    });

    console.log("✅ Test customers seeded:", customers);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
