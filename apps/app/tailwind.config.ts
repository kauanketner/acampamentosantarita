// Tailwind 4 reads tokens from the @theme block in globals.css.
// This file is kept for tooling compatibility.

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
};

export default config;
