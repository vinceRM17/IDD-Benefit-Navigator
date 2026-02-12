CREATE TYPE "public"."referral_status" AS ENUM('sent', 'viewed');--> statement-breakpoint
CREATE TABLE "email_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email_type" text NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"program_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"partner_org_id" text NOT NULL,
	"partner_email" text NOT NULL,
	"family_name" text NOT NULL,
	"family_email" text NOT NULL,
	"family_phone" text,
	"eligible_programs" jsonb NOT NULL,
	"family_note" text,
	"status" "referral_status" DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"viewed_at" timestamp,
	"postmark_message_id" text
);
--> statement-breakpoint
CREATE TABLE "reminder_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"program_id" text NOT NULL,
	"reminder_enabled_60" boolean DEFAULT true NOT NULL,
	"reminder_enabled_30" boolean DEFAULT true NOT NULL,
	"reminder_enabled_7" boolean DEFAULT true NOT NULL,
	"recertification_date" timestamp,
	"estimated_recert_date" timestamp,
	"last_reminder_sent" timestamp
);
--> statement-breakpoint
CREATE TABLE "screenings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"screening_data" jsonb NOT NULL,
	"results" jsonb NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminder_preferences" ADD CONSTRAINT "reminder_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;