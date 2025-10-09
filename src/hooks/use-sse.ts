import { useState, useCallback, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

interface UseSSEOptions {
  onMessage?: (message: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

interface UseSSEResult {
  content: string;
  error: string | null;
  loading: boolean;
  start: (prompt: string) => Promise<void>;
  stop: () => void;
  clear: () => void;
}

export function useSSE(options: UseSSEOptions = {}): UseSSEResult {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const start = useCallback(async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);
      setContent('');
      
      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();
      
      await fetchEventSource('http://localhost:8080/hello-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
        
        // 禁用自动重连
        openWhenHidden: true,
        
        onmessage(ev) {
          try {
            const data = JSON.parse(ev.data);
            console.log(data);
            const chunk = data.content;
            if (chunk) {
              setContent(prev => {
                const newContent = prev + chunk;
                options.onMessage?.(chunk);
                return newContent;
              });
            }
          } catch (e) {
            // 忽略解析错误
          }
        },
        
        onerror(err) {
          console.error('SSE Error:', err);
          setError(err.message || 'Unknown error');
          options.onError?.(err);
          setLoading(false);
          // 不重连，直接抛出错误
          throw err;
        },
        
        onclose() {
          setLoading(false);
          options.onComplete?.();
        },
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // 用户主动取消
      }
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      options.onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setLoading(false);
    }
  }, [options]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  const clear = useCallback(() => {
    setContent('');
    setError(null);
    stop();
  }, [stop]);

  return {
    content,
    loading,
    error,
    start,
    stop,
    clear,
  };
}
