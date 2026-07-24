CREATE TABLE "marketing_page_views" (
	"view_id" text PRIMARY KEY NOT NULL,
	"acquisition_session_id" text,
	"source" text NOT NULL,
	"channel" text NOT NULL,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"oppref" text,
	"visited_path" text NOT NULL,
	"referrer_host" text,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "marketingPageView_viewedAt_idx" ON "marketing_page_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "marketingPageView_visitedPath_viewedAt_idx" ON "marketing_page_views" USING btree ("visited_path","viewed_at");--> statement-breakpoint
CREATE INDEX "marketingPageView_acquisitionSessionId_idx" ON "marketing_page_views" USING btree ("acquisition_session_id");