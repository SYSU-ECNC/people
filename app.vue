<script lang="ts" setup>
import { NConfigProvider, NGlobalStyle, NMessageProvider, darkTheme } from 'naive-ui';

const themeOverrides = {
  "common": {
    "primaryColor": "#2080F0FF",
    "primaryColorHover": "#4098FCFF",
    "primaryColorPressed": "#1060C9FF",
    "primaryColorSuppl": "#4098FCFF"
  }
}
</script>

<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides" inline-theme-disabled>
      <n-global-style />
      <n-message-provider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<style>
  * {
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
  }

  @media (prefers-color-scheme: dark) {
    /* body {
      background-color: black;
    } */
  }
</style>