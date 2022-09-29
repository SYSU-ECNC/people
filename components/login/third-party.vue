<script setup lang="ts">
import { NDivider, NTooltip } from 'naive-ui';

const route = useRoute();
const { redirect } = route.query;

const isLarkLoginLoading = ref(false);
const larkLogin = async () => {
  if (!redirect || Array.isArray(redirect)) {
    return;
  }

  isLarkLoginLoading.value = true;

  const params = new URLSearchParams({ redirect });
  const { authorizeUrl } = await $fetch(
    '/api/sso/lark/authorize?' + params.toString()
  );

  await navigateTo(authorizeUrl, {
    external: true,
    redirectCode: 302,
  });
};
</script>

<template>
  <div>
    <n-divider title-placement="center">
      <span class="text-xs opacity-60">快捷登录方式</span>
    </n-divider>
    <div class="my-0">
      <div class="flex justify-between">
        <icon-button
          class="mr-3 flex-1"
          icon="icon-park-outline:new-lark"
          color="#3574f7"
          ghost
          round
          size="large"
          :loading="isLarkLoginLoading"
          @click="larkLogin"
        >
          飞书登录
        </icon-button>
        <n-tooltip>
          <template #trigger>
            <icon-button
              class="mr-3"
              icon="icon-park-outline:wechat"
              color="#07C160"
              ghost
              circle
              size="large"
            />
          </template>
          暂不可用
        </n-tooltip>
        <n-tooltip>
          <template #trigger>
            <icon-button
              icon="nimbus:university"
              color="#0288cc"
              ghost
              circle
              size="large"
            />
          </template>
          中山大学 CAS 登录（暂不可用）
        </n-tooltip>
      </div>
    </div>
  </div>
</template>
