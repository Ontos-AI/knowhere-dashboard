CREATE TABLE "mcpAuthorizationCode" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"codeHash" text NOT NULL,
	"redirectUri" text NOT NULL,
	"codeChallenge" text NOT NULL,
	"clientName" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"consumedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcpRefreshToken" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"tokenHash" text NOT NULL,
	"name" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"revokedAt" timestamp with time zone,
	"lastUsedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mcpAuthorizationCode" ADD CONSTRAINT "mcpAuthorizationCode_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcpRefreshToken" ADD CONSTRAINT "mcpRefreshToken_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mcpAuthorizationCode_codeHash_unique" ON "mcpAuthorizationCode" USING btree ("codeHash");--> statement-breakpoint
CREATE INDEX "mcpAuthorizationCode_userId_idx" ON "mcpAuthorizationCode" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "mcpRefreshToken_tokenHash_unique" ON "mcpRefreshToken" USING btree ("tokenHash");--> statement-breakpoint
CREATE INDEX "mcpRefreshToken_userId_idx" ON "mcpRefreshToken" USING btree ("userId");