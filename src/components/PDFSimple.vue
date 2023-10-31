<template>
  <div class="overflow-hidden">
    <PdfToolbar
      :pages="currentPdfPages"
      v-model:currentPage="currentPage"
      v-model:pageScale="zoom"
      :pdfViewerRef="pdfViewerRef"
      :requestFullscreen="enterFullscreen"
      :downloadClick="downloadClick"
      :printPDF="printPDF"
    />
    <div id="viewerContainer" ref="containerRef" class="max-w-[100vw] h-[calc(100%-55px)]">
      <div id="viewer" class="pdfViewer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import {
  PDFViewer,
  EventBus,
  PDFLinkService,
  PDFFindController,
  PDFScriptingManager
} from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';

import { onMounted, PropType, ref, watch, toRaw } from 'vue';
import { WORKER_SRC, SANDBOX_BUNDLE_SRC } from '../constants/pdf.const';
import type { IFile, PageScale } from '@/types';
import PdfToolbar from './PdfToolbar.vue';
import printJS from 'print-js';

const containerRef = ref();
const pdfViewerRef = ref<PDFViewer | undefined>();
const pdfLinkService = ref<PDFLinkService | undefined>();

const currentPdf = ref<IFile | undefined>();
const currentPage = ref<number | undefined>(1);
const currentPdfPages = ref<number | undefined>();

const CMAP_URL = '../../node_modules/pdfjs-dist/cmaps';
const CMAP_PACKED = true;
const ENABLE_XFA = true;
const SEARCH_FOR = 'a';

const props = defineProps({
  // idConfig: {
  //   type: Object as PropType<ToolbarIdConfig>,
  //   default: () => toolbarConfig
  // },
  files: { type: Array as PropType<IFile[]>, default: () => [] },
  pageScale: {
    type: [Number, String] as PropType<PageScale>,
    default: 'auto'
  },
  pageNumber: {
    type: Number
  }
});

const zoom = ref(props.pageScale);

onMounted(() => {
  renderPdf();
});

const renderPdf = async () => {
  GlobalWorkerOptions.workerSrc = WORKER_SRC;
  const container = containerRef.value;

  if (container) {
    const eventBus = new EventBus();

    const newPdfLinkService = new PDFLinkService({
      eventBus
    });

    pdfLinkService.value = newPdfLinkService;

    const newPdfController = new PDFFindController({
      eventBus,
      linkService: newPdfLinkService
    });

    // (Optionally) enable scripting support.
    const pdfScriptingManager = new PDFScriptingManager({
      eventBus,
      sandboxBundleSrc: SANDBOX_BUNDLE_SRC
    });

    const newPdfViewer = new PDFViewer({
      container,
      eventBus,
      linkService: newPdfLinkService,
      findController: newPdfController,
      scriptingManager: pdfScriptingManager
    });
    newPdfLinkService.setViewer(newPdfViewer);

    pdfViewerRef.value = newPdfViewer;

    onLoadDocuments();

    eventBus.on('pagesinit', function () {
      setZoom(props.pageScale);
      currentPdfPages.value = pdfViewerRef.value?.pagesCount;

      // eventBus.dispatch('find', { type: '', query: 'CONTRATO DE ADHESIÓN' });
    });
  }
};

watch(pdfViewerRef, (current) => {
  console.log(current);
});

watch(zoom, (current) => {
  setZoom(current);
});

watch(props.files, (current) => {
  if (current) {
    onLoadDocuments();
  }
});

watch(currentPage, (current) => {
  if (pdfViewerRef.value && current) {
    const pdfViewer = toRaw(pdfViewerRef.value);
    pdfViewer.currentPageNumber = current;
  }
});

const onLoadDocuments = async () => {
  if (props.files?.length > 0) {
    currentPdf.value = props.files[0];

    const loadingTask = getDocument({
      url: currentPdf.value.pdf,
      cMapUrl: CMAP_URL,
      cMapPacked: CMAP_PACKED,
      enableXfa: ENABLE_XFA
    });
    const newDoc = await loadingTask.promise;
    const pdfViewer = toRaw(pdfViewerRef.value);
    const linkService = toRaw(pdfLinkService.value);
    pdfViewer?.setDocument(newDoc);
    linkService?.setDocument(newDoc, null);
    currentPage.value = pdfViewer?.pagesCount;
  } else {
    currentPdf.value = undefined;
  }
};

const setZoom = (
  zoomValue: 'page-actual' | 'page-width' | 'page-height' | 'page-fit' | 'auto' | number
) => {
  const pdfViewer = toRaw(pdfViewerRef.value);
  if (pdfViewer) {
    // "page-actual" | "page-width" | "page-height" | "page-fit" | "auto" | number
    const zoom = typeof zoomValue === 'string' ? zoomValue : `${zoomValue}`;
    pdfViewer.currentScaleValue = zoom;
  }
};

const enterFullscreen = () => {
  const pdfViewer = toRaw(containerRef.value);
  if (!pdfViewer) return;
  if (pdfViewer.requestFullscreen) {
    pdfViewer.requestFullscreen();
  } else if (pdfViewer.mozRequestFullScreen) {
    pdfViewer.mozRequestFullScreen();
  } else if (pdfViewer.webkitRequestFullscreen) {
    pdfViewer.webkitRequestFullscreen();
  } else if (pdfViewer.msRequestFullscreen) {
    pdfViewer.msRequestFullscreen();
  }
};

const downloadClick = () => {
  const pdfViewer = toRaw(pdfViewerRef.value);
  if (pdfViewer) {
    pdfViewer.pdfDocument?.getData().then((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pdf.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
};

const printPDF = async () => {
  const pdfViewer = toRaw(pdfViewerRef.value);
  if (pdfViewer && pdfViewer.pdfDocument) {
    try {
      const data = await pdfViewer.pdfDocument.getData();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      printJS({ printable: url, type: 'pdf', showModal: false });
    } catch (error) {
      console.log(error);
    }
  }
};

//RECODE THIS
// const searchTextOnPDF = () => {
//   const linkService = toRaw(pdfViewerRef.value);
//   console.log(linkService);
//   linkService?.eventBus.dispatch('find', {
//     caseSensitive: false,
//     findPrevious: undefined,
//     highlightAll: true,
//     phraseSearch: true,
//     query: 'CONTRATO DE'
//   });
//   return;
// };
</script>

<style lang="scss">
body {
  background-color: #808080;
  margin: 0;
  padding: 0;
}
#viewerContainer {
  overflow: hidden auto;
  position: absolute;
  width: 100%;
}
</style>
