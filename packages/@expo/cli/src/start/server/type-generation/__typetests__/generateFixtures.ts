import { writeFile } from 'fs/promises';
import { join } from 'path';

import { getTemplateString } from '../routes';

type Fixture = {
  staticRoutes: string[];
  dynamicRoutes: string[];
  dynamicRouteTemplates: string[];
};

const fixtures: Record<string, Fixture> = {
  basic: {
    staticRoutes: ['/apple', '/banana'],
    dynamicRoutes: ['/colors/${CleanRoutePart<T>}'],
    dynamicRouteTemplates: ['/colors/[color]'],
  },
};

export default async function () {
  await Promise.all(
    Object.entries(fixtures).map(async ([key, value]) => {
      const template = getTemplateString(
        new Set(value.staticRoutes),
        new Set(value.dynamicRoutes),
        new Set(value.dynamicRouteTemplates)
      )
        // The Template produces a global module .d.ts declaration
        // These replacements turn it into a local module
        .replace(/declare module "expo-router" {|(^}\\Z)/, '')
        .replaceAll(/export function/g, 'export declare function')
        .replaceAll(/export const/g, 'export declare const')
        // Remove the last `}`
        .slice(0, -2);

      return writeFile(join(__dirname, './fixtures/', key + '.ts'), template);
    })
  );
}
