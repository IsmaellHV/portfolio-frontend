import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    plugins: [react()],
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          keep_classnames: false,
          keep_fnames: false,
        },
        output: {
          comments: false,
        },
      },
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        plugins: isBuild
          ? [
              obfuscatorPlugin({
                compact: true,
                controlFlowFlattening: true,
              }),
            ]
          : [],
        // output: {
        //   manualChunks: (id) => {
        //     if (id.includes('node_modules')) {
        //       if (id.includes('react')) return 'react-vendor';
        //       if (id.includes('react-dom')) return 'react-dom-vendor';
        //       if (id.includes('rsuite')) return 'rsuite-vendor';
        //       if (id.includes('primereact')) return 'primereact-vendor';
        //       if (id.includes('three')) return 'three-vendor';
        //       if (id.includes('gsap')) return 'gsap-vendor';
        //       return 'vendor';
        //     }
        //   },
        // },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/context/shared'),
        '@node_modules': path.resolve(__dirname, './node_modules'),
      },
    },
  };
});
