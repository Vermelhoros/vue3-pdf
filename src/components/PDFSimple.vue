<template>
  <div class="flex py-3 px-2 bg-slate-700">
    <div class="flex gap-2 items-center">
      <!-- v-show="showElem('sidebar', 'sidebarToggle')" -->
      <div>
        <button
          id="sidebarToggle"
          class="btn"
          title="Toggle Sidebar"
          tabindex="11"
          data-l10n-id="toggle_sidebar"
          style="margin-left: 0.3rem; margin-right: 0.3rem; height: auto; width: auto"
        >
          <BarraIcon />
        </button>
      </div>
      <div class="flex gap-2">
        <!-- @click="onOpenSidebar('files')"
        v-if="viewButton.files" -->
        <div>
          <button
            class="btn-pdf-toolbar"
            title="Archivos"
            tabindex="12"
            data-l10n-id="toggle_sidebar"
          >
            <FileIcon />
          </button>
        </div>
        <div>
          <button
            id="viewFind"
            class="btn-pdf-toolbar"
            title="Find in Document"
            tabindex="12"
            data-l10n-id="findbar"
          >
            <SearchIcon />
          </button>
        </div>
        <div>
          <button
            class="btn-pdf-toolbar"
            title="Previous Page"
            id="previous"
            tabindex="13"
            data-l10n-id="previous"
          >
            <UpIcon />
          </button>
        </div>
        <div>
          <button
            class="btn-pdf-toolbar"
            title="Next Page"
            id="next"
            tabindex="14"
            data-l10n-id="next"
          >
            <DownIcon />
          </button>
        </div>
        <!-- <div style="padding-top: 6px"> -->
        <div>
          <input
            type="number"
            id="pageNumber"
            class="input-pdf-number [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            title="Page"
            value="1"
            size="4"
            min="1"
            tabindex="15"
            data-l10n-id="page"
            autocomplete="off"
          />
          <span id="numPages" class="toolbarLabel"></span>
        </div>
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
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

import { onMounted, PropType, ref, watch } from 'vue';
import { WORKER_SRC, SANDBOX_BUNDLE_SRC } from '../constants/pdf.const';
import type { IFile, PageScale } from '@/types';
import {
  AdsibIcon,
  AgeticIcon,
  Barra2Icon,
  BarraIcon,
  DownIcon,
  DownloadIcon,
  FileIcon,
  FileSimpleIcon,
  FullScreenIcon,
  PrintIcon,
  SearchIcon,
  UpIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '../assets/icons';

const containerRef = ref();
let pdfViewer: PDFViewer | undefined = undefined;
let pdfLinkService: PDFLinkService | undefined = undefined;
const currentPdf = ref<IFile | undefined>();

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
  } else {
    currentPdf.value = undefined;
  }
};

watch(props.files, (current) => {
  if (current) {
    onLoadDocuments();
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

<style lang="scss" scoped>
.btn {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    color: var(--pdf-primary-color);
    width: 20px;
    height: 20px;
  }
}
.btn-pdf-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--pdf-primary-color);
  border: 2px solid var(--pdf-primary-color);
  width: 30px;
  height: 30px;
  border-radius: 50%;

  & svg {
    color: var(--pdf-primary-color);
    width: 25px;
    height: 25px;
  }
}
.input-pdf-number {
  border: 2px solid var(--pdf-primary-color);
  width: 75px;
  border-radius: 12px;
  padding: 0.1rem 0.5rem;
  &:focus {
    border: 2px solid var(--pdf-primary-color);
    outline: 1px solid var(--pdf-primary-color);
    width: 75px;
    border-radius: 12px;
    padding: 0.1rem 0.5rem;
  }
}
</style>
