/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/client';
import 'vditor/dist/index.css';
import { MarkdownVditor } from './components';
import { MarkdownVditorFieldInterface } from './interfaces/markdown-vditor';
export class PluginFieldMarkdownVditorClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.addComponents({ MarkdownVditor });
    this.initVditorDependency();
    this.app.dataSourceManager.addFieldInterfaces([MarkdownVditorFieldInterface]);
  }

  getCDN() {
    if (process.env.NODE_ENV !== 'production') {
      // 开发模式下使用远程 cdn
      return 'https://unpkg.com/vditor@3.10.4';
    }
    // 生产环境，使用本地链接，支持内网
    // 需要支持子目录，比如应用部署在 /xxx/ 目录下
    return this.app.getPublicPath() + 'static/plugins/@nocobase/plugin-field-markdown-vditor/dist/client/vditor';
  }

  initVditorDependency() {

  }
}

export default PluginFieldMarkdownVditorClient;
