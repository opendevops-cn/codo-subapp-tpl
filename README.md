# 子应用模板

本项目是一个子应用模板，用于快速开发和部署子应用。

## 项目目录结构

```
├── config                  # 项目配置文件
│   ├── config.ts           # 主配置文件
│   ├── defaultSettings.ts  # 默认设置
│   ├── proxy.ts            # 接口代理配置
│   └── routes.ts           # 路由配置
├── src
│   ├── components          # 公共组件
│   ├── pages               # 页面组件
│   │   └── table-list      # 表格列表页面示例
│   │       ├── index.tsx   # 页面入口
│   │       ├── service.ts  # 接口请求
│   │       └── data.d.ts   # 类型定义
│   ├── services            # 全局服务
│   ├── utils               # 工具函数和常量
│   ├── access.ts           # 权限控制
│   ├── global.tsx          # 全局样式和组件
│   └── requestErrorConfig.ts # 请求错误处理配置
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目说明
```

## 环境准备

Install `node_modules`:

```bash
npm install
```

## 开发子应用的通用步骤

1. **修改应用信息**
   - 在 `package.json` 中修改 `name` 字段为子应用名称
   - 在 `config/config.ts` 中配置应用标题和其他全局设置

2. **配置接口代理**
   - 在 `config/proxy.ts` 中写入接口代理配置，支持多个代理

3. **配置路由**
   - 在 `config/routes.ts` 中配置子应用的路由

4. **开发页面**
   - 在 `src/pages` 文件夹下创建页面组件
   - 每个页面目录下创建 `service.ts` 文件定义接口请求
   - 每个页面目录下创建 `data.d.ts` 文件定义类型

5. **添加工具函数**
   - 在 `src/utils` 文件夹下放置工具函数和常量

6. **创建公共组件**
   - 在 `src/components` 文件夹下创建可复用的公共组件

7. **配置请求错误处理**
   - 在 `src/requestErrorConfig.ts` 中配置请求拦截器和响应拦截器
   - 自定义错误处理逻辑，包括错误提示和认证失效处理

## 请求错误处理配置

`requestErrorConfig.ts` 文件提供了统一的请求错误处理机制，主要功能包括：

1. **错误类型定义**：
   - 通过 `ErrorShowType` 枚举定义不同的错误展示方式（静默、警告、错误消息、通知、重定向）

2. **请求拦截器**：
   - 自动为请求添加认证信息（auth-key、X-Xsrftoken 等）
   - 添加域名相关信息到请求头

3. **响应拦截器**：
   - 统一处理响应数据
   - 根据响应码显示对应的错误或提示信息

4. **错误处理**：
   - 处理业务错误（BizError）
   - 处理 HTTP 状态错误（如 401 未授权）
   - 处理网络请求错误

使用此配置可以简化应用中的错误处理逻辑，提供一致的用户体验。

## 常规操作

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## License

Everything is [MIT](http://opensource.org/licenses/MIT).
