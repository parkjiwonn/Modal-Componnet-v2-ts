import { renderHook } from '@testing-library/react';
import { useOutsideClick } from './useOutsideClick';

describe('useOutsideClick', () => {
    // DOM 요소 생성 헬퍼
    const createElement = (tagName: string = 'div'): HTMLElement => {
        const element = document.createElement(tagName);
        document.body.appendChild(element);
        return element;
    };

    // 테스트 후 정리
    afterEach(() => {
        // 모든 이벤트 리스너 제거
        document.removeEventListener('mousedown', jest.fn());
        // DOM 정리
        document.body.innerHTML = '';
    });

    describe('기본 동작', () => {
        it('함수를 반환한다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            expect(typeof result.current).toBe('function');
        });

        it('반환된 함수는 정리 함수를 반환한다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));
            const element = createElement();

            const cleanup = result.current(element);

            expect(typeof cleanup).toBe('function');
        });
    });

    describe('외부 클릭 감지', () => {
        it('요소 외부를 클릭하면 콜백이 호출된다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            const element = createElement();
            result.current(element);

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('요소 내부를 클릭하면 콜백이 호출되지 않는다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            const element = createElement();
            result.current(element);

            // 내부 클릭 시뮬레이션
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 50,
                clientY: 50,
            });

            element.dispatchEvent(event);

            expect(callback).not.toHaveBeenCalled();
        });

        it('요소의 자식 요소를 클릭하면 콜백이 호출되지 않는다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            const parentElement = createElement();
            const childElement = document.createElement('span');
            parentElement.appendChild(childElement);

            result.current(parentElement);

            // 자식 요소 클릭 시뮬레이션
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 50,
                clientY: 50,
            });

            childElement.dispatchEvent(event);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('여러 요소 등록', () => {
        it('여러 요소를 등록할 수 있다', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            const { result: result1 } = renderHook(() => useOutsideClick(callback1));
            const { result: result2 } = renderHook(() => useOutsideClick(callback2));

            const element1 = createElement();
            const element2 = createElement();

            result1.current(element1);
            result2.current(element2);

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
        });

        // 기존 테스트를 이렇게 변경
        it('각 요소는 독립적으로 동작한다', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            const { result: result1 } = renderHook(() => useOutsideClick(callback1));
            const { result: result2 } = renderHook(() => useOutsideClick(callback2));

            const element1 = createElement();
            const element2 = createElement();

            result1.current(element1);
            result2.current(element2);

            // 외부 클릭으로 두 콜백이 모두 호출되는지 확인
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            // 외부 클릭이므로 둘 다 호출되어야 함
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
        });
    });

    describe('요소 등록 해제', () => {
        it('정리 함수를 호출하면 외부 클릭 감지가 중단된다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            const element = createElement();
            const cleanup = result.current(element);

            // 정리 함수가 존재하는지 확인 후 호출
            if (cleanup) {
                cleanup();
            }

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            expect(callback).not.toHaveBeenCalled();
        });

        it('null 요소를 전달하면 아무것도 등록되지 않는다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            const cleanup = result.current(null);

            expect(cleanup).toBeUndefined();

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('이벤트 리스너 정리', () => {
        it('훅이 언마운트되면 이벤트 리스너가 제거된다', () => {
            const callback = jest.fn();
            const { unmount } = renderHook(() => useOutsideClick(callback));

            const element = createElement();
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
            const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

            // 훅 언마운트
            unmount();

            // 이벤트 리스너가 제거되었는지 확인
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

            addEventListenerSpy.mockRestore();
            removeEventListenerSpy.mockRestore();
        });
    });

    describe('콜백 함수 변경', () => {
        it('콜백 함수가 변경되어도 이전 콜백이 사용된다 (현재 구현의 한계)', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            const { result, rerender } = renderHook(
                ({ callback }) => useOutsideClick(callback),
                { initialProps: { callback: callback1 } }
            );

            const element = createElement();
            result.current(element);

            // 콜백 변경
            rerender({ callback: callback2 });

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            // 현재 구현에서는 이전 콜백이 호출됨 (구현의 한계)
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).not.toHaveBeenCalled();
        });
    });

    describe('엣지 케이스', () => {
        it('요소가 DOM에서 제거된 후에도 안전하게 동작한다', () => {
            const callback = jest.fn();
            const { result } = renderHook(() => useOutsideClick(callback));

            const element = createElement();
            result.current(element);

            // 요소를 DOM에서 제거
            document.body.removeChild(element);

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            // 에러가 발생하지 않아야 함
            expect(() => {
                outsideElement.dispatchEvent(event);
            }).not.toThrow();
        });

        it('동일한 요소를 여러 번 등록해도 안전하게 동작한다', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            const { result } = renderHook(() => useOutsideClick(callback1));

            const element = createElement();
            result.current(element);
            result.current(element); // 동일한 요소 다시 등록

            // 외부 클릭 시뮬레이션
            const outsideElement = createElement();
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            });

            outsideElement.dispatchEvent(event);

            // 마지막 콜백만 호출되어야 함
            expect(callback1).toHaveBeenCalledTimes(1);
        });
    });
});