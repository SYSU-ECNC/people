<script lang="ts" setup>
import { NLayout, NLayoutSider, NLayoutContent, NMenu, MenuOption } from 'naive-ui';

const menuOptions = ref<MenuOption[]>([
  {
    key: 'user',
    label: 'User',
  }
])
</script>

<template>
  <div>
    <n-layout has-sider>
      <n-layout-sider>
        <n-menu :options="menuOptions" />
      </n-layout-sider>
      <n-layout>
        <n-layout-content class="p-6">
          <slot />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>