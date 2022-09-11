<script lang="ts" setup>
import { NButton, NIcon } from 'naive-ui';

type NButtonProps = InstanceType<typeof NButton>['$props'];

interface IconButtonProps extends NButtonProps {
  icon: string;
};

const props = defineProps<IconButtonProps>();
</script>

<template>
  <n-button v-bind="props">
    <template #icon>
      <n-icon>
        <Icon :name="icon" />
      </n-icon>
    </template>
    <slot />
  </n-button>
</template>

<style scoped>
  :deep(.icon) {
    vertical-align: inherit;
  }
</style>
