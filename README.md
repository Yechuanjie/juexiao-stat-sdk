## JueXiao Statistics SDK With JavaScript

### 安装

```shell
// use npm
npm install juexiao-stat-sdk

// use yarn
yarn add juexiao-stat-sdk
```

注意：`sdk` 只支持 `web/h5` 和  `微信小程序` 环境使用，两种环境完全独立。该 `sdk `以 `umd` 格式打包，同时支持  `import ` 和 `require` 导入，推荐使用 `es6` 的 `import` 语法按需引入不同环境对应的模块。

`sdk` 包含两个模块： `BrowserStatSDK `和  `MiniStatSDK`， 其中，`BrowserStatSDK `只适用于 `web/h5` 环境，`MiniStatSDK` 只适用于微信小程序环境。使用时请注意区分

### 在项目中使用

以  `Vue` 项目为例：

`main.js` 中引入

```javascript
import { BrowserStatSDK } from 'juexiao-stat-sdk'
const stat = new BrowserStatSDK({
  id: 'test-id' // 这里填写每个项目分配的 project_id
})
// 全局注册
Vue.prototype.$stat = stat
...
```

在需要埋点的地方使用，如 `index.vue`

```javascript
...
methods: {
  btnClick() {
    this.$stat.track('btn-click')
    // 或者传入当前事件需要的一些自定义属性
    this.$stat.track('btn-click', {
      ...
    })
  }
}
```

以微信小程序为例：

在入口文件 app.js 中引入，

```javascript
import { MiniStatSDK } from 'juexiao-stat-sdk'
const stat = new MiniStatSDK ({
  id: 'test-id' // 这里填写每个项目分配的 project_id
})
wx.$stat= stat
```

在需要埋点的地方使用，如首页下的 `index.js` 文件

```javascript
...
methods: {
  btnClick() {
    wx.$stat.track('btn-click')
    // 或者传入当前事件需要的一些自定义属性
    wx.$stat.track('btn-click', {
      ...
    })
  }
}
```

### **API**

为了保证数据准确性，当用户 **登录** 成功后，必须调用 `login` 方法，主动更新用户 `id`

```javascript
stat.login('loginid')
```

为了保证数据准确性，当用户 **注册** 成功后，必须调用 `trackSignUp` 方法，用于绑定登录  `id`和匿名 `id` 之间的操作

```javascript
stat.trackSignUp(&#39;loginid&#39;)
```

常规数据上报

```javascript
stat.track('eventname', {
    // 当前事件需要的一些自定义属性
})
```

用户可以主动设置预置属性，已存在的字段则覆盖，不存在则自动创建

```javascript
stat.profileSet({
    sex: '男'
    age: '18'
})
```

用户可以主动设置预置属性，与 `profileSet `不同的是，如果被设置的用户属性已存在，则这条记录会被忽略，如果属性不存在则会自动创建

```javascript
stat.profileSetOnce({
    sex: &#39;男&#39;
    age: &#39;18&#39;
})
```

### 差异API

微信小程序中，默认情况下使用 `UUID` 作为用户标识，但删除小程序的操作，会导致UUID改变，因此，为了数据的准确性，建议获取并使用 `openid`。

`sdk `在微信小程序版本中 提供了一个差异 `API`，即 `setOpenid`，调用之后，会将 `UUID`替换为 `openid` 的值，在用户未登录的情况下，后续上报都会采用 `openid `的值。

```javascript
stat.setOpenid('openid')
```
