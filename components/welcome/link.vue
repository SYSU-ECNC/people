<script lang="ts" setup>
import { NCard, NResult, NButton, useMessage } from 'naive-ui';

const props = defineProps<{
  encryptedNetid: string;
}>();
defineEmits<{ (event: 'next'): void }>();

const { data: isLarkActive } = await useAsyncQuery([
  'welcome.isLarkActive',
  {
    encryptedNetid: props.encryptedNetid,
  },
]);

const status = computed(() => (isLarkActive.value ? 'success' : '418'));
const title = computed(() => (isLarkActive.value ? '已开通' : '就快好了'));
const description = computed(() =>
  isLarkActive.value ? '点下一步吧' : '点下边这个按钮开通一下'
);

const isLoading = ref(false);
const client = useClient();
const message = useMessage();
const createLarkAccount = () => {
  isLoading.value = true;
  client
    .mutation('welcome.createLarkAccount', {
      encryptedNetid: props.encryptedNetid,
    })
    .then(() => {
      return refreshNuxtData();
    })
    .catch((e) => {
      message.error(e.message);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<template>
  <n-card title="开通飞书账号">
    <n-result
      :status="status"
      :title="title"
      :description="description"
      class="my-4"
    >
      <template #footer>
        <n-button
          v-if="!isLarkActive"
          :loading="isLoading"
          @click="createLarkAccount"
        >
          使用手机号开通飞书账号
        </n-button>
      </template>
    </n-result>
    <template #action>
      <div class="text-right">
        <icon-button
          icon="icon-park-outline:right"
          type="primary"
          icon-placement="right"
          secondary
          :disabled="!isLarkActive"
          @click="$emit('next')"
        >
          下一步
        </icon-button>
      </div>
    </template>
  </n-card>
</template>
