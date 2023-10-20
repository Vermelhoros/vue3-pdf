<template>
  <div ref="viewerContainer">
    <div id="viewer" class="pdfViewer"></div>
  </div>
</template>

<script setup lang="ts">
import * as pdfApp from '@/pdfjs-dist/web/viewer.mjs';
import { PropType, onMounted, reactive, ref } from 'vue';
import '@/pdfjs-dist/web/viewer.css';

import { toolbarConfig } from '../utils/toolbar-config';
import type { IFile, PageScale, ToolbarIdConfig } from '@/types';
import getAppConfig from '@/utils/pdf-config';

if (pdfApp.PDFViewerApplicationOptions) pdfApp.PDFViewerApplicationOptions.set('defaultUrl', null);
const errorHandler = console.error.bind(console);

const viewerContainer = ref();
const filesInformation = ref<any>([]);
const viewSidebar = reactive<{ fileSelect: any; files: any; signatures: any }>({
  fileSelect: undefined,
  files: false,
  signatures: false
});

const props = defineProps({
  idConfig: {
    type: Object as PropType<ToolbarIdConfig>,
    default: () => toolbarConfig
  },
  files: { type: Array as PropType<IFile[]>, default: () => [] },
  pageScale: {
    type: [Number, String] as PropType<PageScale>,
    default: 1.5
  },
  pageNumber: Number
});

onMounted(() => {
  const config = getAppConfig(props.idConfig);
  if (pdfApp.PDFViewerApplication) {
    pdfApp.PDFViewerApplication.run(config);
    pdfApp.PDFViewerApplication.initializedPromise
      .then(setDefaultPageScale)
      .then(open)
      // .then(bindSidebarToggleEvents)
      // .then(bindFindbarToggleEvents)
      .catch(errorHandler);
  }
});

function setDefaultPageScale() {
  props.pageScale && pdfApp.PDFViewerApplicationOptions.set('defaultZoomValue', props.pageScale);
}

const onLoadFiles = async () => {
  try {
    filesInformation.value = [];
    if (props.files.length == 0) return;
    // for (const item of props.files) {
    //   item.pdf = props.waterMarkerActive
    //     ? generateUrlWaterMarker(props.msSeguridad, item.id, props.token, props.waterMarkerText)
    //     : item.pdf;
    //   filesInformation.value.push(item);
    // }

    // if (props.enableInformationFile) {
    //   const fileIds: string[] = filesInformation.value
    //     .filter((data) => data?.id)
    //     .map((item: any) => item.id);
    //   if (fileIds.length > 0) {
    //     const result = await onGetInformationFilesApi({
    //       body: {
    //         msFilesIds: fileIds,
    //         url: props.msSeguridad,
    //         token: props.token
    //       }
    //     });
    //     if (!result.error) {
    //       filesInformation.value = result.response.map((item) => {
    //         const urlBase = `${props.msSeguridad}/api/v1/ms-files/ver/archivo/${item.id}/${props.token}`;
    //         return {
    //           id: item.id,
    //           fileName: item.originalName,
    //           size: item.size,
    //           totalFirmadosAdsib: item.totalFirmadosAdsib,
    //           totalFirmadosAgetic: item.totalFirmadosAgetic,
    //           sePuedeAprobar: item.size < 2e7,
    //           pdf: props.waterMarkerActive
    //             ? generateUrlWaterMarker(
    //                 props.msSeguridad,
    //                 item.id,
    //                 props.token,
    //                 props.waterMarkerText
    //               )
    //             : urlBase
    //         };
    //       });
    //       viewSidebar.fileSelect = filesInformation.value[0];
    //       open();
    //     }
    //   } else
    //     // toasts.push({
    //     //   title: 'Operación Fallida',
    //     //   content: 'Los Atributos del Array files debe contener ID',
    //     //   style: 'error'
    //     // });
    // } else
    // viewSidebar.fileSelect = filesInformation.value[0];
    viewSidebar.fileSelect = props.files;
  } catch (e) {
    console.log(e);
  }
};

function open() {
  // clearCacheTimeout();

  if (!pdfApp.PDFViewerApplication) return;
  if (!viewSidebar.fileSelect?.pdf) {
    pdfApp.PDFViewerApplication.close();
  } else {
    // loading.value = true;
    pdfApp.PDFViewerApplication.open(viewSidebar.fileSelect.pdf)
      .then(() => {
        if (props.pageNumber) {
          setTimeout(() => (pdfApp.PDFViewerApplication.page = props.pageNumber));
        }
        return pdfApp.PDFViewerApplication.pdfDocument?.getMetadata();
      })
      .then((fileMetadata: { contentDispositionFilename: null | string }) => {
        pdfApp.PDFViewerApplication.contentDispositionFilename =
          fileMetadata.contentDispositionFilename;
        // emit('pages-rendered', pdfApp.PDFViewerApplication);
        // onGetValueLegalCiudadaniaDigital();
        // onGetValueLegalAdsib();
      })
      .catch(errorHandler)
      .finally(() => {
        // loading.value = false;
      });
  }
}
</script>

<style lang="css">
html {
  content: '';
}

@media (prefers-color-scheme: light) {
  html {
    content: 'light';
  }
}

@media (prefers-color-scheme: dark) {
  html {
    content: 'dark';
  }
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

div:where(.swal2-container) {
  z-index: 5000;
}

#viewerContainer {
  scrollbar-width: none; /*Firefox*/
}

/*Webkit(Chrome, Android browser, Safari, Edge...)*/
#viewerContainer::-webkit-scrollbar {
  width: 0;
}
</style>

<style lang="scss" scoped>
.txt-loading {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--primary-color-text);
}
.txt-sin-registro {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  line-height: 25px;
  color: var(--primary-color-text);
  font-size: 15px;
  font-weight: 400;
}
.button-content {
  display: flex;
  justify-content: center;
  flex-direction: row;
  & .button-file {
    position: relative;
    width: 90%;
    padding: 10px 2px;
    margin-bottom: 10px;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    // color: white;
    color: var(--pdf-primary-color);
    border: 1px solid var(--pdf-primary-color);
    &:hover:not(.button-file-select) {
      background-color: var(--pdf-primary-color);
      color: white;
      opacity: 0.7;
    }
    & .text-file {
      font-size: 14px;
      display: block;
      font-weight: 600;
    }
    & .text-size {
      font-size: 12px;
      font-weight: 500;
      display: block;
    }

    & .button-close {
      position: absolute;
      top: -8px;
      right: -9px;
      background: var(--pdf-error-wrapper-color);
      color: white;
      font-weight: bold;
      border: 1px solid var(--pdf-error-wrapper-color);
      border-radius: 1rem;
      width: 1.2rem;
      height: 1.2rem;
      // padding: 0px;
      // padding-top: 3px;
      // padding-bottom: 3px;
      font-size: 14px;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-content: center;
      align-self: center;
      align-items: center;
      &:hover {
        opacity: 1;
        cursor: pointer;
        // border: 1px solid white;
        color: white;
      }
    }
  }

  & .button-file-select {
    background-color: var(--pdf-primary-color);
    border: 1px solid var(--pdf-primary-color);
    color: white;
    font-weight: 600;
    opacity: 1;
    // background-color: var(--pdf-app-background-color);
  }
}
// estilos para modal
@keyframes rotate {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(360deg);
  }
  to {
    -webkit-transform: rotate(0deg);
  }
}

.btn-loading {
  background: var(--pdf-primary-color);
  color: white !important;
  border-radius: 1rem;
  padding: 3px 7px;
  margin-right: 5px;
  &::before {
    font-size: 14px !important;
  }
}
.btn-sync-loading {
  background: white;
  color: var(--primary-color) !important;
  border-radius: 1rem;
  padding: 3px 7px;
  margin-right: 5px;
  opacity: 0.9;
  &::before {
    font-size: 14px !important;
  }
  &:hover {
    opacity: 1;
  }
}
.btn-disabled {
  background: transparent;
}
.btn-rotate {
  -webkit-animation: 3s rotate linear infinite;
  animation: 3s rotate linear infinite;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}
</style>
