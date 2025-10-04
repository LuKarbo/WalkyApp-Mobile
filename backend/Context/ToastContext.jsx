import { createContext, useContext, useState } from 'react';
import Toast from '../../components/common/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success',
    });

    const showToast = (message, type = 'success') => {
        setToast({
            visible: true,
            message,
            type,
        });
    };

    const hideToast = () => {
        setToast({
            visible: false,
            message: '',
            type: 'success',
        });
    };

    const showSuccess = (message) => showToast(message, 'success');
    const showError = (message) => showToast(message, 'error');
    const showWarning = (message) => showToast(message, 'warning');

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning }}>
            {children}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe usarse dentro de ToastProvider');
    }
    return context;
};