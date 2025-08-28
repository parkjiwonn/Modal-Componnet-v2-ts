import React, { useRef, useEffect } from 'react';
import { useOutsideClick } from '../../hook/useOutsideClick';
import { keyPress } from '../../utils/keyPress';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  enableOutsideClick?: boolean;
  enableKeyboardShortcuts?: boolean;
  showCancelButton?: boolean;
}

function Modal({ 
  isOpen, 
  message, 
  onConfirm, 
  onCancel,
  enableOutsideClick = true,
  enableKeyboardShortcuts = true,
  showCancelButton = true 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 외부 클릭으로 모달 닫기
  const registerOutsideClick = useOutsideClick(() => {
    if (enableOutsideClick && onCancel) {
      onCancel();
    }
  });

  // 키보드 이벤트 처리
  const handleKeyPress = keyPress({
    onEscape: () => {
      if (enableKeyboardShortcuts && onCancel) {
        onCancel();
      }
    },
    onEnter: () => {
      if (enableKeyboardShortcuts && onConfirm) {
        onConfirm();
      }
    }
  }, { preventDefault: ['Escape', 'Enter'] });

  // 외부 클릭 등록
  useEffect(() => {
    if (modalRef.current && isOpen) {
      return registerOutsideClick(modalRef.current);
    }
  }, [registerOutsideClick, isOpen]);

  // 키보드 이벤트 등록
  useEffect(() => {
    if (isOpen && enableKeyboardShortcuts) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen, handleKeyPress, enableKeyboardShortcuts]);

  // 모달이 열릴 때 포커스 설정
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content enhanced-modal" 
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h3>알림</h3>
          {enableKeyboardShortcuts && (
            <div className="modal-shortcuts">
              <small>ESC: 취소 | Enter: 확인</small>
            </div>
          )}
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-buttons">
          <button 
            onClick={onConfirm ? onConfirm : undefined} 
            className="confirm-btn"
            autoFocus
          >
            확인
          </button>
          {showCancelButton && (
            <button onClick={onCancel ? onCancel : undefined} className="cancel-btn">
              취소
            </button>
          )}
        </div>
        
        {enableOutsideClick && (
          <div className="modal-hint">
            <small>모달 외부를 클릭하거나 ESC키를 눌러 닫을 수 있습니다</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;