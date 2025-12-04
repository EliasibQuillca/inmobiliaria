import { Link } from '@inertiajs/react';

export default function Button({
    type = 'button',
    variant = 'primary', // primary, secondary, danger, ghost, link
    size = 'md', // sm, md, lg
    className = '',
    disabled = false,
    href,
    children,
    ...props
}) {
    const baseClasses = 'inline-flex items-center justify-center font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 focus:bg-primary-700 focus:ring-primary-500 border border-transparent',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm',
        danger: 'bg-danger-600 text-white hover:bg-danger-500 focus:bg-danger-700 focus:ring-danger-500 border border-transparent',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 border border-transparent',
        link: 'text-primary-600 hover:text-primary-900 underline decoration-primary-600/30 hover:decoration-primary-900 p-0 h-auto',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-md',
        md: 'px-4 py-2 text-xs rounded-md',
        lg: 'px-6 py-3 text-sm rounded-lg',
    };

    // Override size for link variant
    const sizeClasses = variant === 'link' ? '' : sizes[size];

    const classes = `${baseClasses} ${variants[variant]} ${sizeClasses} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
