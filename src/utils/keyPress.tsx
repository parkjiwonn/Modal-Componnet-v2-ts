interface KeyHandlers {
    onEnter?: (event: KeyboardEvent) => void;
    onEscape?: (event: KeyboardEvent) => void;
    onSpace?: (event: KeyboardEvent) => void;
    onTab?: (event: KeyboardEvent) => void;
    onArrowUp?: (event: KeyboardEvent) => void;
    onArrowDown?: (event: KeyboardEvent) => void;
    onArrowLeft?: (event: KeyboardEvent) => void;
    onArrowRight?: (event: KeyboardEvent) => void;
    [key: string]: ((event: KeyboardEvent) => void) | undefined;
  }
  
  interface KeyPressOptions {
    preventDefault?: boolean | string[];
    caseSensitive?: boolean;
  }
  
  export const keyPress = (handlers: KeyHandlers, options: KeyPressOptions = {}) => {
      const { preventDefault = false, caseSensitive = false } = options;
  
      return (event: KeyboardEvent) => {
          const { key } = event;
  
          // 기본 키 매핑
          const defaultKeyMap: Record<string, keyof KeyHandlers> = {
              'Enter': 'onEnter',
              'Escape': 'onEscape',
              ' ': 'onSpace',
              'Tab': 'onTab',
              'ArrowUp': 'onArrowUp',
              'ArrowDown': 'onArrowDown',
              'ArrowLeft': 'onArrowLeft',
              'ArrowRight': 'onArrowRight',
          };
  
          let handlerName: keyof KeyHandlers | undefined;
  
          if (defaultKeyMap[key]) {
              handlerName = defaultKeyMap[key];
          } else {
              // 커스텀 키 처리
              const normalizedKey = caseSensitive ? key : key.toLowerCase();
              handlerName = normalizedKey as keyof KeyHandlers;
          }
  
          if (handlerName && handlers[handlerName]) {
              const shouldPreventDefault = 
                  preventDefault === true || 
                  (Array.isArray(preventDefault) && preventDefault.includes(key));
  
              if (shouldPreventDefault) {
                  event.preventDefault();
              }
  
              handlers[handlerName]!(event);
          }
      };
  };