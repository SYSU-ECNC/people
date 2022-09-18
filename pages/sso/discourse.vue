<script lang="ts" setup>
definePageMeta({
  layout: 'sso',
});

const description = ref('咋回事呢');

const {
  query: { state },
} = useRoute();

if (state && !Array.isArray(state)) {
  const { data, error } = await useAsyncQuery(['loginToDiscourse', { state }]);
  if (data.value) {
    await navigateTo(data.value, {
      external: true,
      redirectCode: 302,
    });
  }

  if (error.value) {
    description.value = error.value;
  }
}
</script>

<template>
  <div class="w-full md:w-[384px] my-8">
    <div class="text-black mb-12">
      <p class="text-base opacity-40 my-1">
        <span class="align-middle">登录至</span>
      </p>
      <p class="text-3xl my-0 text-[#2080F0]">Discourse</p>
    </div>
    <n-card>
      <n-result
        class="py-6"
        status="418"
        size="small"
        title="出问题了"
        :description="description"
      />
    </n-card>
  </div>
</template>

<style scoped></style>
