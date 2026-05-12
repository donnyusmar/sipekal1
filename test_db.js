require('dotenv').config({ path: 'sipekal1/.env' });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
async function test() {
  try {
    const res = await sql`SELECT 1`;
    console.log(res);
  } catch (e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
test();
