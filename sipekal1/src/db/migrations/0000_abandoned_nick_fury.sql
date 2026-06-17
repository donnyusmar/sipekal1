CREATE TYPE "public"."prioritas" AS ENUM('RENDAH', 'SEDANG', 'TINGGI');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'STAF', 'TEKNISI');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('MENUNGGU', 'PROSES', 'SELESAI');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(255) NOT NULL,
	"lokasi" varchar(255) NOT NULL,
	"prioritas" "prioritas" NOT NULL,
	"foto_url" text,
	"status" "status" DEFAULT 'MENUNGGU' NOT NULL,
	"catatan" text,
	"pelapor_id" uuid NOT NULL,
	"teknisi_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_pelapor_id_users_id_fk" FOREIGN KEY ("pelapor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_teknisi_id_users_id_fk" FOREIGN KEY ("teknisi_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;