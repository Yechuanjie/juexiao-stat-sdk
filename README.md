### JueXiao Statistics SDK With JavaScript

##### 框架使用 semantic-release 管理 npm 包版本

对于每次更改，使用 `commitlint` 限制，只有当 `git` 提交的 `commit message` 满足`xxx: xxxx`格式，并且推送到 `master` 分支时才会触发 `npm publish`。

如：

```shell
git commit -m 'fix: fix a bug'
```

`npm publish` 默认从 `1.0.0` 开始，当发布成功后，可在 `npm` 官网查看最新版本，并且 `GitHub` 仓库的 `Releases` 板块也会更新历史版本信息。
