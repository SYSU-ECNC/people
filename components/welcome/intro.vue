<script lang="ts" setup>
import { NCard, NSteps, NStep } from 'naive-ui';

defineEmits<{ (event: 'next'): void }>();
</script>

<template>
  <n-card title="线上入职流程">
    <n-steps vertical status="process">
      <n-step title="完善必要的个人信息">
        <span class="text-black text-opacity-60">请务必认真填写 & 核实</span>
      </n-step>
      <n-step title="开通飞书账号">
        <span class="text-black text-opacity-60">
          飞书是 ECNC 使用的办公软件之一
        </span>
      </n-step>
      <n-step title="登录飞书，查收欢迎信">
        <span class="text-black text-opacity-60">
          请根据欢迎信指引完成剩余的入职流程
        </span>
      </n-step>
    </n-steps>
    <template #action>
      <div class="text-right">
        <icon-button
          icon="icon-park-outline:right"
          type="primary"
          icon-placement="right"
          secondary
          @click="$emit('next')"
        >
          开始
        </icon-button>
      </div>
    </template>
  </n-card>
</template>
