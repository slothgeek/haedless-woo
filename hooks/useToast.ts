import { useState, useCallback } from 'react';
import { addToast } from '@heroui/react';

interface Toast {
    type: 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary' | 'danger';
    message: string;
}

export const useToast = () => {
    const [toast, setToast] = useState<Toast | null>(null);


    const showToast = useCallback(({ type, message }: Toast) => {
        setToast({ type, message });
        addToast({
            description: message,
            color: type,
        });
    }, []);

    return {
        toast,
        showToast,
    };
}; 