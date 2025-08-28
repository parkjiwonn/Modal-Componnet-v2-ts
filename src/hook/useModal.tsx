import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Modal from "../components/common/Modal";

interface ModalOptions {
    enableOutsideClick?: boolean;
    enableKeyboardShortcuts?: boolean;
    showCancelButton?: boolean;
    [key: string]: any;
}

interface ModalState {
    isOpen: boolean;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    options: ModalOptions;
}

interface ModalContextType {
    confirm: (message: string, options?: ModalOptions) => Promise<boolean>;
    alert: (message: string) => Promise<boolean>;
}

interface ModalProviderProps {
    children: ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        message: '',
        onConfirm: null,
        onCancel: null,
        options: {}
    });

    const showModal = useCallback(async (message: string, options: ModalOptions = {}): Promise<boolean> => {
        const {
            enableOutsideClick = true,
            enableKeyboardShortcuts = true,
            showCancelButton = true,
            ...otherOptions
        } = options;

        return new Promise<boolean>((resolve) => {
            setModalState({
                isOpen: true,
                message,
                onConfirm: () => {
                    setModalState({
                        isOpen: false,
                        message: '',
                        onConfirm: null,
                        onCancel: null,
                        options: {}
                    });
                    resolve(true);
                },
                onCancel: () => {
                    setModalState({
                        isOpen: false,
                        message: '',
                        onConfirm: null,
                        onCancel: null,
                        options: {}
                    });
                    resolve(false);
                },
                options: {
                    enableOutsideClick,
                    enableKeyboardShortcuts,
                    showCancelButton,
                    ...otherOptions
                }
            });
        });
    }, []);

    return (
        <ModalContext.Provider value={{ 
            confirm: showModal,
            alert: (message: string) => showModal(message, { showCancelButton: false })
        }}>
            {children}
            <Modal {...modalState} {...modalState.options} />
        </ModalContext.Provider>
    );
};
