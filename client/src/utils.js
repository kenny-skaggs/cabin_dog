
export function debouncedCallable(callable, delay=100) {
    let currentTimer = undefined;
    return (...args) => {
        if (currentTimer === undefined) {
            currentTimer = setTimeout(() => {
                callable(...args);
                currentTimer = undefined
            }, delay);
        }
    }
}