export type Primitive = string | number | boolean | null;

export type SelectionNode = {
  id?: string;
  name?: string;
  type?: string;
  selector?: string;
  filePath?: string;
  componentPath?: string;
  text?: string;
  props?: Record<string, Primitive | Primitive[] | Record<string, unknown>>;
  styles?: Record<string, Primitive | Primitive[] | Record<string, unknown>>;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  screenshot?: {
    mimeType: string;
    data?: string;
    url?: string;
  };
  [key: string]: unknown;
};

export type ChatPayload = {
  message: string;
  context?: Record<string, unknown>;
  [key: string]: unknown;
};

export type TraePreviewAPI = {
  onSelectionChange: (cb: (node: SelectionNode | null) => void) => () => void;
};

export type TraeChatAPI = {
  onBeforeSend: (cb: (payload: ChatPayload) => ChatPayload) => () => void;
};

export type TraePluginRuntime = {
  preview: TraePreviewAPI;
  chat: TraeChatAPI;
  logger?: {
    info: (msg: string, data?: unknown) => void;
    warn: (msg: string, data?: unknown) => void;
  };
};

const MAX_TEXT_LENGTH = 500;
const MAX_JSON_LENGTH = 4000;
const BLOCKED_KEYS = [
  "token",
  "accessToken",
  "refreshToken",
  "password",
  "authorization",
  "cookie",
  "phone",
  "email",
];

function clampText(value: unknown, maxLength = MAX_TEXT_LENGTH): unknown {
  if (typeof value !== "string") {
    return value;
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...[truncated]`;
}

function redactObject(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => redactObject(item));
  }

  if (!input || typeof input !== "object") {
    return clampText(input);
  }

  const out: Record<string, unknown> = {};
  for (const [key, rawValue] of Object.entries(input as Record<string, unknown>)) {
    if (BLOCKED_KEYS.some((blocked) => key.toLowerCase().includes(blocked.toLowerCase()))) {
      out[key] = "[redacted]";
      continue;
    }

    out[key] = redactObject(rawValue);
  }

  return out;
}

function enforceJsonBudget(input: unknown, maxLength = MAX_JSON_LENGTH): unknown {
  try {
    const serialized = JSON.stringify(input);
    if (!serialized || serialized.length <= maxLength) {
      return input;
    }

    return {
      truncated: true,
      originalLength: serialized.length,
      summary: "Selection payload exceeded size limit and was truncated by plugin.",
    };
  } catch {
    return {
      truncated: true,
      summary: "Selection payload could not be serialized safely.",
    };
  }
}

function normalizeSelection(node: SelectionNode | null): SelectionNode | null {
  if (!node) {
    return null;
  }

  const normalized: SelectionNode = {
    id: typeof node.id === "string" ? node.id : undefined,
    name: typeof node.name === "string" ? node.name : undefined,
    type: typeof node.type === "string" ? node.type : undefined,
    selector: typeof node.selector === "string" ? node.selector : undefined,
    filePath: typeof node.filePath === "string" ? node.filePath : undefined,
    componentPath: typeof node.componentPath === "string" ? node.componentPath : undefined,
    text: typeof node.text === "string" ? node.text : undefined,
    props: node.props,
    styles: node.styles,
    boundingBox: node.boundingBox,
    screenshot: node.screenshot,
  };

  const redacted = redactObject(normalized) as SelectionNode;
  return enforceJsonBudget(redacted) as SelectionNode;
}

export function installSelectionContextInjector(runtime: TraePluginRuntime): () => void {
  let currentSelection: SelectionNode | null = null;

  const stopPreview = runtime.preview.onSelectionChange((node) => {
    currentSelection = normalizeSelection(node);
    runtime.logger?.info("[selection-context-injector] selection changed", {
      id: currentSelection?.id,
      name: currentSelection?.name,
      type: currentSelection?.type,
    });
  });

  const stopBeforeSend = runtime.chat.onBeforeSend((payload) => {
    const nextPayload: ChatPayload = {
      ...payload,
      context: {
        ...(payload.context ?? {}),
        source: "trae-preview",
        selectedElement: currentSelection,
        selectionTimestamp: new Date().toISOString(),
      },
    };

    runtime.logger?.info("[selection-context-injector] payload injected", {
      hasSelection: Boolean(currentSelection),
    });

    return nextPayload;
  });

  return () => {
    stopPreview();
    stopBeforeSend();
    runtime.logger?.info("[selection-context-injector] stopped");
  };
}
