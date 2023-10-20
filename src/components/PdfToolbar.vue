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
        {{ pages }}
        <div>
          <button
            :disabled="pages - 1 < 0"
            class="btn-pdf-toolbar"
            title="Previous Page"
            id="previous"
            tabindex="13"
            data-l10n-id="previous"
            @click="changePage(-1)"
          >
            <UpIcon />
          </button>
        </div>
        <div>
          <button
            :disabled="pages + 1 > pages"
            class="btn-pdf-toolbar"
            title="Next Page"
            id="next"
            tabindex="14"
            data-l10n-id="next"
            @click="changePage(1)"
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
</template>

<script setup lang="ts">
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

const props = defineProps({
  pages: {
    type: Number,
    default: 0
  }
});
const emit = defineEmits(['update:currentPage']);

const changePage = (val: number) => {
  emit('update:currentPage', props.pages + val);
  // if (pdfViewer) {
  //   pdfViewer.currentPageNumber += val;
  //   currentPage.value = pdfViewer.currentPageNumber;
  // }
};
</script>
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
