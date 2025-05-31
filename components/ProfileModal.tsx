import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

// 定义组件的属性接口
interface ProfileModalProps {
    visible: boolean; // 控制模态框是否可见
    onClose: () => void; // 关闭模态框的回调函数
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
    // 创建一个共享值用于垂直平移动画，初始值设为1000（在屏幕下方）
    const translateY = useSharedValue(1000);
    // 用于存储定时器引用的ref
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (visible) {
            // 当模态框显示时，平滑动画到位置0（屏幕内）
            translateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.cubic),
            });
        }
        return () => {
            // 清理定时器，防止内存泄漏
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        }
    }, [visible]);

    // 手势处理器，用于处理滑动手势
    let startY = 0;
    const panGesture = Gesture.Pan()
        .onStart(() => {
            // 记录手势开始时的Y值
            startY = translateY.value;
        })
        .onUpdate((event) => {
            // 只允许向下滑动（增加Y值）
            if (event.translationY > 0) {
                translateY.value = startY + event.translationY;
            }
        })
        .onEnd((event) => {
            // 如果滑动距离超过100，关闭模态框
            if (event.translationY > 100) {
                // 添加关闭动画
                translateY.value = withTiming(1000, {
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                });
                runOnJS(onClose)(); // 在JS线程上执行关闭回调
            }
        });

    // 创建动画样式，将translateY应用到组件上
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    // 关闭模态框的处理函数
    const handleClose = () => {
        // 添加关闭动画
        translateY.value = withTiming(1000, {
            duration: 300,
            easing: Easing.in(Easing.cubic),
        });
        // 设置定时器，等待动画完成后再关闭模态框
        timer.current = setTimeout(() => {
            // 确保在动画结束后调用onClose
            runOnJS(onClose)();
        }, 300); // 等待动画完成后调用onClose
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none" // 不使用内置动画，我们用自定义动画
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.modalContent, animatedStyle]}>
                        {/* 顶部拖动指示器 */}
                        <View style={styles.dragIndicator} />
                        {/* 头部背景区域 */}
                        <View style={styles.headerBackground}>
                            <View style={styles.headerContent}>
                                <View style={styles.logoContainer}>
                                    <Text style={styles.logoText}>Gluon</Text>
                                </View>
                                <TouchableOpacity style={styles.moreButton} onPress={handleClose}>
                                    <Ionicons name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            {/* 存款人数信息 */}
                            <View style={styles.saversContainer}>
                                <Text style={styles.saversText}>12,510 Savers</Text>
                            </View>
                            {/* 利率信息 */}
                            <View style={styles.rateContainer}>
                                <Text style={styles.rateValue}>5.6%</Text>
                                <Text style={styles.rateSubtext}>p.a.</Text>
                            </View>
                            {/* 产品描述 */}
                            <Text style={styles.productDescription}>Super Savings - withdraw anytime</Text>
                            {/* 加入按钮区域 */}
                            <View style={styles.joinButtonContainer}>
                                <Text style={styles.productTitle}>Super Savings</Text>
                                <TouchableOpacity style={styles.joinButton}>
                                    <Text style={styles.joinButtonText}>JOIN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* 产品内容区域 */}
                        <View style={styles.productsSection}>
                            <View style={styles.productsHeader}>
                                <Text style={styles.productsTitle}>Featured Products</Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.productCardContainer}>
                                {/* 卡片 1 */}
                                <View style={styles.productCard}>
                                    <View style={[styles.productIconContainer, { backgroundColor: '#7fdfd4' }]}>
                                        <Ionicons name="wallet-outline" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productCardTitle}>Super Savings</Text>
                                        <Text style={styles.productCardDescription}>
                                            build savings overtime, withdraw anytime, low min. deposits
                                        </Text>
                                    </View>
                                    <View style={styles.rateTag}>
                                        <Text style={styles.rateTagText}>5.60% p.a.</Text>
                                    </View>
                                </View>

                                {/* 卡片 2 */}
                                <View style={styles.productCard}>
                                    <View style={[styles.productIconContainer, { backgroundColor: '#64b5ff' }]}>
                                        <Ionicons name="trending-up-outline" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productCardTitle}>Term Deposit</Text>
                                        <Text style={styles.productCardDescription}>
                                            locked in interest rate, 1 year fixed term
                                        </Text>
                                    </View>
                                    <View style={styles.rateTag}>
                                        <Text style={styles.rateTagText}>23% p.a.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    // 样式定义
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    headerBackground: {
        width: '100%',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#2952CC', // 蓝色背景
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    menuIconContainer: {
        padding: 5,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    moreButton: {
        padding: 5,
    },
    saversContainer: {
        marginBottom: 10,
    },
    saversText: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
    rateContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 5,
    },
    rateValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    rateSubtext: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 5,
    },
    productDescription: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
    },
    joinButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    joinButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinButtonText: {
        color: '#2952CC',
        fontWeight: 'bold',
    },
    productsSection: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    productsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    productsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        fontSize: 16,
        color: '#2952CC',
        fontWeight: '500',
    },
    productCardContainer: {
        marginTop: 5,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
        marginRight: 10,
    },
    productCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productCardDescription: {
        fontSize: 14,
        color: '#888',
        lineHeight: 19,
    },
    rateTag: {
        backgroundColor: '#e1f5fe',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    rateTagText: {
        fontSize: 14,
        color: '#01579b',
        fontWeight: 'bold',
    },
});
