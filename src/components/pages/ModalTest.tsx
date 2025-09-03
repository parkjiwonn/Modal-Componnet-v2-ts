import React, { useState } from 'react';
import { useModal } from 'hook/useModal';
import Button from 'components/common/Button/Button';

const ModalTest = () => {
  const { confirm, alert } = useModal();
  const [result, setResult] = useState('');

  const handleBasicModal = async () => {
    const ok = await confirm('기본 type의 모달입니다.\n외부 클릭이나 ESC키로 닫을 수 있습니다.');
    setResult(`기본 모달 결과: ${ok ? '확인' : '취소'}`);
  };

  const handleDisabledOutsideClick = async () => {
    const ok = await confirm(
      '외부 클릭이 비활성화된 모달입니다.\nESC키나 버튼으로만 닫을 수 있습니다.',
      { enableOutsideClick: false }
    );
    setResult(`외부클릭 비활성화 모달 결과: ${ok ? '확인' : '취소'}`);
  };

  const handleDisabledKeyboard = async () => {
    const ok = await confirm(
      '키보드 단축키가 비활성화된 모달입니다.\n버튼이나 외부 클릭으로만 닫을 수 있습니다.',
      { enableKeyboardShortcuts: false }
    );
    setResult(`키보드 비활성화 모달 결과: ${ok ? '확인' : '취소'}`);
  };

  const handleAlertModal = async () => {
    await alert('이것은 알림 모달입니다.\n취소 버튼이 없습니다.');
    setResult('알림 모달이 표시되었습니다.');
  };

  const handleFullyDisabled = async () => {
    const ok = await confirm(
      '모든 향상 기능이 비활성화된 모달입니다.\n오직 버튼으로만 닫을 수 있습니다.',
      { enableOutsideClick: false, enableKeyboardShortcuts: false }
    );
    setResult(`완전 비활성화 모달 결과: ${ok ? '확인' : '취소'}`);
  };

  return (
    <div className="testSection">
      <h2>Modal Demo</h2>
      <p>{result}</p>

      <div className="buttonGroup">
        <Button
          variant="primary"
          onClick={handleBasicModal}
        >
          기본 type의 모달
        </Button>

        <Button
          variant="primary"
          onClick={handleDisabledOutsideClick}
        >
          외부클릭 비활성화
        </Button>

        <Button
          variant="primary"
          onClick={handleDisabledKeyboard}
        >
          키보드 비활성화
        </Button>

        <Button
          variant="success"
          onClick={handleAlertModal}
        >
          알림 모달 (취소버튼 없음)
        </Button>

        <Button
          variant="danger"
          onClick={handleFullyDisabled}
        >
          모든 기능 비활성화
        </Button>
      </div>
    </div>
  );
};

export default ModalTest;