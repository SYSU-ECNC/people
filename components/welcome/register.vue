<script lang="ts" setup>
import {
  NForm,
  NCard,
  NFormItem,
  NSelect,
  NInput,
  FormRules,
  FormInst,
  useMessage,
} from 'naive-ui';

interface UserInfo {
  netid: string;
  name: string;
  studentId: string;
  school: string | null;
  dorm: string | null;
  grade: string | null;
  graduateYear: string | null;
  phone: string | null;
  email: string | null;
}

const props = defineProps<{
  encryptedNetid: string;
  userInfo: UserInfo;
}>();
const emit = defineEmits<{ (event: 'next'): void }>();

const formRef = ref<FormInst | null>(null);

const model = ref({
  ...props.userInfo,
});

const rules: FormRules = {
  netid: { required: true },
  name: { required: true },
  studentId: { required: true },
  school: { required: true },
  dorm: { required: true },
  grade: { required: true },
  graduateYear: { required: true },
  phone: { required: true, len: 11 },
  email: { required: true },
};

const gradeOptions = [
  {
    type: 'group',
    label: '本科',
    key: 'bachelor',
    children: [
      {
        label: '大一',
        value: '1',
      },
      {
        label: '大二',
        value: '2',
      },
      {
        label: '大三',
        value: '3',
      },
      {
        label: '大四',
        value: '4',
      },
      {
        label: '大五',
        value: '5',
      },
    ],
  },
  {
    type: 'group',
    label: '硕士研究生',
    key: 'postgraduate',
    children: [
      {
        label: '研一',
        value: '6',
      },
      {
        label: '研二',
        value: '7',
      },
      {
        label: '研三',
        value: '8',
      },
    ],
  },
];

const graduateYearOptions = [
  {
    label: '2023',
    value: '2023',
  },
  {
    label: '2024',
    value: '2024',
  },
  {
    label: '2025',
    value: '2025',
  },
  {
    label: '2026',
    value: '2026',
  },
  {
    label: '2027',
    value: '2027',
  },
];

const dormOptions = [
  {
    type: 'group',
    label: '至善园',
    key: 'Z',
    children: [
      {
        label: '至善园一号',
        value: 'Z1',
      },
      {
        label: '至善园二号',
        value: 'Z2',
      },
      {
        label: '至善园三号',
        value: 'Z3',
      },
      {
        label: '至善园四号',
        value: 'Z4',
      },
      {
        label: '至善园五号',
        value: 'Z5',
      },
      {
        label: '至善园六号',
        value: 'Z6',
      },
      {
        label: '至善园七号',
        value: 'Z7',
      },
      {
        label: '至善园八号',
        value: 'Z8',
      },
      {
        label: '至善园九号',
        value: 'Z9',
      },
      {
        label: '至善园十号',
        value: 'Z10',
      },
    ],
  },
  {
    type: 'group',
    label: '明德园',
    key: 'M',
    children: [
      {
        label: '明德园一号',
        value: 'M1',
      },
      {
        label: '明德园二号',
        value: 'M2',
      },
      {
        label: '明德园三号',
        value: 'M3',
      },
      {
        label: '明德园五号',
        value: 'M5',
      },
      {
        label: '明德园七号',
        value: 'M7',
      },
      {
        label: '明德园八号',
        value: 'M8',
      },
      {
        label: '明德园九号',
        value: 'M9',
      },
      {
        label: '明德园十号',
        value: 'M10',
      },
      {
        label: '明德园十二号',
        value: 'M12',
      },
    ],
  },
  {
    type: 'group',
    label: '慎思园',
    key: 'S',
    children: [
      {
        label: '慎思园五号',
        value: 'S5',
      },
      {
        label: '慎思园六号',
        value: 'S6',
      },
      {
        label: '慎思园七号',
        value: 'S7',
      },
      {
        label: '慎思园八号',
        value: 'S8',
      },
      {
        label: '慎思园九号',
        value: 'S9',
      },
      {
        label: '慎思园十号',
        value: 'S10',
      },
    ],
  },
  {
    type: 'group',
    label: '格致园',
    key: 'G',
    children: [
      {
        label: '格致园一号',
        value: 'G1',
      },
      {
        label: '格致园二号',
        value: 'G2',
      },
      {
        label: '格致园三号 1 单元',
        value: 'G3-1',
      },
      {
        label: '格致园三号 2 单元',
        value: 'G3-2',
      },
      {
        label: '格致园三号 3 单元',
        value: 'G3-3',
      },
      {
        label: '格致园三号 4 单元',
        value: 'G3-4',
      },
    ],
  },
];

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
      .mutation('welcome.updateUserInfo', {
        encryptedNetid: props.encryptedNetid,
        ...model.value,
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
  <div>
    <n-card title="完善个人信息">
      <div class="text-black text-opacity-60 mb-4">
        如果下方部分无法修改的信息与实际不符，请暂停线上入职，并联系招新群管理员。
      </div>
      <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="netid" label="NetID">
          <n-input v-model:value="model.netid" disabled></n-input>
        </n-form-item>
        <n-form-item path="name" label="姓名">
          <n-input v-model:value="model.name" disabled></n-input>
        </n-form-item>
        <n-form-item path="studentId" label="学号">
          <n-input v-model:value="model.studentId" disabled></n-input>
        </n-form-item>
        <n-form-item path="school" label="学院">
          <n-input v-model:value="model.school" disabled></n-input>
        </n-form-item>
        <n-form-item path="dorm" label="宿舍">
          <n-select
            v-model:value="model.dorm"
            :options="dormOptions"
          ></n-select>
        </n-form-item>
        <n-form-item path="grade" label="当前年级">
          <n-select
            v-model:value="model.grade"
            :options="gradeOptions"
          ></n-select>
        </n-form-item>
        <n-form-item path="graduateYear" label="预计毕业年份">
          <n-select
            v-model:value="model.graduateYear"
            :options="graduateYearOptions"
          ></n-select>
        </n-form-item>
        <n-form-item path="phone" label="手机号">
          <n-input
            v-model:value="model.phone"
            placeholder="你将使用这个手机号登录飞书 & 进行工作沟通。"
          ></n-input>
        </n-form-item>
        <n-form-item path="email" label="个人邮箱">
          <n-input
            v-model:value="model.email"
            placeholder="比如 <NetID>@mail2.sysu.edu.cn"
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
  </div>
</template>
