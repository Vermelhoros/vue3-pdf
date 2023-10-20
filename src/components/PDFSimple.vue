<template>
  <PdfToolbar :pages="currentPdfPages" v-model:currentPage="currentPage" />
  <div id="viewerContainer" ref="containerRef">
    <div id="viewer" class="pdfViewer"></div>
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

import { onMounted, PropType, ref, watch, computed } from 'vue';
import { WORKER_SRC, SANDBOX_BUNDLE_SRC } from '../constants/pdf.const';
import type { IFile, PageScale } from '@/types';
import PdfToolbar from './PdfToolbar.vue';

const containerRef = ref();
let pdfViewer: PDFViewer | undefined = undefined;
const pdfViewerRef = ref<PDFViewer | undefined>();
let pdfLinkService: PDFLinkService | undefined = undefined;

const currentPdf = ref<IFile | undefined>();
const currentPage = ref<Number | undefined>(1);
const currentPdfPages = computed(() => {
  if (currentPage.value && pdfViewer) {
    return pdfViewer.pagesCount;
  }
  return 0;
});

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
    default: 1.5
  },
  pageNumber: Number
});

// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidXN1YXJpb0lkIjoxNjksImFwbGljYWNpb25JZCI6NjksImZ1bmNpb25hcmlvSWQiOjI2OSwibXNQZXJzb25hSWQiOjUyNSwiaW5zdGl0dWNpb25JZCI6MSwib2ZpY2luYUlkIjoxLCJtdW5pY2lwaW9JZCI6MSwiZGVwYXJ0YW1lbnRvSWQiOjEsInBlcmZpbFBlcnNvbmFJZCI6Mjg0LCJjaSI6IjEwNjMxMTQ5In0sImlhdCI6MTY5NzU2Nzg1NSwiZXhwIjoxNzI5MTA3ODU1fQ.o32n8gj-2pnw-b02rlT30B7evkasl9x2j8G9jOtBrSo';

// const url = `https://jl2-gw.test.mp.gob.bo/v1/ms-files/ver/archivo/64fb7470684609d8ac4c3b12/${token}`;

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
    pdfLinkService = newPdfLinkService;

    const pdfFindController = new PDFFindController({
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
      findController: pdfFindController,
      scriptingManager: pdfScriptingManager
    });

    pdfViewer = newPdfViewer;
    pdfViewerRef.value = pdfViewer;

    onLoadDocuments();
    // const loadingTask = getDocument({
    //   url,
    //   cMapUrl: CMAP_URL,
    //   cMapPacked: CMAP_PACKED,
    //   enableXfa: ENABLE_XFA
    // });

    // const newDoc = await loadingTask.promise;
    // pdfViewer.setDocument(newDoc);
    // pdfLinkService.setDocument(newDoc, null);

    // eventBus.on('pagesinit', function () {
    //   // We can use pdfViewer now, e.g. let's change default scale.
    //   pdfViewer.currentScaleValue = 'page-width';

    //   // We can try searching for things.
    //   if (SEARCH_FOR) {
    //     eventBus.dispatch('find', { type: '', query: SEARCH_FOR });
    //   }
    // });
  }
};

watch(pdfViewerRef, (current) => {
  console.log(current);
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

    // console.log(pdfViewer.value);
    const newDoc = await loadingTask.promise;
    pdfViewer?.setDocument(newDoc);
    pdfLinkService?.setDocument(newDoc, null);
    console.log(pdfViewer?.pagesCount);
    currentPage.value = pdfViewer?.pagesCount;
  } else {
    currentPdf.value = undefined;
  }
};

watch(props.files, (current) => {
  if (current) {
    onLoadDocuments();
  }
});

watch(currentPage, (current) => {
  if (pdfViewer && current) {
    pdfViewer.currentPageNumber = current as number;
  }
});

// watch(currentPdf, (current) => {
//   if (current) {
//     onLoadDocuments(props.files[0]);
//   }
// });
</script>

<style lang="scss">
body {
  background-color: #808080;
  margin: 0;
  padding: 0;
}
#viewerContainer {
  overflow: auto;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
