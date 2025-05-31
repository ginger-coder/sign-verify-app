import { StyleSheet } from 'react-native';

// Define shadow style separately
const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
};

// 主题样式定义
export const THEME = {
    primary: '#4169E1',
    secondary: '#6c757d',
    success: '#28a745',
    error: '#dc3545',
    background: '#f8f9fa',
    surface: '#ffffff',
    border: '#dee2e6',
    cardShadow: '#00000029',
    shadow: shadowStyle,
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        ...shadowStyle,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    buttonPrimary: {
        backgroundColor: '#4169E1',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    buttonSecondary: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    textPrimary: '#333333',
    textSecondary: '#6c757d',
};


export const commonStyles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: THEME.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: THEME.textPrimary,
    },
    textArea: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    iconButton: {
        backgroundColor: THEME.primary,
        padding: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
});