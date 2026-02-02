// Polyfill for Node.js environments where File/FormData might be missing (Node < 20)
// This fixes "ReferenceError: File is not defined" in Next.js server-side builds

import { FormData as UndiciFormData } from "undici";

const globalObject =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
      ? global
      : typeof window !== "undefined"
        ? window
        : (this as unknown as typeof globalThis);

if (typeof globalObject !== "undefined") {
  if (typeof globalObject.File === "undefined") {
    // Create a minimal File polyfill that extends Blob
    // In Node.js 20+, File should be available globally, but this provides a fallback
    class FilePolyfill extends Blob {
      readonly name: string;
      readonly lastModified: number;

      constructor(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag) {
        super(fileBits, { type: options?.type });
        this.name = fileName;
        this.lastModified = options?.lastModified ?? Date.now();
      }
    }

    Object.defineProperty(globalObject, "File", {
      value: FilePolyfill,
      writable: true,
      configurable: true,
    });
  }

  if (typeof globalObject.FormData === "undefined") {
    // Use undici's FormData implementation
    Object.defineProperty(globalObject, "FormData", {
      value: UndiciFormData,
      writable: true,
      configurable: true,
    });
  }
}
