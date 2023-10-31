<template>
  <div style="height: 100vh; width: 100%">
    <PDFSimple v-model:files="files" :page-number="1" />
    <!-- <PdfViewer :page-number="1" v-model:files="files" /> -->
  </div>
</template>

<script setup lang="ts">
import PDFSimple from './components/PDFSimple.vue';
import { ref } from 'vue';
import './index.css';
// import PdfViewer from './components/PdfViewer.vue';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidXN1YXJpb0lkIjoxNjksImFwbGljYWNpb25JZCI6NjksImZ1bmNpb25hcmlvSWQiOjI2OSwibXNQZXJzb25hSWQiOjUyNSwiaW5zdGl0dWNpb25JZCI6MSwib2ZpY2luYUlkIjoxLCJtdW5pY2lwaW9JZCI6MSwiZGVwYXJ0YW1lbnRvSWQiOjEsInBlcmZpbFBlcnNvbmFJZCI6Mjg0LCJjaSI6IjEwNjMxMTQ5In0sImlhdCI6MTY5NzU2Nzg1NSwiZXhwIjoxNzI5MTA3ODU1fQ.o32n8gj-2pnw-b02rlT30B7evkasl9x2j8G9jOtBrSo';

// const url = `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/64fb7470684609d8ac4c3b12/${token}`;
// const url = '/pdfhelp.pdf';

const files = ref([
  {
    id: '64fb7470684609d8ac4c3b12',
    fileName: 'holaf.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/64fb7470684609d8ac4c3b12/${token}`
  },
  {
    id: '6491fe7bed6adce4347aafd9',
    fileName: '1666824884383_l9q8i022.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/6491fe7bed6adce4347aafd9/${token}`
  },
  {
    id: '635be91d8c943de74fd9598d',
    fileName: '1666824884383_l9q8i022.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/635be91d8c943de74fd9598d/${token}`
  },
  {
    id: '6359bab42736f8d11cd611cc',
    fileName: '1666824884383_l9q8i022.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/6359bab42736f8d11cd611cc/${token}`
  },
  {
    id: '64dd366c791bd183136650ce',
    fileName: 'actividad pesada.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/64dd366c791bd183136650ce/${token}`
  },
  {
    id: '646be45c2a103104ae02cfe1',
    fileName: 'hola.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/646be45c2a103104ae02cfe1/${token}`
  },
  {
    id: '635fbdb1e5395cb550aeb2d0',
    fileName: 'example.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/635fbdb1e5395cb550aeb2d0/${token}`
  },
  {
    id: '64e91360d413b146fff4d504',
    fileName: 'archivo-cd-1.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/64e91360d413b146fff4d504/${token}`
  },
  {
    id: '6359b8a82736f8d11cd61190',
    fileName: 'prueba-fuego.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/6359b8a82736f8d11cd61190/${token}`
  },
  {
    id: '635c41ecdf4710a8f42c5dd5',
    fileName: 'archivo-cd-2.pdf',
    pdf: `https://jl2-gw.dev.mp.gob.bo/v1/ms-files/ver/archivo/635c41ecdf4710a8f42c5dd5/${token}`
  }
]);
</script>

<style lang="scss">
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
}
.pdf-container,
.pdf-component-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
