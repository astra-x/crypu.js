crypu.js
=====================
一个完全由 JavaScript/Typescript 实现的轻便，高性能区块链工具库，未来将支持多条区块链，现已支持 FISCO-BCOS 和以太坊网络。

**功能特性：**

- **私钥存储于客户端**，保证私钥安全无虞
- **支持使用私钥或助记词创建钱包**，更加人性化
- **使用 JSON-RPC 方式**连接 FISCO-BCOS 网络和以太坊网络。
- **轻量级**，最小化后的 JS 文件不足 400KB，可适用于前端工程
- **支持微信小程序**
- **Monorepo 工程结构**，模块化包管理，只使用你需要的功能
- **Rollup 模块捆绑**，将复杂的 Monorepo 项目捆绑为单个复杂的 JS 文件
- **Admin 指令集**，控制项目的编译和打包流程，特别感谢 @ethersproject
- **完整支持**所有可能用到的区块链API
- **人性化的文档**
- **全面测试，持续更新**
- **全面支持 TypeScript**，由 TypeScript 原生构建
- **MIT 开源协议**，自由开放，共同进步

安装
=======================

**Node.js**
```Shell
> npm install --save crypu
```

**UMD(浏览器)**
```HTML
<script src="./crypu.umd.min.js" type="text/javascript">
</script>
```

**ESM(浏览器)**
```HTML
<script type="module">
    import { Wallet } from "./crypu.esm.min.js";
</script>
```

**微信小程序**
```JavaScript
const fisco = require("./crypu.wechat.min.js").default;
```

文档
========================

更详细的文档 [移步这里](https://www.yuque.com/docs/share/98dfdf1f-7074-4ac0-847e-6a907dfefe3d)。

单页文档包含全部内容，便于查找。文档由**语雀**提供托管服务。

开源协议
========================

MIT License (including all dependencies).