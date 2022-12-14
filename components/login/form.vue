<script lang="ts" setup>
import { NForm, NFormItem, NInput, NTooltip, FormInst } from 'naive-ui';
import type { TError } from '@robinwongm/trpc-nuxt/dist/runtime/client';

const emit = defineEmits<{
  (event: 'success'): void;
}>();

const formRef = ref<FormInst | null>(null);

const model = ref({
  netid: '',
  password: '',
});

const rules = {
  netid: {
    required: true,
    trigger: ['input'],
  },
  password: {
    required: true,
    trigger: ['input'],
  },
};

const isSubmitting = ref(false);

const isLoginSuccess = ref(false);
const loginButtonParams = computed(() => {
  if (isLoginSuccess.value) {
    return {
      type: 'success',
      icon: 'icon-park-solid:check-correct',
      content: '登录成功，正在跳转...',
    };
  }

  return {
    type: 'primary',
    icon: 'icon-park-outline:login',
    content: '登录',
  };
});

const isErrorMessageVisible = ref(false);
const errorMessage = ref('');

const client = useClient();

const hideErrorMessage = () => (isErrorMessageVisible.value = false);
const handleLoginFormSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }

    isSubmitting.value = true;

    client
      .mutation('loginByPassword', model.value)
      .then(() => {
        isLoginSuccess.value = true;
        emit('success');
      })
      .catch((error: TError) => {
        errorMessage.value = error.message;
        isErrorMessageVisible.value = true;
      })
      .finally(() => {
        isSubmitting.value = false;
      });
  });
};
</script>

<template>
  <div>
    <n-form
      ref="formRef"
      class="my-4"
      :model="model"
      :rules="rules"
      :show-label="false"
      :show-feedback="false"
    >
      <n-form-item class="mb-4" path="netid">
        <n-input
          v-model:value="model.netid"
          type="text"
          placeholder="请输入 NetID"
          autofocus
          :input-props="{ spellcheck: false }"
        />
      </n-form-item>
      <n-form-item class="mb-2" path="password">
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter="handleLoginFormSubmit"
        />
      </n-form-item>
      <div class="mb-2 text-right">
        <icon-button
          icon="icon-park-outline:distraught-face"
          class="text-gray-400"
          text
          type="tertiary"
          size="tiny"
          >忘记账号 / 密码</icon-button
        >
      </div>
      <n-tooltip
        trigger="manual"
        :show="isErrorMessageVisible"
        @clickoutside="hideErrorMessage"
      >
        <template #trigger>
          <icon-button
            block
            :type="loginButtonParams.type"
            :icon="loginButtonParams.icon"
            :loading="isSubmitting"
            @click="handleLoginFormSubmit"
          >
            {{ loginButtonParams.content }}
          </icon-button>
        </template>
        {{ errorMessage }}
      </n-tooltip>
    </n-form>
  </div>
</template>
