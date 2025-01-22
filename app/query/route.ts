import { db } from "@vercel/postgres";

// Wrap async logic inside an async function
async function connectToDatabase() {
  const client = await db.connect();
  return client;
}

async function listInvoices(client) {
  const data = await client.sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
  return data.rows;
}

export async function GET() {
  const client = await connectToDatabase(); // Ensure async is inside a function

  try {
    const invoices = await listInvoices(client);
    return Response.json({ message: 'Invoices fetched successfully', data: invoices });
  } catch (error) {
    return Response.json({ error: 'An error occurred while fetching invoices' }, { status: 500 });
  }
}
