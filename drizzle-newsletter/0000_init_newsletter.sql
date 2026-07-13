CREATE TABLE "newsletterSubscription" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"confirmationTokenHash" text,
	"confirmationTokenExpiresAt" timestamp with time zone,
	"confirmationSentAt" timestamp with time zone,
	"confirmedAt" timestamp with time zone,
	"unsubscribedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "newsletterSubscription_email_unique" ON "newsletterSubscription" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletterSubscription_confirmationTokenHash_unique" ON "newsletterSubscription" USING btree ("confirmationTokenHash");--> statement-breakpoint
CREATE INDEX "newsletterSubscription_status_idx" ON "newsletterSubscription" USING btree ("status");