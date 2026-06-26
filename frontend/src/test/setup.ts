import "@testing-library/jest-dom";

// Node.js 22+ defines `globalThis.localStorage` as `undefined` unless
// --localstorage-file is provided. jsdom cannot override it when it is a
// non-configurable descriptor, so we patch it here before any test runs.
const buildStorage = (): Storage => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      store.set(key, String(value));
    },
    removeItem: (key: string): void => {
      store.delete(key);
    },
    clear: (): void => {
      store.clear();
    },
    get length(): number {
      return store.size;
    },
    key: (index: number): string | null => [...store.keys()][index] ?? null,
  };
};

if (typeof localStorage === "undefined" || localStorage === null) {
  Object.defineProperty(globalThis, "localStorage", {
    value: buildStorage(),
    writable: true,
    configurable: true,
  });
}

if (typeof sessionStorage === "undefined" || sessionStorage === null) {
  Object.defineProperty(globalThis, "sessionStorage", {
    value: buildStorage(),
    writable: true,
    configurable: true,
  });
}
