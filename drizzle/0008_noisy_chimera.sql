CREATE TABLE "marketing_attribution_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"channel" text NOT NULL,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"oppref" text,
	"landing_path" text NOT NULL,
	"referrer_host" text,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bound_user_id" text,
	"bound_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "marketing_attribution_sessions" ADD CONSTRAINT "marketing_attribution_sessions_bound_user_id_user_id_fk" FOREIGN KEY ("bound_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "marketingAttributionSession_boundUserId_idx" ON "marketing_attribution_sessions" USING btree ("bound_user_id");--> statement-breakpoint
CREATE INDEX "marketingAttributionSession_capturedAt_idx" ON "marketing_attribution_sessions" USING btree ("captured_at");--> statement-breakpoint
CREATE INDEX "marketingAttributionSession_sourceCampaign_idx" ON "marketing_attribution_sessions" USING btree ("source","utm_campaign");