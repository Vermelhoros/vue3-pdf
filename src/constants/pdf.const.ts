export const WORKER_SRC = new URL(
  '../../node_modules/pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).href;

export const SANDBOX_BUNDLE_SRC = new URL(
  '../../node_modules/pdfjs-dist/build/pdf.sandbox.min.js',
  import.meta.url
).href;

export const PDFJS_SELECT_OPTIONS = [
  {
    value: 'auto',
    text: 'Zoom Automático'
  },
  {
    value: 'page-actual',
    text: 'Página actual'
  },
  {
    value: 'page-fit',
    text: 'Ajustar a la Página'
  },
  {
    value: 'page-width',
    text: 'Ancho de Página'
  },
  {
    value: '0.5',
    text: '50%'
  },
  {
    value: '0.75',
    text: '75%'
  },
  {
    value: '1',
    text: '100%'
  },
  {
    value: '1.25',
    text: '125%'
  },
  {
    value: '1.5',
    text: '150%'
  },
  {
    value: '2',
    text: '200%'
  }
];

export const PDF_NO_NUMBER_OPTIONS = 3;
