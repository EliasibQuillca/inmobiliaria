import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function Input({
    type = 'text',
    className = '',
    isFocused = false,
    error = false,
    ...props
}, ref) {
    const localRef = useRef(null);
    const inputRef = ref || localRef;

    useEffect(() => {
        if (isFocused) {
            inputRef.current?.focus();
        }
    }, [isFocused]);

    const baseClasses = 'rounded-md shadow-sm transition duration-150 ease-in-out';
    
    const stateClasses = error
        ? 'border-danger-300 text-danger-900 placeholder-danger-300 focus:border-danger-500 focus:ring-danger-500'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

    return (
        <input
            {...props}
            type={type}
            className={`${baseClasses} ${stateClasses} ${className}`}
            ref={inputRef}
        />
    );
});
