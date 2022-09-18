<script setup lang="ts">
import { NCard, NAvatar } from 'naive-ui';

const { data } = await useAsyncQuery(['getSession']);

const { data: session } = await useAsyncQuery(['getSession']);
if (!session.value) {
  await navigateTo({
    path: '/sso/login',
    params: {
      redirect: '/sso/link/wechat',
      disable_wechat: 'true',
    },
  });
}

const name = computed(() => session.value?.name);
const netid = computed(() => session.value?.netid);

const getOpenId = async () => {
  const params = new URLSearchParams({
    redirect: 'https://people.ecnc.link/sso/link/wechat',
  });

  const { data } = await useFetch(
    '/api/sso/wechat/authorize?' + params.toString()
  );

  await navigateTo(data.value?.authorizeUrl, {
    external: true,
    redirectCode: 302,
  });
};

const isLogoutLoading = ref(false);
const logout = async () => {
  const client = useClient();

  isLogoutLoading.value = true;
  await client.mutation('logout');
  await refreshNuxtData();
  isLogoutLoading.value = false;
};
</script>

<template>
  <n-card>
    <div class="text-center py-6">
      <n-avatar round :size="96" src="/img/ecnc.svg" color="#fff" />
      <div class="text-xl mt-2">{{ name }}</div>
      <div class="text-xs mt-1 opacity-60">{{ netid }}</div>
    </div>
    <template #footer>
      <div v-if="data" class="flex">
        <icon-button
          class="flex-1 mr-4"
          icon="icon-park-outline:login"
          round
          type="primary"
          @click="getOpenId"
        >
          确认绑定
        </icon-button>
        <icon-button
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
</template>
