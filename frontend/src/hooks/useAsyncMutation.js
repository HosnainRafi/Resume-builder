// src/hooks/useAsyncMutation.js

import { useState } from 'react';

export function useAsyncMutation(mutationFn, options = {}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (variables) => {
    setIsPending(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}
