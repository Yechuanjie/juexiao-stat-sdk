## JueXiao Statistics SDK With JavaScript

#### 安装

```shell
// use npm
npm install juexiao-stat-sdk

// use yarn
yarn add juexiao-stat-sdk
```



注意：`sdk` 只支持 `web/h5` 和  `微信小程序` 环境使用，两种环境完全独立，使用 `es6 ` 的 `import` 语法按需引入不同环境对应的模块。

#### web/h5

##### 在Vue项目中使用：

main.js中引入

```javascript
import { BrowserStatSDK } from 'juexiao-stat-sdk'
const stat = new BrowserStatSDK()
// 全局注册
Vue.prototype.stat = stat
...
```

在需要埋点的地方使用，如index.vue

```javascript
...
methods: {
  btnClick() {
    stat.track(...)
  }
}
```
