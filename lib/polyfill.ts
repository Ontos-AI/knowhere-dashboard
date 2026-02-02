// Polyfill for Node.js environments where File/FormData might be missing (Node < 20)
// This fixes "ReferenceError: File is not defined" in Next.js server-side builds

const globalObject =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
      ? global
      : typeof window !== "undefined"
        ? window
        : // biome-ignore lint/suspicious/noExplicitAny: Polyfill requires any to access global object properties
          (this as any);

if (typeof globalObject !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: Polyfill requires any to access global object properties
  if (typeof (globalObject as any).File === "undefined") {
    // biome-ignore lint/suspicious/noExplicitAny: Polyfill requires any to access global object properties
    (globalObject as any).File = class File {};
  }
  // biome-ignore lint/suspicious/noExplicitAny: Polyfill requires any to access global object properties
  if (typeof (globalObject as any).FormData === "undefined") {
    // biome-ignore lint/suspicious/noExplicitAny: Polyfill requires any to access global object properties
    (globalObject as any).FormData = class FormData {
      append() {}
    };
  }
}
