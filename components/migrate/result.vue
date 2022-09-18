<script setup lang="ts">
import { NResult, NCard } from 'naive-ui';

const route = useRoute();

const status = ref('418');
const title = ref('绑定成功');
const description = ref('现在可以关掉这个页面了');

const headers = useClientHeaders();
headers.value = useRequestHeaders();

async function linkWechat(state: string) {
  const { error } = await useAsyncQuery([
    'linkWechat',
    {
      state,
    },
  ]);

  if (error.value) {
    title.value = '绑定失败';
    description.value = error.value;
  }
}

const { state } = route.query;
if (state && !Array.isArray(state)) {
  await linkWechat(state);
}
</script>

<template>
  <n-card>
    <n-result
      class="py-6"
      :status="status"
      size="small"
      :title="title"
      :description="description"
    />
  </n-card>
</template>
