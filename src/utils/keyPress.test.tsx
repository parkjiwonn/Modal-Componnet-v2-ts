import { keyPress } from './keyPress';

describe('keyPress', () => {
  // Mock KeyboardEvent 생성 헬퍼
  const createKeyboardEvent = (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent => {
    return {
      key,
      preventDefault: jest.fn(),
      ...options
    } as KeyboardEvent;
  };

  describe('모달에서 사용하는 키 매핑', () => {
    it('Enter 키가 눌렸을 때 onEnter 핸들러를 호출한다', () => {
      const onEnter = jest.fn();
      const handler = keyPress({ onEnter });
      const event = createKeyboardEvent('Enter');

      handler(event);

      expect(onEnter).toHaveBeenCalledWith(event);
    });

    it('Escape 키가 눌렸을 때 onEscape 핸들러를 호출한다', () => {
      const onEscape = jest.fn();
      const handler = keyPress({ onEscape });
      const event = createKeyboardEvent('Escape');

      handler(event);

      expect(onEscape).toHaveBeenCalledWith(event);
    });

    it('Enter와 Escape 키를 함께 사용할 수 있다', () => {
      const onEnter = jest.fn();
      const onEscape = jest.fn();
      const handler = keyPress({ onEnter, onEscape });

      handler(createKeyboardEvent('Enter'));
      handler(createKeyboardEvent('Escape'));

      expect(onEnter).toHaveBeenCalled();
      expect(onEscape).toHaveBeenCalled();
    });
  });

  describe('preventDefault 옵션 (모달에서 사용)', () => {
    it('preventDefault가 배열일 때 지정된 키에만 preventDefault를 호출한다', () => {
      const onEnter = jest.fn();
      const onEscape = jest.fn();
      const handler = keyPress(
        { onEnter, onEscape }, 
        { preventDefault: ['Enter', 'Escape'] }
      );

      const enterEvent = createKeyboardEvent('Enter');
      const escapeEvent = createKeyboardEvent('Escape');

      handler(enterEvent);
      handler(escapeEvent);

      expect(enterEvent.preventDefault).toHaveBeenCalled();
      expect(escapeEvent.preventDefault).toHaveBeenCalled();
    });

    it('preventDefault가 false일 때 preventDefault를 호출하지 않는다', () => {
      const onEnter = jest.fn();
      const handler = keyPress({ onEnter }, { preventDefault: false });
      const event = createKeyboardEvent('Enter');

      handler(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('핸들러가 없는 경우', () => {
    it('핸들러가 정의되지 않은 키는 무시한다', () => {
      const onEnter = jest.fn();
      const handler = keyPress({ onEnter });
      const event = createKeyboardEvent('Space'); // Space는 핸들러가 없음

      handler(event);

      expect(onEnter).not.toHaveBeenCalled();
    });

    it('핸들러가 null인 경우 무시한다', () => {
      const handler = keyPress({ onEnter: undefined });
      const event = createKeyboardEvent('Enter');

      // 에러가 발생하지 않아야 함
      expect(() => handler(event)).not.toThrow();
    });
  });

  describe('기본 옵션', () => {
    it('옵션을 제공하지 않으면 기본값을 사용한다', () => {
      const onEnter = jest.fn();
      const handler = keyPress({ onEnter });
      const event = createKeyboardEvent('Enter');

      handler(event);

      expect(onEnter).toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});