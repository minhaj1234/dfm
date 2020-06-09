/* istanbul ignore next */

const mock = () => {
  let storage = {};
  return {
    clear: () => (storage = {}),
    getItem: (key) => (key in storage ? storage[key] : null),
    removeItem: (key) => delete storage[key],
    setItem: (key, value) => (storage[key] = value || ''),
  };
};

/* istanbul ignore next */
Object.defineProperty(window, 'localStorage', { value: mock() });
/* istanbul ignore next */
Object.defineProperty(window, 'sessionStorage', { value: mock() });
/* istanbul ignore next */
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});
