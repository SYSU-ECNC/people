<script lang="ts" setup>
import { NCard, NAvatar } from 'naive-ui';
import { useUserAgent } from '~~/composables/login/user-agent';

definePageMeta({
  layout: 'sso',
});

const { data: session } = await useAsyncQuery(['getSession']);
const isSessionExist = computed(() => !!session.value);

const route = useRoute();
const { redirect, from } = route.query;

const finishRedirection = async () => {
  await navigateTo(Array.isArray(redirect) ? redirect[0] : redirect, {
    external: true,
    redirectCode: 302,
  });
};

const handleLoginSuccess = () => {
  finishRedirection();
};

const isLogoutLoading = ref(false);
const logout = async () => {
  const client = useClient();

  isLogoutLoading.value = true;
  await client.mutation('logout');
  await navigateTo({
    path: '/sso/login',
    query: {
      redirect,
      disable_wechat: 'true',
    },
  });
  await refreshNuxtData();
  isLogoutLoading.value = false;
};

const userAgent = useUserAgent().toLowerCase();
const isWeChatAutoLoginEnabled = computed(
  () =>
    false &&
    !isSessionExist.value &&
    (userAgent.includes('micromessenger') || from === 'wechat')
);
const isLarkAutoLoginEnabled = computed(
  () => !isSessionExist.value && (userAgent.includes('lark') || from === 'lark')
);

const domain = computed(() => {
  const redirectUrl = (Array.isArray(redirect) ? redirect[0] : redirect) ?? '';
  if (redirectUrl.startsWith('/sso/discourse?')) {
    return '网管之家';
  }

  const url = new URL(redirectUrl ?? '', 'https://people.ecnc.link');
  return url.host;
});
</script>

<template>
  <div class="my-8 w-full md:w-[384px]">
    <div class="mb-12 text-black">
      <p class="my-1 text-base opacity-40">
        <!-- <Icon name="icon-park-outline:login" /> -->
        <span class="align-middle">登录至</span>
      </p>
      <p class="my-0 text-3xl text-[#2080F0]">{{ domain }}</p>
    </div>
    <n-card v-if="session">
      <div class="py-6 text-center">
        <n-avatar round :size="96" src="/img/ecnc.svg" color="#fff" />
        <div class="mt-2 text-xl">{{ session.name }}</div>
        <div class="mt-1 text-xs opacity-60">{{ session.netid }}</div>
      </div>
      <template #footer>
        <div class="flex">
          <icon-button
            class="mr-4 flex-1"
            icon="icon-park-outline:login"
            round
            type="primary"
            @click="finishRedirection"
          >
            确认登录
          </icon-button>
          <icon-button
            hidden
            class=""
            icon="icon-park-solid:wrong-user"
            round
            secondary
            type="error"
            :loading="isLogoutLoading"
            @click="logout"
          >
            这不是我
          </icon-button>
        </div>
      </template>
    </n-card>
    <div v-else>
      <login-wechat v-if="isWeChatAutoLoginEnabled" />
      <login-lark v-if="isLarkAutoLoginEnabled" />
      <login-form @success="handleLoginSuccess" />
      <login-third-party />
    </div>
  </div>
</template>

<style scoped></style>
