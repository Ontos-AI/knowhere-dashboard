CREATE TABLE "blogDelivery" (
	"id" text PRIMARY KEY NOT NULL,
	"wordpressPostId" text NOT NULL,
	"email" text NOT NULL,
	"postTitle" text NOT NULL,
	"source" text NOT NULL,
	"status" text NOT NULL,
	"resendId" text,
	"error" text,
	"sentAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogEmailCursor" (
	"id" text PRIMARY KEY NOT NULL,
	"seededAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogEmailPreviewRequest" (
	"id" text PRIMARY KEY NOT NULL,
	"requestedAt" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"completedAt" timestamp with time zone,
	"result" text,
	"wordpressPostId" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "blogEmailSettings" (
	"id" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"audience" text DEFAULT 'test' NOT NULL,
	"testRecipient" text,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogEmailSuppression" (
	"email" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogPostDispatch" (
	"wordpressPostId" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"publishedAt" timestamp with time zone NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"sentAt" timestamp with time zone,
	"lastError" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "blogDelivery_post_email_unique" ON "blogDelivery" USING btree ("wordpressPostId","email");--> statement-breakpoint
CREATE INDEX "blogDelivery_sentAt_idx" ON "blogDelivery" USING btree ("sentAt");--> statement-breakpoint
CREATE INDEX "blogDelivery_email_idx" ON "blogDelivery" USING btree ("email");--> statement-breakpoint
CREATE INDEX "blogPostDispatch_status_publishedAt_idx" ON "blogPostDispatch" USING btree ("status","publishedAt");