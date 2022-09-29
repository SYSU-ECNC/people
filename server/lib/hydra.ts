import { Configuration, AdminApi } from '@ory/hydra-client';

export const hydraAdmin = new AdminApi(
  new Configuration({
    basePath: useRuntimeConfig().hydra.adminPath,
  })
);
