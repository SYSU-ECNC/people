<script lang="ts" setup>
import { NResult } from 'naive-ui';

definePageMeta({
  layout: 'sso',
});

const title = ref('');
const description = ref('');

const route = useRoute();
const encryptedNetid =
  (Array.isArray(route.query.netid)
    ? route.query.netid[0]
    : route.query.netid) ?? '';
const { data: user } = await useAsyncQuery([
  'welcome.userInfo',
  { encryptedNetid },
]);

const navigateToUrl = ref('');

const getOpenId = async () => {
  const params = new URLSearchParams({
    redirect: route.fullPath,
  });

  const { data } = await useFetch(
    '/api/sso/wechat/authorize?' + params.toString()
  );

  navigateToUrl.value = data.value?.authorizeUrl;
};

const bindOpenId = async () => {
  const { error } = await useAsyncQuery([
    'welcome.bindWechat',
    {
      encryptedNetid,
      state: route.query.state,
    },
  ]);

  if (error.value) {
    title.value = '有点意外';
    description.value = error.value;
  }

  navigateToUrl.value = '/welcome?netid=' + encryptedNetid;
};

if (!user.value) {
  title.value = '链接已失效';
  description.value = '如有疑问，请联系招新群群管理员';
} else if (!route.query.state) {
  await getOpenId();
} else {
  await bindOpenId();
}

if (navigateToUrl.value) {
  await navigateTo(navigateToUrl.value, {
    external: true,
    redirectCode: 302,
  });
}
</script>

<template>
  <div class="w-full md:w-[384px] my-8">
    <n-result
      v-if="!user"
      class="py-6"
      status="418"
      size="small"
      :title="title"
      :description="description"
    >
    </n-result>
  </div>
</template>
