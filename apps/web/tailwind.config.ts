import base from '@santarita/config/tailwind.base';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...base,
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
