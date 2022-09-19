<script lang="ts" setup>
import { NCard, NSteps, NStep } from 'naive-ui';
</script>

<template>
  <n-card title="最后一步">
    <n-steps vertical status="process">
      <n-step title="查收确认短信">
        <div class="text-black text-opacity-60">
          你的手机会收到一封确认短信<br />
          请点击短信中的链接确认加入 ECNC 飞书<br />
          如果没有收到，请检查是否被手机系统拦截
        </div>
      </n-step>
      <n-step title="下载飞书">
        <span class="text-black text-opacity-60">
          手机：在应用商店中搜索 飞书<br />
          电脑：浏览器打开 feishu.cn 下载
        </span>
      </n-step>
      <n-step title="登录飞书，查收欢迎信">
        <span class="text-black text-opacity-60">
          请使用刚刚输入的手机号登录飞书<br />
          登录之后你将收到 ECNC 小助手发送的欢迎信<br />
          请根据欢迎信的指引完成剩余的入职流程
        </span>
      </n-step>
    </n-steps>
  </n-card>
</template>
