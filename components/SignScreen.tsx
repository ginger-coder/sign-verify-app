import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { generateKeyPair, hashMessage, signMessage as signMessageUtil, uint8ToBase64 } from '../utils/CryptoUtils';
import { useAppContext } from '../store/StateContext';
import { THEME, commonStyles } from '../styles/theme';

export default function SignScreen() {
    const { state, dispatch } = useAppContext();
    const { signMessage, hash, signature, publicKey } = state;

    const handleHashAndSign = async () => {
        if (!signMessage) {
            Alert.alert('请输入需要签名的消息内容');
            return;
        }
        try {
            const { privateKey, publicKey: pubKey } = generateKeyPair();
            const messageHash = await hashMessage(signMessage);
            const sig = signMessageUtil(signMessage, privateKey);
            dispatch({ type: 'SET_HASH', payload: messageHash });
            dispatch({ type: 'SET_SIGNATURE', payload: uint8ToBase64(sig) });
            dispatch({ type: 'SET_PUBLIC_KEY', payload: uint8ToBase64(pubKey) });
        } catch (error) {
            Alert.alert((error as Error).message);
        }
    };

    const copyPublicKey = async () => {
        if (!publicKey) {
            Alert.alert('公钥未生成');
            return;
        }
        await Clipboard.setStringAsync(publicKey);
        console.log('公钥已复制到剪贴板');
    };

    const copySignature = async () => {
        if (!signature) {
            Alert.alert('签名未生成');
            return;
        }
        await Clipboard.setStringAsync(signature);
        console.log('签名已复制到剪贴板');
    };

    const copyHash = async () => {
        if (!hash) {
            Alert.alert('哈希未生成');
            return;
        }
        await Clipboard.setStringAsync(hash);
        console.log('哈希已复制到剪贴板');
    };

    const clearAll = () => {
        dispatch({ type: 'SET_SIGN_MESSAGE', payload: '' });
        dispatch({ type: 'SET_HASH', payload: '' });
        dispatch({ type: 'SET_SIGNATURE', payload: '' });
        dispatch({ type: 'SET_PUBLIC_KEY', payload: '' });
    };

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>数字签名生成</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>消息内容</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="输入需要签名的消息内容"
                            value={signMessage}
                            onChangeText={(text) => dispatch({ type: 'SET_SIGN_MESSAGE', payload: text })}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.signButton} onPress={handleHashAndSign}>
                            <Ionicons name="create-outline" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>生成签名</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
                            <Text style={styles.clearButtonText}>清除</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.resultsContainer}>
                        {hash ? (
                            <View style={styles.resultSection}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.resultLabel}>哈希 (SHA-256)</Text>
                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={copyHash}
                                        testID="copy-hash-button"
                                    >
                                        <Ionicons name="copy-outline" size={18} color={THEME.primary} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.resultContent}>
                                    <Text style={styles.resultText} numberOfLines={2} ellipsizeMode="middle">
                                        {hash}
                                    </Text>
                                </View>
                            </View>
                        ) : <></>}
                        {publicKey ? (
                            <View style={styles.resultSection}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.resultLabel}>公钥 (base64)</Text>
                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={copyPublicKey}
                                        testID="copy-publickey-button"
                                    >
                                        <Ionicons name="copy-outline" size={18} color={THEME.primary} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.resultContent}>
                                    <Text style={styles.resultText} numberOfLines={2} ellipsizeMode="middle">
                                        {publicKey}
                                    </Text>
                                </View>
                            </View>
                        ) : <></>}
                        {signature ? (
                            <View style={styles.resultSection}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.resultLabel}>签名 (base64)</Text>
                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={copySignature}
                                        testID="copy-signature-button"
                                    >
                                        <Ionicons name="copy-outline" size={18} color={THEME.primary} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.resultContent}>
                                    <Text style={styles.resultText} numberOfLines={2} ellipsizeMode="middle">
                                        {signature}
                                    </Text>
                                </View>
                            </View>
                        ) : <></>}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    signButton: {
        ...THEME.buttonPrimary,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonIcon: {
        marginRight: 6,
    },
    clearButton: {
        ...THEME.buttonSecondary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: commonStyles.buttonText,
    clearButtonText: {
        color: THEME.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
    resultsContainer: {
        marginTop: 10,
    },
    resultSection: {
        backgroundColor: `${THEME.primary}10`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: THEME.textSecondary,
    },
    copyButton: {
        padding: 4,
    },
    resultContent: {
        backgroundColor: THEME.surface,
        borderRadius: 6,
        padding: 10,
    },
    resultText: {
        fontSize: 14,
        color: THEME.textPrimary,
        fontFamily: 'monospace',
    },
});