// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';


export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = readingTime.minutes;
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://fluxdv.mgdc.site',
  output: 'static',

  markdown: {
    remarkPlugins: [remarkReadingTime],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});