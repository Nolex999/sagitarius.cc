const DEFAULT_SUPABASE_FETCH_TIMEOUT_MS = 4000;

export function createSupabaseFetch(
  timeoutMs = DEFAULT_SUPABASE_FETCH_TIMEOUT_MS
): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const upstreamSignal = init?.signal;

    const abortFromUpstream = () => controller.abort(upstreamSignal?.reason);

    if (upstreamSignal?.aborted) {
      abortFromUpstream();
    } else {
      upstreamSignal?.addEventListener('abort', abortFromUpstream, {
        once: true,
      });
    }

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
      upstreamSignal?.removeEventListener('abort', abortFromUpstream);
    }
  };
}
