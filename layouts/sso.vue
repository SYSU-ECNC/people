<script lang="ts" setup></script>

<template>
  <div
    class="m-0 p-0 min-h-screen flex flex-col md:flex-row md:justify-end md:items-stretch"
  >
    <div
      class="bg-[url(https://s2.loli.net/2022/03/31/2zfek39LnFjJvmt.jpg)] bg-cover bg-center flex-1 px-10 md:px-20 py-14"
    >
      <img alt="ECNC Logo" class="w-20 h-20" src="~/assets/ecnc_white.svg" />
    </div>
    <div
      class="w-full -mt-4 bg-white rounded-t-2xl md:rounded-none md:w-[768px] md:mt-0 box-border md:box-content px-10 md:pb-4 flex-0 flex flex-col justify-between items-center"
    >
      <header></header>
      <slot />
      <footer class="opacity-60 text-xs">&copy;2022 ECNC</footer>
    </div>
  </div>
</template>

<style scoped></style>
