

# 还在加紧适配中
# still work on adept vue3

# vue-fantable

[![license](https://img.shields.io/npm/l/vue-fantable.svg)](http://www.opensource.org/licenses/mit-license.php)

[English](./README-EN.md) | **中文**

> 如果我看的更远，那是因为我站在巨人的肩膀上。

## 介绍

本项目由 vue-easytable 更新而来，使用 rollup 替代 webpack 和 gulp，支持 Vue3

## 特点

- 采用虚拟滚动技术，支持 30 万行数据展示和实时编辑
- 永久开源免费。当然你也可以选择捐赠，保证项目长期维护和功能加速开发

## API & 文档

- [官方文档 (Github)]()
- [官方文档 (国内)]()

## 安装

确保 Vue 版本至少为 3.2

```
npm install vue-fantable
```

or

```
yarn add vue-fantable
```

## 使用

讲一下内容添加到 main.js:

```javascript
import {createApp} from "vue";
import "vue-easytable/libs/theme-default/index.css";
import App from './app.vue'
import VueEasytable from "vue-easytable";
const app = createApp(App)
app.use(VueEasytable);

app.mounted('#app')
```

示例:

```vue
<template>
  <ve-table :columns="columns" :table-data="tableData" />
</template>

<script>
  export default {
    data() {
      return {
        columns: [
          { field: "name", key: "a", title: "Name", align: "center" },
          { field: "date", key: "b", title: "Date", align: "left" },
          { field: "hobby", key: "c", title: "Hobby", align: "right" },
          { field: "address", key: "d", title: "Address" },
        ],
        tableData: [
          {
            name: "John",
            date: "1900-05-20",
            hobby: "coding and coding repeat",
            address: "No.1 Century Avenue, Shanghai",
          },
          {
            name: "Dickerson",
            date: "1910-06-20",
            hobby: "coding and coding repeat",
            address: "No.1 Century Avenue, Beijing",
          },
          {
            name: "Larsen",
            date: "2000-07-20",
            hobby: "coding and coding repeat",
            address: "No.1 Century Avenue, Chongqing",
          },
          {
            name: "Geneva",
            date: "2010-08-20",
            hobby: "coding and coding repeat",
            address: "No.1 Century Avenue, Xiamen",
          },
          {
            name: "Jami",
            date: "2020-09-20",
            hobby: "coding and coding repeat",
            address: "No.1 Century Avenue, Shenzhen",
          },
        ],
      };
    },
  };
</script>
```

## 功能支持

**其它基础组件**

- [Loading 组件加载状态]()
- [Pagination 分页组件]()
- [Contextmenu 右键菜单组件]()
- [Icon 图标组件]()
- [Locale 国际化组件]()

**Table 组件**

- [更轻量]()
- [国际化]()
- [主题定制 & 内置主题]()
- [虚拟滚动]()
- [自定义事件]()
- [更多](#更多功能支持)

## 开发计划

- [x] 保证项目可以打包构建
  - [x] 更新项目依赖
  - [x] 并且转移到 ESM，且 Vue2 调用时不会出错
  - [x] 可以打包 CSS、less 内容
  - [x] 移除其它包依赖，只依赖 vue
  - [x] 保证项目示例（文档）可以运行
  - [x] 更新示例为 vite，且使用 vue3，与此同时，更新 fan-table，保证 Vue3 可以使用
  - [x] 添加页面或者能运行该组件的内容
  - [ ] 使用 google font 替代 iconfont，避免版权风险
  - [ ] 多个实例之间数据可能没有进行隔离
  - [ ] 模块拆分，打包优化
  - [ ] 更新文档中使用 Vue 的方式，Vue3 没有默认导出，不能使用 import Vue from 'vue'
  - [ ] 尝试 unplugin-vue 替代 rollup-plugin-vue
- [ ] 重写 Loading 组件
- [ ] 异步加载模式，拆分为三步进行加载
- [ ] 性能优化，加上防抖和节流
- [ ] 之后加上 TS
  - [ ] 添加测试用例
- [ ] 最后支持原生（无框架依赖）

如果没有你想要的的功能，请告诉[我]()

## 支持环境

- 所有现代浏览器

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" /></br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Edge                                                         | last 2 versions                                              | last 2 versions                                              | last 2 versions                                              | last 2 versions                                              |

## 贡献者们

感谢 [easytable](https://github.com/Happy-Coding-Clans/vue-easytable) 原项目工作者们，以及维护者 [huangshuwei](https://github.com/Happy-Coding-Clans) 🙏，本项目继承自 vue-easytable@2.27.1。

### 如何贡献

- 点击 :star: 让更多的人了解到我们
- 如果你希望参与贡献，欢迎 Pull Request

## 讨论组

- [加入 gitter 讨论](https://gitter.im/vue-easytable/community)
- [加入 discord 讨论](https://discord.gg/gBm3k6r)

## License

http://www.opensource.org/licenses/mit-license.php

### 更多功能支持

- [国际化]()
- [主题定制 & 内置主题]()
- [虚拟滚动]()
- [自定义事件]()
- [列隐藏]()
- [表头固定]()
- [表头分组]()
- [筛选]()
- [排序]()
- [列宽拖动]()
- [单元格样式]()
- [单元格自定义]()
- [单元格合并]()
- [单元格选择（键盘操作）]()
- [单元格自动填充]()
- [单元格编辑]()
- [剪贴板]()
- [右键菜单]()
- [单元格省略]()
- [行单选]()
- [行多选]()
- [行展开]()
- [行样式]()
- [footer 汇总]()
