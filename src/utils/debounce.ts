/**
 * Creates a debounced version of function 
 * 
 * @param fn - function to debounce
 * @param delay - milliseconds to wait after the last call
 */
export const useDebounce = <TArgs extends unknown[]>(
    fn: (...args: TArgs) => void,
    delay: number
) => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: TArgs): void => {
        if (timer) clearTimeout(timer);
        
        timer = setTimeout(() => {
            fn(...args);
            timer = null
        }, delay);
    }
}