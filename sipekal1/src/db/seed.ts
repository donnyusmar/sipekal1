import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, tickets } from './schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
  const connectionString = process.env.DATABASE_URL!;
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  console.log('Seeding data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const newUsers = await db.insert(users).values([
    {
      email: 'admin@test.com',
      password: passwordHash,
      name: 'Admin Sarpras',
      role: 'ADMIN',
    },
    {
      email: 'user@test.com',
      password: passwordHash,
      name: 'Staf Unit',
      role: 'STAF',
    },
    {
      email: 'teknisi@test.com',
      password: passwordHash,
      name: 'Teknisi 1',
      role: 'TEKNISI',
    },
  ]).returning();

  console.log('Users seeded');


  const userId = newUsers[1].id;
  const teknisiId = newUsers[2].id;

  const ticketsData = [];
  for (let i = 0; i < 5; i++) {
    ticketsData.push({
      judul: `Kerusakan PC ${i + 1}`,
      lokasi: `Ruang ${i + 1}`,
      prioritas: 'RENDAH' as const,
      status: 'MENUNGGU' as const,
      pelaporId: userId,
    });
  }
  for (let i = 0; i < 5; i++) {
    ticketsData.push({
      judul: `AC Mati ${i + 1}`,
      lokasi: `Ruang ${i + 6}`,
      prioritas: 'SEDANG' as const,
      status: 'PROSES' as const,
      pelaporId: userId,
      teknisiId: teknisiId,
    });
  }
  for (let i = 0; i < 5; i++) {
    ticketsData.push({
      judul: `Proyektor Rusak ${i + 1}`,
      lokasi: `Ruang ${i + 11}`,
      prioritas: 'TINGGI' as const,
      status: 'SELESAI' as const,
      pelaporId: userId,
      teknisiId: teknisiId,
    });
  }

  await db.insert(tickets).values(ticketsData);
  console.log('Tickets seeded');

  await sql.end();
};

seed().catch(console.error);
