export default function Card({
    children,
    className = '',
    noPadding = false,
    ...props
}) {
    return (
        <div
            className={`bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 ${className}`}
            {...props}
        >
            <div className={noPadding ? '' : 'p-6 text-gray-900'}>
                {children}
            </div>
        </div>
    );
}
