import { readable, writable, type Readable } from "svelte/store";

type AsyncFunction<T extends any[], U> = (...args: T) => Promise<U>;

type AsyncState<U> = {
  result: U | null;
  inProgress: boolean;
  error: Error | null;
};

export function useAsync<T extends any[], U>(
  asyncFunction: AsyncFunction<T, U>
) {
  const state = writable<AsyncState<U>>({
    inProgress: false,
    error: null,
    result: null,
  });

  function setField<K extends keyof AsyncState<U>>(
    field: K,
    value: AsyncState<U>[K]
  ) {
    state.update((current) => ({ ...current, [field]: value }));
  }

  async function execute(...args: T): Promise<U | void> {
    setField("inProgress", true);
    setField("error", null);
    try {
      const response = await asyncFunction(...args);
      setField("result", response);
      return response;
    } catch (e) {
      setField(
        "error",
        e instanceof Error ? e : new Error("An unexpected error occurred.")
      );
    } finally {
      setField("inProgress", false);
    }
  }

  return {
    state,
    execute,
  };
}
