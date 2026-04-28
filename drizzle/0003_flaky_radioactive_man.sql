ALTER TABLE "user" ADD COLUMN "usageWelcomeStatus" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "usageWelcomeApiKey" text;
--> statement-breakpoint
UPDATE "user" SET "usageWelcomeStatus" = 'hidden' WHERE "usageWelcomeStatus" = 'pending';
