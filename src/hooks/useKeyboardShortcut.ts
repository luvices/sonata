import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrlKey: boolean = false,
  metaKey: boolean = false
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      // UNLESS it's a specific shortcut that overrides (like Esc)
      if (
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) &&
        key !== 'Escape'
      ) {
        return;
      }

      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();
      const isCtrlMatch = ctrlKey ? event.ctrlKey || event.metaKey : true;
      const isMetaMatch = metaKey ? event.metaKey : true;

      if (isKeyMatch && isCtrlMatch && isMetaMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrlKey, metaKey]);
}
