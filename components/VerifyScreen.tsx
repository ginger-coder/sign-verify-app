import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { verifySignature as verifySignatureUtil, base64ToUint8 } from '../utils/CryptoUtils';
import { useAppContext } from '../store/StateContext';
import { Ionicons } from '@expo/vector-icons';
import { THEME, commonStyles } from '../styles/theme';

// 验证屏幕组件
export default function VerifyScreen() {
    const { state, dispatch } = useAppContext();
    const { verifyMessage, verifyPublicKey, verifySignature, verifyResult } = state;

    // 处理"验证"按钮点击
    const handleVerify = async () => {
        if (!verifyMessage || !verifyPublicKey || !verifySignature) {
            Alert.alert('请确保所有字段都已填写');
            return;
        }
        try {
            const pubKeyBytes = base64ToUint8(verifyPublicKey);
            const sigBytes = base64ToUint8(verifySignature);
            const isValid = verifySignatureUtil(verifyMessage, sigBytes, pubKeyBytes);
            dispatch({ type: 'SET_VERIFY_RESULT', payload: isValid ? '有效' : '无效' });
        } catch (error) {
            Alert.alert('提示', (error as Error).message);
        }
    };

    // 从剪贴板粘贴公钥
    const pastePublicKey = async () => {
        try {
            const text = await Clipboard.getStringAsync();
            if (text) {
                dispatch({ type: 'SET_VERIFY_PUBLIC_KEY', payload: text });
            } else {
                Alert.alert('提示', '剪贴板为空');
            }
        } catch (error) {
            Alert.alert('提示', '粘贴公钥失败');
        }
    };

    // 从剪贴板粘贴签名
    const pasteSignature = async () => {
        try {
            const text = await Clipboard.getStringAsync();
            if (text) {
                dispatch({ type: 'SET_VERIFY_SIGNATURE', payload: text });
            } else {
                Alert.alert('提示', '剪贴板为空');
            }
        } catch (error) {
            Alert.alert('提示', '粘贴签名失败');
        }
    };

    // 清除所有输入字段
    const clearAll = () => {
        dispatch({ type: 'SET_VERIFY_MESSAGE', payload: '' });
        dispatch({ type: 'SET_VERIFY_PUBLIC_KEY', payload: '' });
        dispatch({ type: 'SET_VERIFY_SIGNATURE', payload: '' });
        dispatch({ type: 'SET_VERIFY_RESULT', payload: '' });
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>数字签名验证</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>消息内容</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="输入需要验证的消息内容"
                            value={verifyMessage}
                            onChangeText={(text) => dispatch({ type: 'SET_VERIFY_MESSAGE', payload: text })}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#999"
                            testID="verify-message-input"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>公钥 (base64)</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="输入或粘贴公钥"
                                value={verifyPublicKey}
                                onChangeText={(text) => dispatch({ type: 'SET_VERIFY_PUBLIC_KEY', payload: text })}
                                placeholderTextColor="#999"
                                testID="verify-publickey-input"
                            />
                            <TouchableOpacity 
                                style={styles.iconButton} 
                                onPress={pastePublicKey}
                                testID="paste-publickey-button"
                            >
                                <Ionicons name="clipboard-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>签名 (base64)</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="输入或粘贴签名"
                                value={verifySignature}
                                onChangeText={(text) => dispatch({ type: 'SET_VERIFY_SIGNATURE', payload: text })}
                                placeholderTextColor="#999"
                                testID="verify-signature-input"
                            />
                            <TouchableOpacity 
                                style={styles.iconButton} 
                                onPress={pasteSignature}
                                testID="paste-signature-button"
                            >
                                <Ionicons name="clipboard-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.verifyButton} 
                            onPress={handleVerify}
                            testID="verify-button"
                        >
                            <Text style={styles.buttonText}>验证签名</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.clearButton} 
                            onPress={clearAll}
                            testID="clear-button"
                        >
                            <Text style={styles.clearButtonText}>清除</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {verifyResult ? (
                            <View 
                                style={[
                                    styles.resultContainer,
                                    verifyResult === '有效' ? styles.validContainer : styles.invalidContainer
                                ]}
                                testID="verify-result-container"
                            >
                                <Ionicons
                                    name={verifyResult === '有效' ? "checkmark-circle" : "close-circle"}
                                    size={24}
                                    color={verifyResult === '有效' ? THEME.success : THEME.error}
                                />
                                <Text style={[
                                    styles.resultText,
                                    verifyResult === '有效' ? styles.validText : styles.invalidText
                                ]}>
                                    签名{verifyResult}
                                </Text>
                            </View>
                        ) : <></>}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

// 样式定义
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: THEME.card,
    title: commonStyles.title,
    inputGroup: {
        marginBottom: 20,
    },
    label: commonStyles.label,
    textArea: commonStyles.textArea,
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: THEME.input,
    iconButton: commonStyles.iconButton,
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    verifyButton: {
        ...THEME.buttonPrimary as any,
        flex: 3,
        marginRight: 10,
    },
    clearButton: {
        ...THEME.buttonSecondary as any,
        flex: 1,
    },
    buttonText: commonStyles.buttonText,
    clearButtonText: {
        color: THEME.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    validContainer: {
        backgroundColor: `${THEME.success}20`, // 添加透明度
    },
    invalidContainer: {
        backgroundColor: `${THEME.error}20`, // 添加透明度
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    validText: {
        color: THEME.success,
    },
    invalidText: {
        color: THEME.error,
    },
});