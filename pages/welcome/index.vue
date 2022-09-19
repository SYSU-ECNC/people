<script lang="ts" setup>
import { NMessageProvider, NResult } from 'naive-ui';

definePageMeta({
  layout: 'sso',
});

const route = useRoute();
const encryptedNetid =
  (Array.isArray(route.query.netid)
    ? route.query.netid[0]
    : route.query.netid) ?? '';
const { data: user } = await useAsyncQuery([
  'welcome.userInfo',
  { encryptedNetid },
]);

const step = ref(0);
</script>

<template>
  <n-message-provider placement="bottom-right">
    <div class="w-full md:w-[384px] my-8">
      <n-result
        v-if="!user"
        class="py-6"
        status="418"
        size="small"
        title="链接已失效"
        description="如有疑问，请联系招新群群管理员"
      >
      </n-result>
      <div v-else>
        <div class="text-black mb-12">
          <p class="text-base opacity-40 my-1">
            <!-- <Icon name="icon-park-outline:login" /> -->
            <span class="align-middle">亲爱的{{ user.name }}同学</span>
          </p>
          <p class="text-3xl my-0 text-[#2080F0]">欢迎加入 ECNC</p>
        </div>
        <welcome-intro v-if="step === 0" @next="step = 1"></welcome-intro>
        <welcome-register
          v-else-if="step === 1"
          :encrypted-netid="encryptedNetid"
          :user-info="user"
          @next="step = 2"
        ></welcome-register>
        <welcome-link
          v-else-if="step === 2"
          :encrypted-netid="encryptedNetid"
          @next="step = 3"
        ></welcome-link>
        <welcome-done v-else></welcome-done>
      </div>
    </div>
  </n-message-provider>
</template>
