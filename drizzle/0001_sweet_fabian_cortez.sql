CREATE TABLE "emailVerificationToken" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "emailVerificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "emailVerificationToken" ADD CONSTRAINT "emailVerificationToken_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;