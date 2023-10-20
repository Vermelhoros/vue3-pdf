export const WORKER_SRC = new URL(
  '../../node_modules/pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).href;

export const SANDBOX_BUNDLE_SRC = new URL(
  '../../node_modules/pdfjs-dist/build/pdf.sandbox.min.js',
  import.meta.url
).href;
