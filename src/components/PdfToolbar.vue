<template>
  <div class="flex py-3 px-2 bg-slate-800 justify-between w-[100vw] h-[55px] border-bottom-toolbar">
    <div class="flex gap-2 items-center">
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
            :disabled="currentPage - 1 <= 0"
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
            :disabled="currentPage + 1 > pages"
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
        <div>
          <input
            type="number"
            id="pageNumber"
            class="input-pdf-number text-[14px] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            title="Page"
            value="1"
            size="4"
            min="1"
            tabindex="15"
            data-l10n-id="page"
            autocomplete="off"
          />
          <span id="numPages" class="ml-1 text-white text-[14px]"> de {{ pages }} </span>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <div>
        <button
          id="viewFind"
          class="btn-pdf-toolbar"
          title="Find in Document"
          tabindex="12"
          data-l10n-id="findbar"
          @click="onZoomClick(1)"
        >
          <ZoomInIcon />
        </button>
      </div>
      <div>
        <button
          id="viewFind"
          class="btn-pdf-toolbar"
          title="Find in Document"
          tabindex="12"
          data-l10n-id="findbar"
          @click="onZoomClick(-1)"
        >
          <ZoomOutIcon />
        </button>
      </div>
      <div class="relative">
        <i class="fa-solid fa-caret-down text-white absolute right-[10px] top-[6px]"></i>
        <select
          id="scaleSelect"
          title="Zoom"
          tabindex="23"
          data-l10n-id="zoom"
          :value="pageScale"
          class="p-1 px-2 h-[30px] w-[140px] text-[12px] bg-slate-800 rounded-lg text-white pdf-dropdown"
          @change="(ev) => onChangeSelect(ev)"
        >
          <option
            v-for="(opt, idx) in PDFJS_SELECT_OPTIONS"
            :id="idx + 'option'"
            :value="opt.value"
            data-l10n-id="page_scale_auto"
            :key="idx + 'option'"
          >
            {{ opt.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex gap-2">
      <div>
        <button
          id="viewFind"
          class="btn-pdf-toolbar"
          title="Find in Document"
          tabindex="12"
          data-l10n-id="findbar"
        >
          <AgeticIcon />
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
          <AdsibIcon />
        </button>
      </div>
      <div class="w-[1px] bg-[var(--pdf-primary-color)] my-[8px] mx-[5px] py-[8px]"></div>
      <div>
        <button
          id="viewFind"
          class="btn-pdf-toolbar"
          title="Find in Document"
          tabindex="12"
          data-l10n-id="findbar"
          @click="props.requestFullscreen"
        >
          <FullScreenIcon />
        </button>
      </div>
      <div>
        <button
          id="viewFind"
          class="btn-pdf-toolbar"
          title="Find in Document"
          tabindex="12"
          data-l10n-id="findbar"
          @click="props.printPDF"
        >
          <PrintIcon />
        </button>
      </div>
      <div>
        <button
          id="viewFind"
          class="btn-pdf-toolbar"
          title="Find in Document"
          tabindex="12"
          data-l10n-id="findbar"
          @click="props.downloadClick"
        >
          <DownloadIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
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
import { type PageScale } from '@/types';
import { PDFJS_SELECT_OPTIONS, PDF_NO_NUMBER_OPTIONS } from '../constants/pdf.const';

const props = defineProps({
  pages: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 0
  },
  pageScale: {
    type: [Number, String] as PropType<PageScale>,
    required: true
  },
  requestFullscreen: {
    type: Function,
    required: true
  },
  downloadClick: {
    type: Function,
    required: true
  },
  printPDF: {
    type: Function,
    required: true
  }
});
const emit = defineEmits(['update:currentPage', 'update:pageScale']);

const changePage = (val: number) => {
  console.log(props.pages + val);
  emit('update:currentPage', props.currentPage + val);
};

const onChangeSelect = (ev: any) => {
  emit('update:pageScale', ev.target.value);
};

const onZoomClick = (val: number) => {
  const idx = PDFJS_SELECT_OPTIONS.findIndex((val) => val.value === props.pageScale);
  if (idx !== -1 && PDFJS_SELECT_OPTIONS[idx].value === '0.5' && val < 0) {
    return;
  }

  if (idx <= PDF_NO_NUMBER_OPTIONS) {
    emit('update:pageScale', PDFJS_SELECT_OPTIONS[val > 0 ? 7 : 6].value);
    return;
  }

  if (idx !== -1 && idx + val < PDFJS_SELECT_OPTIONS.length && idx + val >= 0) {
    emit('update:pageScale', PDFJS_SELECT_OPTIONS[idx + val].value);
  }
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
.pdf-dropdown {
  border: 2px solid var(--pdf-primary-color);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.border-bottom-toolbar {
  border-bottom: 2px solid var(--pdf-primary-color);
}
</style>
