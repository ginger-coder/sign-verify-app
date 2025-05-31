import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';

// 定义密钥对类型
interface KeyPair {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

// 定义状态类型
interface AppState {
    keyPair: KeyPair | null;
    signMessage: string;
    hash: string;
    signature: string;
    publicKey: string;
    verifyMessage: string;
    verifyPublicKey: string;
    verifySignature: string;
    verifyResult: string;
}

// 定义动作类型
type Action =
    | { type: 'SET_KEY_PAIR'; payload: KeyPair | null }
    | { type: 'SET_SIGN_MESSAGE'; payload: string }
    | { type: 'SET_HASH'; payload: string }
    | { type: 'SET_SIGNATURE'; payload: string }
    | { type: 'SET_PUBLIC_KEY'; payload: string }
    | { type: 'SET_VERIFY_MESSAGE'; payload: string }
    | { type: 'SET_VERIFY_PUBLIC_KEY'; payload: string }
    | { type: 'SET_VERIFY_SIGNATURE'; payload: string }
    | { type: 'SET_VERIFY_RESULT'; payload: string };

// 初始状态
const initialState: AppState = {
    keyPair: null,
    signMessage: '',
    hash: '',
    signature: '',
    publicKey: '',
    verifyMessage: '',
    verifyPublicKey: '',
    verifySignature: '',
    verifyResult: '',
};

// Reducer 函数
function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_KEY_PAIR':
            return { ...state, keyPair: action.payload };
        case 'SET_SIGN_MESSAGE':
            return { ...state, signMessage: action.payload };
        case 'SET_HASH':
            return { ...state, hash: action.payload };
        case 'SET_SIGNATURE':
            return { ...state, signature: action.payload };
        case 'SET_PUBLIC_KEY':
            return { ...state, publicKey: action.payload };
        case 'SET_VERIFY_MESSAGE':
            return { ...state, verifyMessage: action.payload };
        case 'SET_VERIFY_PUBLIC_KEY':
            return { ...state, verifyPublicKey: action.payload };
        case 'SET_VERIFY_SIGNATURE':
            return { ...state, verifySignature: action.payload };
        case 'SET_VERIFY_RESULT':
            return { ...state, verifyResult: action.payload };
        default:
            return state;
    }
}

// 定义 Context 类型
interface AppContextType {
    state: AppState;
    dispatch: Dispatch<Action>;
}

// 创建 Context，确保默认值为 undefined
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider 组件
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const value: AppContextType = { state, dispatch }; // 显式声明类型

    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    );
}

// 自定义 Hook 用于访问 Context
export function useAppContext() {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext 必须在 AppProvider 内使用');
    }
    return context;
}