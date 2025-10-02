// @ts-check
import {defineConfig} from 'astro/config';
import vue from '@astrojs/vue';
import icon from 'astro-icon';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      appEntrypoint: '/src/app',
    }),
    icon()
  ],
  adapter: node({
    mode: 'standalone'
  }),
  output: 'server'
});