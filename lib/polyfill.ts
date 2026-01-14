// Polyfill for Node.js environments where File/FormData might be missing (Node < 20)
// This fixes "ReferenceError: File is not defined" in Next.js server-side builds

const globalObject = 
  typeof globalThis !== 'undefined' ? globalThis : 
  typeof global !== 'undefined' ? global : 
  typeof window !== 'undefined' ? window : 
  this as any;

if (typeof globalObject !== 'undefined') {
  if (typeof (globalObject as any).File === 'undefined') {
    // @ts-ignore
    (globalObject as any).File = class File {
      constructor(_bits: any[], _name: string, _options?: any) {}
    }
  }
  if (typeof (globalObject as any).FormData === 'undefined') {
    // @ts-ignore
    (globalObject as any).FormData = class FormData {
      append() {}
    }
  }
}
