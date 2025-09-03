import { renderHook, act, render, screen, fireEvent } from '@testing-library/react';
import { useModal, ModalProvider } from './useModal';
import React from 'react';

// 테스트용 컴포넌트
const TestComponent = () => {
  const { confirm, alert } = useModal();
  
  const handleConfirm = async () => {
    const result = await confirm('테스트 메시지');
    console.log('Confirm result:', result);
  };
  
  const handleAlert = async () => {
    const result = await alert('알림 메시지');
    console.log('Alert result:', result);
  };
  
  return (
    <div>
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleAlert}>Alert</button>
    </div>
  );
};

// Context 없이 useModal을 사용하는 컴포넌트
const TestComponentWithoutProvider = () => {
  const { confirm } = useModal();
  return <div>Test</div>;
};

describe('useModal', () => {
  describe('Context 에러 처리', () => {
    it('ModalProvider 없이 useModal을 사용하면 에러가 발생한다', () => {
      // 에러를 캐치하기 위한 콘솔 에러 억제
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useModal());
      }).toThrow('useModal must be used within a ModalProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('ModalProvider', () => {
    it('children을 렌더링한다', () => {
      render(
        <ModalProvider>
          <div data-testid="test-child">Test Child</div>
        </ModalProvider>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    // 수정 후 
    it('Modal 컴포넌트를 렌더링한다 (모달이 열릴 때)', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      // 모달을 열어서 DOM에 렌더링되도록 함
      act(() => {
        result.current.confirm('테스트 메시지');
      });
      
      // Modal이 렌더링되었는지 확인
      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });
  });

  describe('confirm 메서드', () => {
    it('Promise를 반환한다', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      const confirmPromise = result.current.confirm('테스트 메시지');
      
      expect(confirmPromise).toBeInstanceOf(Promise);
    });

    it('기본 옵션으로 모달을 표시한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      act(() => {
        result.current.confirm('테스트 메시지');
      });
      
      // 모달이 표시되었는지 확인
      expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
      expect(screen.getByText('확인')).toBeInTheDocument();
      expect(screen.getByText('취소')).toBeInTheDocument();
    });

    it('커스텀 옵션으로 모달을 표시한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      act(() => {
        result.current.confirm('테스트 메시지', {
          enableOutsideClick: false,
          enableKeyboardShortcuts: false,
          showCancelButton: false
        });
      });
      
      // 모달이 표시되었는지 확인
      expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
      expect(screen.getByText('확인')).toBeInTheDocument();
      expect(screen.queryByText('취소')).not.toBeInTheDocument();
    });

    it('확인 버튼 클릭 시 true를 반환한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      let confirmResult: boolean | undefined;
      
      act(() => {
        result.current.confirm('테스트 메시지').then((res) => {
          confirmResult = res;
        });
      });
      
      // 확인 버튼 클릭
      act(() => {
        fireEvent.click(screen.getByText('확인'));
      });
      
      // Promise가 resolve될 때까지 기다림
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(confirmResult).toBe(true);
    });

    it('취소 버튼 클릭 시 false를 반환한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      let confirmResult: boolean | undefined;
      
      act(() => {
        result.current.confirm('테스트 메시지').then((res) => {
          confirmResult = res;
        });
      });
      
      // 취소 버튼 클릭
      act(() => {
        fireEvent.click(screen.getByText('취소'));
      });
      
      // Promise가 resolve될 때까지 기다림
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(confirmResult).toBe(false);
    });
  });

  describe('alert 메서드', () => {
    it('Promise를 반환한다', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      const alertPromise = result.current.alert('알림 메시지');
      
      expect(alertPromise).toBeInstanceOf(Promise);
    });

    it('취소 버튼 없이 모달을 표시한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      act(() => {
        result.current.alert('알림 메시지');
      });
      
      // 모달이 표시되었는지 확인
      expect(screen.getByText('알림 메시지')).toBeInTheDocument();
      expect(screen.getByText('확인')).toBeInTheDocument();
      expect(screen.queryByText('취소')).not.toBeInTheDocument();
    });

    it('확인 버튼 클릭 시 true를 반환한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      let alertResult: boolean | undefined;
      
      act(() => {
        result.current.alert('알림 메시지').then((res) => {
          alertResult = res;
        });
      });
      
      // 확인 버튼 클릭
      act(() => {
        fireEvent.click(screen.getByText('확인'));
      });
      
      // Promise가 resolve될 때까지 기다림
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(alertResult).toBe(true);
    });
  });

  describe('모달 상태 관리', () => {
    it('모달이 닫히면 상태가 초기화된다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      act(() => {
        result.current.confirm('테스트 메시지');
      });
      
      // 모달이 표시되었는지 확인
      expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
      
      // 확인 버튼 클릭
      act(() => {
        fireEvent.click(screen.getByText('확인'));
      });
      
      // 모달이 닫혔는지 확인
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(screen.queryByText('테스트 메시지')).not.toBeInTheDocument();
    });

    it('여러 모달을 순차적으로 호출할 수 있다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      // 첫 번째 모달
      act(() => {
        result.current.confirm('첫 번째 모달');
      });
      
      expect(screen.getByText('첫 번째 모달')).toBeInTheDocument();
      
      // 첫 번째 모달 닫기
      act(() => {
        fireEvent.click(screen.getByText('확인'));
      });
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      // 두 번째 모달
      act(() => {
        result.current.alert('두 번째 모달');
      });
      
      expect(screen.getByText('두 번째 모달')).toBeInTheDocument();
      expect(screen.queryByText('첫 번째 모달')).not.toBeInTheDocument();
    });
  });

  describe('옵션 처리', () => {
    it('추가 옵션을 전달할 수 있다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      act(() => {
        result.current.confirm('테스트 메시지', {
          title: '커스텀 타이틀',
          lockScroll: false,
          loadingConfirm: true
        });
      });
      
      // 모달이 표시되었는지 확인
      expect(screen.getByText('테스트 메시지')).toBeInTheDocument();
    });

    it('기본 옵션을 사용한다', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ModalProvider>{children}</ModalProvider>
      );
      
      const { result } = renderHook(() => useModal(), { wrapper });
      
      act(() => {
        result.current.confirm('테스트 메시지');
      });
      
      // 기본 옵션 확인
      expect(screen.getByText('확인')).toBeInTheDocument();
      expect(screen.getByText('취소')).toBeInTheDocument();
    });
  });
});