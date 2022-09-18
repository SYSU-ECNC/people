<script setup lang="tsx">
import { DataTableColumns, NH1, NDataTable, NTag, NIcon } from 'naive-ui';

definePageMeta({
  layout: 'admin',
});

const columns: DataTableColumns = [
  {
    title: '#',
    key: 'id',
  },
  {
    title: 'NetID',
    key: 'netid',
  },
  {
    title: '姓名',
    key: 'name',
  },
  {
    title: '账号关联',
    key: 'integrations',
    render(row) {
      return (
        <>
          <NTag
            class="mr-2"
            type={row.larkUnionId ? 'info' : 'default'}
            bordered={false}
          >
            {{
              default: () => (row.larkUnionId ? '已关联飞书' : '未关联飞书'),
              icon: () => (
                <NIcon>
                  <Icon name="icon-park-outline:new-lark" />
                </NIcon>
              ),
            }}
          </NTag>
          <NTag type={row.wechatOpenId ? 'success' : 'default'}>
            {{
              default: () => (row.wechatOpenId ? '已关联微信' : '未关联微信'),
              icon: () => (
                <NIcon>
                  <Icon name="icon-park-outline:wechat" />
                </NIcon>
              ),
            }}
          </NTag>
        </>
      );
    },
  },
];

const { data } = await useFetch('/api/admin/users', {
  headers: useRequestHeaders(['cookie']),
});
</script>

<template>
  <div>
    <n-h1>所有用户</n-h1>
    <n-data-table
      v-if="data"
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
    />
  </div>
</template>

<style scoped>
:deep(.icon) {
  vertical-align: inherit;
}
</style>
