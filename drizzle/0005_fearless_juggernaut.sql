CREATE TYPE "public"."notification_type" AS ENUM('new_order', 'new_user', 'payment_update', 'system_alert');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" DEFAULT 'system_alert' NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"action_url" text,
	"resource_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_is_read_idx" ON "notification" USING btree ("is_read");