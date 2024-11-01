/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import type { DevDynamicImport } from '../Application';
import type { Plugin } from '../Plugin';
import type { PluginData } from '../PluginManager';

/**
 * @internal
 */
export function defineDevPlugins(plugins: Record<string, typeof Plugin>) {
  Object.entries(plugins).forEach(([packageName, plugin]) => {
    // window.define(`${packageName}/client`, () => plugin);
    console.error('TO BE IMPLEMENTED!')
  });
}

/**
 * @internal
 */
export function definePluginClient(packageName: string) {

  console.error("Was  trying to define plugin module!")
}



/**
 * @internal
 */
export function processRemotePlugins(pluginData: PluginData[], resolve: (plugins: [string, typeof Plugin][]) => void) {
  return (...pluginModules: (typeof Plugin & { default?: typeof Plugin })[]) => {
    const res: [string, typeof Plugin][] = pluginModules
      .map<[string, typeof Plugin]>((item, index) => [pluginData[index].name, item?.default || item])
      .filter((item) => item[1]);
    resolve(res);

    const emptyPlugins = pluginModules
      .map((item, index) => (!item ? index : null))
      .filter((i) => i !== null)
      .map((i) => pluginData[i].packageName);

    if (emptyPlugins.length > 0) {
      console.error(
        '[nocobase load plugin error]: These plugins do not have an `export.default` exported content or there is an error in the plugins. error plugins: \r\n%s',
        emptyPlugins.join(', \r\n'),
      );
    }
  };
}

/**
 * @internal
 */
export function getRemotePlugins(
  pluginData: PluginData[] = [],
): Promise<Array<[string, typeof Plugin]>> {

  const packageNames = pluginData.map((item) => item.packageName);
  packageNames.forEach((packageName) => {
    definePluginClient(packageName);
  });

  return new Promise((resolve, reject) => {
    console.error("was loading remote plugins")
  });
}

interface GetPluginsOption {
  pluginData: PluginData[];
  devDynamicImport?: DevDynamicImport;
}

/**
 * @internal
 */
export async function getPlugins(options: GetPluginsOption): Promise<Array<[string, typeof Plugin]>> {
  const { pluginData, devDynamicImport } = options;
  if (pluginData.length === 0) return [];

  const res: Array<[string, typeof Plugin]> = [];

  const resolveDevPlugins: Record<string, typeof Plugin> = {};
  if (devDynamicImport) {
    for await (const plugin of pluginData) {
      const pluginModule = await devDynamicImport(plugin.packageName);
      if (pluginModule) {
        res.push([plugin.name, pluginModule.default]);
        resolveDevPlugins[plugin.packageName] = pluginModule.default;
      }
    }
    defineDevPlugins(resolveDevPlugins);
  }

  const remotePlugins = pluginData.filter((item) => !resolveDevPlugins[item.packageName]);

  if (remotePlugins.length === 0) {
    return res;
  }

  if (res.length === 0) {
    console.error("was trying to import plugins")
  }

  return res;
}
