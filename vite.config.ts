import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    plugins: [react()],
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
          passes: 2
        },
        mangle: {
          safari10: true,
          keep_fnames: false,
          reserved: ['$', 'exports', 'require']
        },
        format: {
          comments: false,
          ascii_only: true
        }
      },
      rollupOptions: {
        plugins: [
          ...(isProduction ? [
            obfuscatorPlugin({
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.75,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.4,
              debugProtection: false,
              debugProtectionInterval: 0,
              disableConsoleOutput: true,
              identifierNamesGenerator: 'hexadecimal',
              log: false,
              numbersToExpressions: true,
              renameGlobals: false,
              selfDefending: true,
              simplify: true,
              splitStrings: true,
              splitStringsChunkLength: 10,
              stringArray: true,
              stringArrayCallsTransform: true,
              stringArrayEncoding: ['base64'],
              stringArrayIndexShift: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayWrappersCount: 2,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersParametersMaxCount: 4,
              stringArrayWrappersType: 'function',
              stringArrayThreshold: 0.75,
              transformObjectKeys: true,
              unicodeEscapeSequence: false,
              reservedNames: [
                '^React',
                '^ReactDOM',
                '^__vite',
                '^import',
                '^export',
                '^require',
                '^module',
                '^global',
                '^window',
                '^document'
              ]
            })
          ] : [])
        ],
        external: [
           'chart.js/auto', 
           'quill'
         ],
        output: {
          manualChunks: {
            // React Core
            'react-vendor': ['react', 'react-dom'],
            
            // UI Libraries
             'ui-vendor': [
               'rsuite',
               '@rsuite/icons',
               '@rsuite/interactions'
             ],
            
            // Icons
            'icons-vendor': [
              '@fortawesome/react-fontawesome',
              '@fortawesome/fontawesome-svg-core',
              '@fortawesome/free-solid-svg-icons',
              '@fortawesome/free-regular-svg-icons',
              '@fortawesome/free-brands-svg-icons',
              'lucide-react'
            ],
            
            // State Management & Routing
            'state-vendor': [
              '@reduxjs/toolkit',
              'react-redux',
              'redux',
              'react-router-dom'
            ],
            
            // Animation Libraries
            'animation-vendor': [
              'framer-motion',
              'gsap',
              'react-transition-group'
            ],
            
            // 3D Libraries
            'three-vendor': [
              'three',
              '@react-three/fiber',
              '@react-three/drei'
            ],
            
            // Form & Validation
            'form-vendor': [
              'formik',
              'yup'
            ],
            
            // Utilities
            'utils-vendor': [
              'crypto-js',
              'buffer',
              'react-helmet',
              'react-responsive',
              'react-scroll',
              'sweetalert2',
              'sonner',
              'ldrs'
            ],
            
            // External Services
             'services-vendor': [
               '@supabase/supabase-js',
               'react-turnstile'
             ]
          }
        },
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
