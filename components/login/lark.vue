<script lang="ts" setup>
import { NAlert } from 'naive-ui';

const route = useRoute();

const navigateToUrl = ref('');
const errorMessage = ref('');

const { redirect, error, state, from, disable_lark: disableLark } = route.query;

async function authorize() {
  const params = new URLSearchParams({
    redirect: new URL(route.fullPath, 'https://people.ecnc.link/').toString(),
  });

  const { data } = await useFetch(
    '/api/sso/lark/authorize?' + params.toString()
  );

  navigateToUrl.value = data.value?.authorizeUrl;
}

async function login() {
  if (!state || Array.isArray(state)) {
    errorMessage.value = '错误的 state。';
    return;
  }

  const { error } = await useAsyncQuery(['loginByLark', { state }]);

  if (error.value) {
    errorMessage.value = error.value;
    return;
  }

  if (!redirect || Array.isArray(redirect)) {
    errorMessage.value = '错误的 redirectUrl。';
    return;
  }

  navigateToUrl.value = redirect;
}

if (error) {
  errorMessage.value = Array.isArray(error) ? error.join('\n') : error;
} else if (disableLark) {
  // do nothing
} else if (from === 'lark' && state) {
  await login();
} else {
  await authorize();
}

if (navigateToUrl.value) {
  await navigateTo(navigateToUrl.value, {
    external: true,
    redirectCode: 302,
  });
}
</script>

<template>
  <n-alert
    v-if="errorMessage"
    title="飞书登录时失败了。"
    :show-icon="true"
    type="info"
  >
    {{ errorMessage }}
  </n-alert>
</template>
