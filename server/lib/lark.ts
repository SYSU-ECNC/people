import * as lark from '@larksuiteoapi/node-sdk';

export const larkClient = new lark.Client({
  appId: useRuntimeConfig().lark.appId,
  appSecret: useRuntimeConfig().lark.appSecret,
  appType: lark.AppType.SelfBuild,
  domain: lark.Domain.Feishu,
});
