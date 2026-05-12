import { pgTable, text, timestamp, uuid, pgEnum, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "STAF", "TEKNISI"]);
export const prioritasEnum = pgEnum("prioritas", ["RENDAH", "SEDANG", "TINGGI"]);
export const statusEnum = pgEnum("status", ["MENUNGGU", "PROSES", "SELESAI"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  lokasi: varchar("lokasi", { length: 255 }).notNull(),
  prioritas: prioritasEnum("prioritas").notNull(),
  fotoUrl: text("foto_url"),
  status: statusEnum("status").default("MENUNGGU").notNull(),
  catatan: text("catatan"),
  pelaporId: uuid("pelapor_id").references(() => users.id).notNull(),
  teknisiId: uuid("teknisi_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
