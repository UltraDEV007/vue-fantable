import less from 'rollup-plugin-less'
import vuePlugin from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import sucrase from '@rollup/plugin-sucrase'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
// console.log(__dirname);
// import { jsxExtension } from './common.js'
// 打包前清除所有文件
// 添加 CSS

const libConfig = defineConfig({
  clean: true,
  sourcemap: 'inline',
  input: 'packages/index.js',
  external: ['vue'],
  output: [{
    format: 'es',
    // entryFileNames: 'entry-[name].js',
    dir: './dist',
    entryFileNames: `node/[name].js`,
    chunkFileNames: 'node/chunks/dep-[hash].js',
    exports: 'named',
    plugins: [terser()],
    manualChunks: []
  }],
  plugins: [
    vuePlugin({
      target: 'broswer'
    }),
    less({
      output: 'dist/css/index.dist.css'
    }),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['jsx']
    }),
    alias({
      entries: [
        // { find: 'packages/', replacement: '@/' },
        { find: '@P/', replacement: __dirname + '/packages/' },
        { find: '@U/', replacement: __dirname + '/packages/utils/' },
      ]
    }),
    // 让 Rollup 查找到外部模块，打包到产物内
    resolve({
      // 将自定义选项传递给解析插件
      moduleDirectories: ['node_modules']
    })
  ],
})
export default () => {
  return defineConfig([
    libConfig
  ])
}

// 如果打包时间过长，添加缓存功能
//