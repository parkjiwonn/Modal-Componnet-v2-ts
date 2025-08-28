import { useEffect, useRef } from "react";

export const useOutsideClick = (callback: () => void) => {
  const handlersRef = useRef<Map<Element, () => void>>(new Map());

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
        const handlers = handlersRef.current;
        handlers.forEach((callback, element) => {
            if (element && !element.contains(event.target as Node)) {
                callback();
            }
        })
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (element: Element | null) => {
    
        if (!element) return;

        handlersRef.current.set(element, callback);
        
        return () => {
            handlersRef.current.delete(element);
        }
    
  };
};