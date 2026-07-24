import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics/types";

export type AnalyticsConfig = {
  readonly googleAnalyticsMeasurementId?: string;
  readonly openAIAdsPixelId?: string;
};

export type AnalyticsAdapter = {
  readonly name: string;
  readonly identifyUser?: (userId: string, properties?: AnalyticsProperties) => void;
  readonly initialize?: (config: AnalyticsConfig) => void;
  readonly isEnabled: () => boolean;
  readonly resetUser?: () => void;
  readonly setUserProperties?: (properties: AnalyticsProperties) => void;
  readonly trackEvent?: (event: AnalyticsEvent) => void;
  readonly trackPageView?: (pagePath: string) => void;
};

export type AnalyticsController = {
  readonly hasEnabledEventAdapter: () => boolean;
  readonly identifyUser: (userId: string, properties?: AnalyticsProperties) => void;
  readonly initialize: (config?: AnalyticsConfig) => void;
  readonly resetUser: () => void;
  readonly setUserProperties: (properties: AnalyticsProperties) => void;
  readonly trackEvent: (event: AnalyticsEvent) => void;
  readonly trackPageView: (pagePath: string) => void;
};

type AdapterAction =
  | "hasEnabledEventAdapter"
  | "identifyUser"
  | "initialize"
  | "isEnabled"
  | "resetUser"
  | "setUserProperties"
  | "trackEvent"
  | "trackPageView";

const reportAnalyticsAdapterError = (
  adapterName: string,
  action: AdapterAction,
  error: unknown
): void => {
  console.error(`[analytics] ${adapterName} ${action} failed`, error);
};

const isAdapterEnabled = (adapter: AnalyticsAdapter): boolean => {
  try {
    return adapter.isEnabled();
  } catch (error) {
    reportAnalyticsAdapterError(adapter.name, "isEnabled", error);
    return false;
  }
};

const runEnabledAdapterAction = (
  adapters: readonly AnalyticsAdapter[],
  action: AdapterAction,
  callback: (adapter: AnalyticsAdapter) => void
): void => {
  for (const adapter of adapters) {
    if (!isAdapterEnabled(adapter)) {
      continue;
    }

    try {
      callback(adapter);
    } catch (error) {
      reportAnalyticsAdapterError(adapter.name, action, error);
    }
  }
};

export function createAnalyticsController(
  adapters: readonly AnalyticsAdapter[]
): AnalyticsController {
  return {
    hasEnabledEventAdapter: (): boolean => {
      for (const adapter of adapters) {
        if (!adapter.trackEvent) {
          continue;
        }

        if (isAdapterEnabled(adapter)) {
          return true;
        }
      }

      return false;
    },
    identifyUser: (userId: string, properties?: AnalyticsProperties): void => {
      runEnabledAdapterAction(adapters, "identifyUser", (adapter: AnalyticsAdapter): void => {
        adapter.identifyUser?.(userId, properties);
      });
    },
    initialize: (config: AnalyticsConfig = {}): void => {
      for (const adapter of adapters) {
        try {
          adapter.initialize?.(config);
        } catch (error) {
          reportAnalyticsAdapterError(adapter.name, "initialize", error);
        }
      }
    },
    resetUser: (): void => {
      runEnabledAdapterAction(adapters, "resetUser", (adapter: AnalyticsAdapter): void => {
        adapter.resetUser?.();
      });
    },
    setUserProperties: (properties: AnalyticsProperties): void => {
      runEnabledAdapterAction(adapters, "setUserProperties", (adapter: AnalyticsAdapter): void => {
        adapter.setUserProperties?.(properties);
      });
    },
    trackEvent: (event: AnalyticsEvent): void => {
      runEnabledAdapterAction(adapters, "trackEvent", (adapter: AnalyticsAdapter): void => {
        adapter.trackEvent?.(event);
      });
    },
    trackPageView: (pagePath: string): void => {
      runEnabledAdapterAction(adapters, "trackPageView", (adapter: AnalyticsAdapter): void => {
        adapter.trackPageView?.(pagePath);
      });
    },
  };
}
