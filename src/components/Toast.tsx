import { useState, useCallback } from 'react';

export interface ToastMessage {
    id: string;
    text: string;
    type: 'success' | 'error' | 'info';
}

export function ToastContainer({ messages, onRemove }: { messages: ToastMessage[], onRemove: (id: string) => void }) {
    return (
        <div className="toast-container">
            {messages.map(msg => (
                <div key={msg.id} className={`toast toast-${msg.type}`} onClick={() => onRemove(msg.id)}>
                    {msg.text}
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const showToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setMessages(prev => [...prev, { id, text, type }]);

        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    }, []);

    return { messages, showToast, removeToast };
}
