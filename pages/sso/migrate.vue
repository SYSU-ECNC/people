<script lang="ts" setup>
import { NCard, NAvatar, NResult } from 'naive-ui';
import { useUserAgent } from '~~/composables/login/user-agent';

definePageMeta({
  layout: 'sso',
});

const userAgent = useUserAgent().toLowerCase();
const isWeChatLoginEnabled = computed(() =>
  userAgent.includes('micromessenger')
);

const {
  query: { state },
} = useRoute();
</script>

<template>
  <div class="w-full md:w-[384px] my-8">
    <div class="text-black mb-12">
      <p class="text-base opacity-40 my-1">
        <!-- <Icon name="icon-park-outline:login" /> -->
        <span class="align-middle">ECNCbeta 老用户</span>
      </p>
      <p class="text-3xl my-0 text-[#2080F0]">快速绑定微信号</p>
    </div>
    <migrate-non-wechat v-if="!isWeChatLoginEnabled"></migrate-non-wechat>
    <migrate-result v-if="state"></migrate-result>
    <migrate-confirm v-else></migrate-confirm>
  </div>
</template>

<style scoped></style>
