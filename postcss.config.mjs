/** @type {import('postcss-load-config').Config} */

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Ensure compatibility for CSS across browsers
  },
};

export default config;
