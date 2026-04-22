CREATE TABLE "attendances" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"check_in" timestamp DEFAULT now(),
	"check_out" timestamp,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "absensi-users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "absensi-users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_user_id_absensi-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."absensi-users"("id") ON DELETE no action ON UPDATE no action;