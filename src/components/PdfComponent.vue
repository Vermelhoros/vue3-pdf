<!-- <template>
  <div class="pdf-container">
    <div class="pdf-component-container" ref="pdfRef"></div>
  </div>
</template>

<script setup lang="ts">
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { onMounted, PropType, ref } from 'vue';
import type { IPdfFile } from '../dto/Pdf';
import PDFViewer from 'pdfjs-dist/web/pdf_viewer';

const props = defineProps({
  files: {
    type: Array as PropType<IPdfFile[]>,
    default: () => []
  }
});

const pdfRef = ref();
let pdfDocument: any = null;

onMounted(() => {
  renderPdf();
});

const renderPdf = async () => {
  const pdfContainer = pdfRef.value;

  const workerSrc = new URL('../node_modules/pdfjs-dist/build/pdf.worker.min.js', import.meta.url)
    .href;
  // const workerSrc = new URL(
  //   '../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js',
  //   import.meta.url
  // ).href;

  GlobalWorkerOptions.workerSrc = workerSrc;

  const loadingTask = getDocument(url);
  const document = await loadingTask.promise;
  pdfDocument = document;
  // Set the initial page to display (e.g., the first page)
  renderPage(1, pdfContainer);
};

const renderPage = async (pageNumber: number, container: any) => {
  const pdfPage = await pdfDocument?.getPage(pageNumber);
  const viewport = pdfPage.getViewport({ scale: 1.5 });

  // Create a canvas element to render the page
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Append the canvas to the container
  container.appendChild(canvas);

  // Render the page content on the canvas
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  try {
    await pdfPage.render(renderContext);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style> -->
