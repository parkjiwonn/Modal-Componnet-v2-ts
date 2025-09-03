import { renderHook, act } from '@testing-library/react';
import useToggle from './useToggle';

// 타입 정의
type UseToggleReturn = [
  boolean,
  () => void,
  () => void,
  () => void
];

describe('useToggle', () => {
  describe('초기값 설정', () => {
    it('초기값을 제공하지 않으면 false를 반환한다', () => {
      const { result } = renderHook(() => useToggle());
      
      expect(result.current[0]).toBe(false);
    });

    it('초기값을 true로 설정하면 true를 반환한다', () => {
      const { result } = renderHook(() => useToggle(true));
      
      expect(result.current[0]).toBe(true);
    });

    it('초기값을 false로 설정하면 false를 반환한다', () => {
      const { result } = renderHook(() => useToggle(false));
      
      expect(result.current[0]).toBe(false);
    });
  });

  describe('반환값 구조', () => {
    it('배열 형태로 [value, toggle, setTrue, setFalse]를 반환한다', () => {
      const { result } = renderHook(() => useToggle());
      
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(4);
      expect(typeof result.current[0]).toBe('boolean'); // value
      expect(typeof result.current[1]).toBe('function'); // toggle
      expect(typeof result.current[2]).toBe('function'); // setTrue
      expect(typeof result.current[3]).toBe('function'); // setFalse
    });
  });

  describe('toggle 함수', () => {
    it('false에서 true로 토글한다', () => {
      const { result } = renderHook(() => useToggle(false));
      const [, toggle] = result.current as UseToggleReturn;
      
      act(() => {
        toggle();
      });
      
      expect(result.current[0]).toBe(true);
    });

    it('true에서 false로 토글한다', () => {
      const { result } = renderHook(() => useToggle(true));
      const [, toggle] = result.current as UseToggleReturn;
      
      act(() => {
        toggle();
      });
      
      expect(result.current[0]).toBe(false);
    });

    it('여러 번 토글할 수 있다', () => {
      const { result } = renderHook(() => useToggle(false));
      
      // false -> true
      act(() => {
        const [, toggle] = result.current as UseToggleReturn;
        toggle();
      });
      expect(result.current[0]).toBe(true);
      
      // true -> false (새로운 toggle 함수 사용)
      act(() => {
        const [, toggle] = result.current as UseToggleReturn;
        toggle();
      });
      expect(result.current[0]).toBe(false);
      
      // false -> true (새로운 toggle 함수 사용)
      act(() => {
        const [, toggle] = result.current as UseToggleReturn;
        toggle();
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('setTrue 함수', () => {
    it('값을 true로 설정한다', () => {
      const { result } = renderHook(() => useToggle(false));
      const [, , setTrue] = result.current as UseToggleReturn;
      
      act(() => {
        setTrue();
      });
      
      expect(result.current[0]).toBe(true);
    });

    it('이미 true인 상태에서도 true로 유지한다', () => {
      const { result } = renderHook(() => useToggle(true));
      const [, , setTrue] = result.current as UseToggleReturn;
      
      act(() => {
        setTrue();
      });
      
      expect(result.current[0]).toBe(true);
    });
  });

  describe('setFalse 함수', () => {
    it('값을 false로 설정한다', () => {
      const { result } = renderHook(() => useToggle(true));
      const [, , , setFalse] = result.current as UseToggleReturn;
      
      act(() => {
        setFalse();
      });
      
      expect(result.current[0]).toBe(false);
    });

    it('이미 false인 상태에서도 false로 유지한다', () => {
      const { result } = renderHook(() => useToggle(false));
      const [, , , setFalse] = result.current as UseToggleReturn;
      
      act(() => {
        setFalse();
      });
      
      expect(result.current[0]).toBe(false);
    });
  });

  describe('함수들의 조합 사용', () => {
    it('여러 함수를 순차적으로 사용할 수 있다', () => {
      const { result } = renderHook(() => useToggle(false));
      
      // setTrue로 true 설정
      act(() => {
        const [, , setTrue] = result.current as UseToggleReturn;
        setTrue();
      });
      expect(result.current[0]).toBe(true);
      
      // toggle로 false로 변경 (새로운 toggle 함수 사용)
      act(() => {
        const [, toggle] = result.current as UseToggleReturn;
        toggle();
      });
      expect(result.current[0]).toBe(false);
      
      // setFalse로 false 유지
      act(() => {
        const [, , , setFalse] = result.current as UseToggleReturn;
        setFalse();
      });
      expect(result.current[0]).toBe(false);
      
      // toggle로 true로 변경 (새로운 toggle 함수 사용)
      act(() => {
        const [, toggle] = result.current as UseToggleReturn;
        toggle();
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('함수 참조 안정성', () => {
    it('setTrue와 setFalse는 참조가 유지된다', () => {
      const { result, rerender } = renderHook(() => useToggle());
      
      const initialSetTrue = result.current[2];
      const initialSetFalse = result.current[3];
      
      // 값 변경
      act(() => {
        const [, , setTrue] = result.current as UseToggleReturn;
        setTrue();
      });
      
      rerender();
      
      expect(result.current[2]).toBe(initialSetTrue);
      expect(result.current[3]).toBe(initialSetFalse);
    });

    it('toggle은 value가 변경되면 새로운 참조가 생성된다', () => {
      const { result } = renderHook(() => useToggle(false));
      
      const initialToggle = result.current[1];
      
      // 값 변경
      act(() => {
        const [, toggle] = result.current as UseToggleReturn;
        toggle();
      });
      
      // toggle 함수가 새로 생성됨
      expect(result.current[1]).not.toBe(initialToggle);
    });
  });
});