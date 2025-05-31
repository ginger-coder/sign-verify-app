module.exports = {
    preset: 'jest-expo', // 使用 Expo 的 Jest 预设，适配 React Native
    transformIgnorePatterns: [ // 忽略 node_modules 中的模块，但不忽略 Expo 相关包
        'node_modules/(?!((jest-)?react-native(-reanimated)?|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-native-.*|@react-navigation/.*|react-native-gesture-handler)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "utils/**/*.{ts,tsx,js,jsx}", // 只收集 utils 文件夹下的文件
        "!**/coverage/**",
        "!**/node_modules/**"
    ]
};