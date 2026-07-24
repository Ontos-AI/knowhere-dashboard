import { env } from "@/lib/env";

type OpenAIAdsStandardEventName =
  | "checkout_started"
  | "lead_created"
  | "order_created"
  | "registration_completed"
  | "subscription_created";

type OpenAIAdsConversionData =
  | {
      readonly type: "customer_action";
    }
  | {
      readonly amount?: number;
      readonly currency?: "USD";
      readonly type: "contents";
    }
  | {
      readonly amount?: number;
      readonly currency?: "USD";
      readonly plan_id?: string;
      readonly type: "plan_enrollment";
    };

type OpenAIAdsConversionEvent = {
  readonly data: OpenAIAdsConversionData;
  readonly eventId: string;
  readonly eventName: OpenAIAdsStandardEventName;
  readonly sourceUrl?: string;
  readonly timestamp: string;
};

type OpenAIAdsConversionConfig = {
  readonly fetch?: typeof fetch;
  readonly openAIAdsConversionsAPIKey?: string;
  readonly openAIAdsPixelId?: string;
};

type OpenAIAdsConversionResult =
  | {
      readonly reason: "disabled";
      readonly sent: false;
    }
  | {
      readonly sent: true;
    };

const OPENAI_ADS_CONVERSIONS_ENDPOINT = "https://bzr.openai.com/v1/events";

function normalizeOptionalString(value?: string): string {
  return value?.trim() ?? "";
}

function getTimestampMs(timestamp: string): number {
  const timestampMs = new Date(timestamp).getTime();
  if (!Number.isFinite(timestampMs)) {
    throw new Error(`Invalid OpenAI Ads conversion timestamp: ${timestamp}`);
  }

  return timestampMs;
}

function getResponseMessage(response: Response, responseText: string): string {
  const statusText = response.statusText ? ` ${response.statusText}` : "";
  const bodyText = responseText ? `: ${responseText}` : "";
  return `${response.status}${statusText}${bodyText}`;
}

export async function sendOpenAIAdsConversionEvent(
  event: OpenAIAdsConversionEvent,
  config: OpenAIAdsConversionConfig = {}
): Promise<OpenAIAdsConversionResult> {
  const openAIAdsPixelId = normalizeOptionalString(
    config.openAIAdsPixelId ?? env.OPENAI_ADS_PIXEL_ID
  );
  const openAIAdsConversionsAPIKey = normalizeOptionalString(
    config.openAIAdsConversionsAPIKey ?? env.OPENAI_ADS_CONVERSIONS_API_KEY
  );

  if (!openAIAdsPixelId || !openAIAdsConversionsAPIKey) {
    return { reason: "disabled", sent: false };
  }

  const fetchImpl = config.fetch ?? fetch;
  const response = await fetchImpl(
    `${OPENAI_ADS_CONVERSIONS_ENDPOINT}?pid=${encodeURIComponent(openAIAdsPixelId)}`,
    {
      body: JSON.stringify({
        events: [
          {
            action_source: "web",
            data: event.data,
            id: event.eventId,
            source_url: event.sourceUrl,
            timestamp_ms: getTimestampMs(event.timestamp),
            type: event.eventName,
          },
        ],
        validate_only: false,
      }),
      headers: {
        authorization: `Bearer ${openAIAdsConversionsAPIKey}`,
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  if (!response.ok) {
    const responseText = await response.text().catch((): string => "");
    throw new Error(
      `OpenAI Ads Conversions API rejected event ${event.eventName}: ${getResponseMessage(
        response,
        responseText
      )}`
    );
  }

  return { sent: true };
}
