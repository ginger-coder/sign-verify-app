# 签名与验证应用

一个使用TweetNaCl进行加密签名和验证的React Native应用程序。

## 前提条件

在开始之前，请确保安装了以下内容：

- [Node.js](https://nodejs.org/) 23+ 版本
- [Expo CLI](https://docs.expo.dev/get-started/installation/) 0.24+ 版本
- [Yarn](https://yarnpkg.com/) 1.22+ 版本或[npm](https://www.npmjs.com/) 10+ 版本
- 对于移动端开发：
  - 下载Expo Go应用，真机可直接扫控制台二维码
  - iOS：[Xcode](https://developer.apple.com/xcode/) 14.0+ 版本（仅限Mac），iOS模拟器 15.0+ 版本
  - Android：[Android Studio](https://developer.android.com/studio) Android模拟器 Google APIs ARM 64 v8a System Image，Android模拟器 API 35 (Android 15) 版本

## 安装

克隆仓库并安装依赖：

```bash
# 克隆仓库
git clone <https://github.com/ginger-coder/sign-verify-app.git
cd sign-verify-app

# 安装依赖
yarn install
# 或
npm install
```

## 开发服务器

启动开发服务器：

```bash
# 启动Expo开发服务器
yarn start
# 或
npm start
```

这将在浏览器中打开Expo开发者工具，您可以选择在以下环境运行应用：
- Web浏览器
- iOS模拟器/设备
- Android模拟器/设备

## 平台特定开发

### Web端

在Web浏览器中运行应用：

```bash
yarn web
# 或
npm run web
```

### iOS端

在iOS模拟器或设备上运行应用（需要Mac）：

```bash
yarn ios
# 或
npm run ios
```

### Android端

在Android模拟器或设备上运行应用：

```bash
yarn android
# 或
npm run android
```

## 生产环境构建

### Web部署

构建用于Web部署的应用：

```bash
yarn build:web
# 或
npm run build:web
```

这将在`web-build`目录中生成生产就绪的静态文件。

### Android构建

构建Android APK：

```bash
yarn build:android
# 或
npm run build:android
```

### iOS构建

构建iOS应用：

```bash
yarn build:ios
# 或
npm run build:ios
```

## 测试

使用Jest运行测试：

```bash
yarn test
# 或
npm test
```

这将运行所有测试并生成覆盖率报告。

## 项目结构

```
sign-verify-app/
├── assets/           # 图片、字体和其他静态资源
├── components/       # 可复用的React组件
├── screens/          # 应用屏幕
├── store/            # 状态存储
├── utils/            # 实用工具函数
├── App.tsx           # 主应用组件
└── index.ts          # 入口点
```

## 使用的技术

- [React Native](https://reactnative.dev/) - 跨平台移动应用开发框架
- [Expo](https://expo.dev/) - React Native工具集
- [TweetNaCl](https://github.com/dchest/tweetnacl-js) - 加密库
- [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/) - 加密原语

## 许可证

[MIT](LICENSE)
