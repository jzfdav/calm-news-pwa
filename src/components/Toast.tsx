import { useState, useCallback } from 'react';

export interface ToastMessage {
    id: string;
    text: string;
    type: 'success' | 'error' | 'info';
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function ToastContainer({ messages, onRemove }: { messages: ToastMessage[], onRemove: (id: string) => void }) {
    return (
        <div className="toast-container">
            {messages.map(msg => (
                <div key={msg.id} className={`toast toast-${msg.type}`}>
                    <span className="toast-text" onClick={() => onRemove(msg.id)}>{msg.text}</span>
                    {msg.action && (
                        <button
                            className="toast-action-btn"
                            onClick={() => { msg.action?.onClick(); onRemove(msg.id); }}
                        >
                            {msg.action.label}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const showToast = useCallback((text: string, type: ToastMessage['type'] = 'success', action?: ToastMessage['action']) => {
        const id = Math.random().toString(36).substring(7);
        setMessages(prev => [...prev, { id, text, type, action }]);

        // Don't auto-dismiss if there's an action, or use a longer timeout?
        // Let's use 6 seconds for actions, 3 for regular.
        const timeout = action ? 6000 : 3000;

        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== id));
        }, timeout);
    }, []);

    const removeToast = useCallback((id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    }, []);

    return { messages, showToast, removeToast };
}
