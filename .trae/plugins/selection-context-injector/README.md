# Selection Context Injector (TRAE)

This plugin injects the current preview selection into each outgoing chat payload.

## What it does

- Listens to preview selection changes.
- Stores the latest selected node in memory.
- Injects `context.selectedElement` before each message is sent.
- Redacts common sensitive keys (`token`, `password`, `cookie`, etc.).
- Truncates oversized payloads.

## Injected payload shape

```json
{
  "context": {
    "source": "trae-preview",
    "selectedElement": {
      "id": "node_1287",
      "name": "LoginButton",
      "type": "button",
      "selector": "#login-form button[type='submit']",
      "filePath": "app/(auth)/login/page.tsx"
    },
    "selectionTimestamp": "2026-04-29T10:22:31.000Z"
  }
}
```

## Integration steps

1. Register this plugin in your TRAE plugin loader.
2. Pass runtime APIs that implement:
   - `preview.onSelectionChange(cb)`
   - `chat.onBeforeSend(cb)`
3. Call `installSelectionContextInjector(runtime)` on startup.
4. Call the returned cleanup function when unloading plugin.

## Example loader glue

```ts
import { installSelectionContextInjector } from "./src/index";

const cleanup = installSelectionContextInjector({
  preview: trae.preview,
  chat: trae.chat,
  logger: trae.logger
});

// On plugin unload:
cleanup();
```

## Notes

- If no element is selected, `selectedElement` is `null`.
- If your runtime uses different hook names, map them in your loader adapter.
