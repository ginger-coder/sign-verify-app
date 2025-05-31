import 'react-native-get-random-values'; // 确保移动端随机数生成兼容
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import SignScreen from './components/SignScreen';
import VerifyScreen from './components/VerifyScreen';
import ProfileModal from './components/ProfileModal';
import { AppProvider } from './store/StateContext'; // 导入 Context 提供者
import { THEME } from './styles/theme';

// 主应用程序组件
// 管理屏幕切换和个人资料模态框，状态由 Context 管理
export default function App() {
  const [screen, setScreen] = useState('sign'); // 当前屏幕状态（sign 或 verify）
  const [modalVisible, setModalVisible] = useState(false); // 模态框可见性

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar barStyle="dark-content" backgroundColor={THEME.surface} />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>数字签名工具</Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, screen === 'sign' && styles.activeTab]}
              onPress={() => setScreen('sign')}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={screen === 'sign' ? THEME.primary : THEME.textSecondary}
              />
              <Text style={[styles.tabText, screen === 'sign' && styles.activeTabText]}>
                签名
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, screen === 'verify' && styles.activeTab]}
              onPress={() => setScreen('verify')}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={screen === 'verify' ? THEME.primary : THEME.textSecondary}
              />
              <Text style={[styles.tabText, screen === 'verify' && styles.activeTabText]}>
                验证
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {screen === 'sign' ? (
              <SignScreen />
            ) : (
              <VerifyScreen />
            )}
          </View>
          <ProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </SafeAreaView>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textPrimary,
  },
  profileButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: THEME.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: THEME.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});