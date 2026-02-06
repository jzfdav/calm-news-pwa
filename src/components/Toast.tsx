import { Button } from '@/components/ui/button';
import { type ToastMessage } from './useToast';

export function ToastContainer({ messages, onRemove }: { messages: ToastMessage[], onRemove: (id: string) => void }) {
    return (
        <div className="toast-container">
            {messages.map(msg => (
                <div key={msg.id} className={`toast toast-${msg.type}`}>
                    <span className="toast-text" onClick={() => onRemove(msg.id)}>{msg.text}</span>
                    {msg.action && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="uppercase tracking-widest text-xs font-bold"
                            onClick={() => { msg.action?.onClick(); onRemove(msg.id); }}
                        >
                            {msg.action.label}
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}


