<script setup lang="ts">
import { NCard, NAvatar } from 'naive-ui';

interface KratosSession {
  identity: {
    traits: {
      name: string;
      netid: string;
    };
  };
}

const { data } = await useFetch<KratosSession>(
  'https://accounts.ecnc.link/kratos/sessions/whoami',
  {
    headers: useRequestHeaders(['cookie']),
  }
);
if (!data.value) {
  // session 不存在，跳转至 accounts.ecnc.link 登录
  const loginUrl = new URL(
    'https://accounts.ecnc.link/kratos/self-service/login/browser'
  );
  loginUrl.searchParams.append(
    'return_to',
    'https://people.ecnc.link/sso/migrate'
  );

  await navigateTo(loginUrl.toString(), {
    external: true,
    redirectCode: 302,
  });
}

const name = computed(() => data.value?.identity.traits.name);
const netid = computed(() => data.value?.identity.traits.netid);

const getOpenId = async () => {
  const params = new URLSearchParams({
    redirect: 'https://people.ecnc.link/sso/migrate',
  });

  const { data } = await useFetch(
    '/api/sso/wechat/authorize?' + params.toString()
  );

  await navigateTo(data.value?.authorizeUrl, {
    external: true,
    redirectCode: 302,
  });
};

const notMe = () => {
  alert('不可能吧');
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
          @click="notMe"
        >
          这不是我
        </icon-button>
      </div>
    </template>
  </n-card>
</template>
