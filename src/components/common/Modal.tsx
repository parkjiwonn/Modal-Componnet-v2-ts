// src/components/modal/Modal.tsx
import React, { useRef, useEffect } from 'react';
import { useOutsideClick } from 'hook/useOutsideClick';
import { keyPress } from 'utils/keyPress';
import Button from './Button';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  enableOutsideClick?: boolean;
  enableKeyboardShortcuts?: boolean;
  showCancelButton?: boolean;
  lockScroll?: boolean;              // 추가: 열림 시 스크롤 잠금
  loadingConfirm?: boolean;          // 추가: 확인 버튼 로딩 상태
  title?: string;                    // 추가: 커스텀 타이틀
}

function Modal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  enableOutsideClick = true,
  enableKeyboardShortcuts = true,
  showCancelButton = true,
  lockScroll = true,
  loadingConfirm = false,
  title = '알림',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // 외부 클릭
  const registerOutsideClick = useOutsideClick(() => {
    if (enableOutsideClick && onCancel) onCancel();
  });

  // 키보드
  const handleKeyPress = keyPress(
    {
      onEscape: () => { if (enableKeyboardShortcuts && onCancel) onCancel(); },
      onEnter: () => { if (enableKeyboardShortcuts && onConfirm) onConfirm(); },
    },
    { preventDefault: ['Escape', 'Enter'] }
  );

  // 외부 클릭 등록/해제
  useEffect(() => {
    if (panelRef.current && isOpen) {
      return registerOutsideClick(panelRef.current);
    }
  }, [registerOutsideClick, isOpen]);

  // 키보드 등록/해제
  useEffect(() => {
    if (isOpen && enableKeyboardShortcuts) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, handleKeyPress, enableKeyboardShortcuts]);

  // 포커스
  useEffect(() => {
    if (isOpen && panelRef.current) panelRef.current.focus();
  }, [isOpen]);

  // 스크롤 잠금
  useEffect(() => {
    if (!lockScroll) return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen, lockScroll]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal={true}
        aria-labelledby="modal-title"
      >
        <header className={styles.header}>
          <h3 id="modal-title" className={styles.title}>{title}</h3>
          {enableKeyboardShortcuts && (
            <div className={styles.shortcuts}>
              <small>ESC: 취소 | Enter: 확인</small>
            </div>
          )}
        </header>
  
        <section className={styles.body}>
          <p>{message}</p>
        </section>
  
        <footer className={styles.actions}>
          <Button
            variant="confirm"
            state={loadingConfirm ? 'loading' : undefined}
            onClick={loadingConfirm ? undefined : (onConfirm ?? undefined)}
            autoFocus
            disabled={loadingConfirm}
          >
            {loadingConfirm ? '처리 중...' : '확인'}
          </Button>
  
          {showCancelButton && (
            <Button
              variant="cancel"
              onClick={onCancel ?? undefined}
            >
              취소
            </Button>
          )}
        </footer>
  
        {enableOutsideClick && (
          <div className={styles.hint}>
            <small>모달 밖을 클릭하거나 ESC로 닫을 수 있어요.</small>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Modal;
