<script lang="ts" setup>
import { NCard, NAvatar } from 'naive-ui';
import { useUserAgent } from '~~/composables/login/user-agent';

definePageMeta({
  layout: 'sso',
});

const { data: session } = await useAsyncQuery(['getSession']);
const isSessionExist = computed(() => !!session.value);

const route = useRoute();
const { redirect } = route.query;

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
  await refreshNuxtData();
  isLogoutLoading.value = false;
};

const userAgent = useUserAgent().toLowerCase();
const isWeChatLoginEnabled = computed(
  () => !isSessionExist.value && userAgent.includes('micromessenger')
);
const isLarkLoginEnabled = computed(
  () => !isSessionExist.value && userAgent.includes('lark')
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
  <div class="w-full md:w-[384px] my-8">
    <div class="text-black mb-12">
      <p class="text-base opacity-40 my-1">
        <!-- <Icon name="icon-park-outline:login" /> -->
        <span class="align-middle">登录至</span>
      </p>
      <p class="text-3xl my-0 text-[#2080F0]">{{ domain }}</p>
    </div>
    <n-card v-if="session">
      <div class="text-center py-6">
        <n-avatar round :size="96" src="/img/ecnc.svg" color="#fff" />
        <div class="text-xl mt-2">{{ session.name }}</div>
        <div class="text-xs mt-1 opacity-60">{{ session.netid }}</div>
      </div>
      <template #footer>
        <div class="flex">
          <icon-button
            class="flex-1 mr-4"
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
      <login-wechat v-if="isWeChatLoginEnabled" />
      <login-form @success="handleLoginSuccess" />
    </div>
  </div>
</template>

<style scoped></style>
