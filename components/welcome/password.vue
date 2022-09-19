<script lang="ts" setup>
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  FormRules,
  FormInst,
  useMessage,
} from 'naive-ui';

const props = defineProps<{
  encryptedNetid: string;
  netid: string;
}>();
const emit = defineEmits<{ (event: 'next'): void }>();

const formRef = ref<FormInst | null>(null);
const model = ref({
  netid: props.netid,
  password: '',
});
const rules: FormRules = {
  netid: { required: true },
  password: {
    required: true,
    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
    message:
      '密码的最小长度为 8 位，且需要同时包括数字、小写英文字母、大写英文字母与特殊符号。',
  },
};

const isSubmitting = ref(false);
const client = useClient();
const message = useMessage();
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }

    isSubmitting.value = true;
    client
      .mutation('welcome.updatePassword', {
        encryptedNetid: props.encryptedNetid,
        password: model.value.password,
      })
      .then(() => {
        emit('next');
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => (isSubmitting.value = false));
  });
};
</script>

<template>
  <n-card title="设置 ECNC 账号">
    <div class="text-black text-opacity-60 my-4">
      ECNC 账号是 ECNC 各种系统的通行证。<br />网管之家论坛、工作日志、请假系统等均使用
      ECNC 账号登录。<br />
      ECNC 账号的用户名与你的 NetID 一致，且不可修改。
    </div>
    <div class="text-black text-opacity-60 my-4">
      现在，请你设置你的 ECNC 账号的密码。<br />
      请不要使用与你的 NetID 账号密码相同的密码。<br />
      密码的最小长度为 8 位，且需要同时包括数字、<span class="font-bold"
        >大小写</span
      >英文字母与特殊符号。
    </div>
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="netid" label="NetID">
        <n-input v-model:value="model.netid" disabled></n-input>
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="我不会偷看的"
        ></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <div class="text-right">
        <icon-button
          icon="icon-park-outline:right"
          type="primary"
          icon-placement="right"
          secondary
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          下一步
        </icon-button>
      </div>
    </template>
  </n-card>
</template>
