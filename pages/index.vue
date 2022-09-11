<script lang="ts" setup>
import { NCard, NAvatar } from 'naive-ui';

const { data, error } = await useFetch('/api/sso/session', {
  headers: useRequestHeaders(['cookie'])
});

const isSessionExist = computed(() => !error.value);
const handleLoginSuccess = () => {
  // refreshNuxtData();
}

</script>

<template>
  <div class="m-0 p-0 min-h-screen flex flex-col md:flex-row md:justify-end md:items-stretch">
    <div
      class="bg-[url(https://s2.loli.net/2022/03/31/2zfek39LnFjJvmt.jpg)] bg-cover bg-center flex-1 px-10 md:px-20 py-14">
      <img alt="ECNC Logo" class="w-20 h-20" src="~/assets/ecnc.svg" />
    </div>
    <div class="w-full md:w-[768px] box-border md:box-content px-10 pb-4 flex-0 flex flex-col justify-between items-center">
      <header></header>
      <div class="w-full md:w-[384px] my-8">
        <div class="text-black mb-12">
          <p class="text-base opacity-40 my-1">
            <!-- <Icon name="icon-park-outline:login" /> -->
            <span class="align-middle">登录至</span>
          </p>
          <p class="text-3xl my-0 text-[#2080F0]">前台参考手册</p>
        </div>
        <n-card v-if="isSessionExist">
          <div class="text-center py-6">
            <n-avatar round :size="96" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
            <div class="text-xl mt-2">{{ data.name }}</div>
            <div class="text-xs mt-1 opacity-60">{{ data.netid }}</div>
          </div>
          <template #footer>
            <div class="flex">
              <icon-button class="flex-1 mr-4" icon="icon-park-outline:login" round type="primary">确认登录</icon-button>
              <icon-button class="" icon="icon-park-solid:wrong-user" round secondary type="error">这不是我</icon-button>
            </div>
          </template>
        </n-card>
        <login-form v-else @success="handleLoginSuccess" />
      </div>
      <footer class="opacity-60 text-xs">&copy;2022 ECNC</footer>
    </div>
  </div>

</template>

<style scoped>
</style>
