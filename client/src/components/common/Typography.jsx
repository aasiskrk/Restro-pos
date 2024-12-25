// These are reusable typography components that maintain consistency

export const PageTitle = ({ children, className = '' }) => (
    <h1 className={`font-display text-display-1 font-bold text-gray-900 ${className}`}>
        {children}
    </h1>
);

export const SectionTitle = ({ children, className = '' }) => (
    <h2 className={`font-display text-display-2 font-bold text-gray-900 ${className}`}>
        {children}
    </h2>
);

export const SectionSubtitle = ({ children, className = '' }) => (
    <p className={`text-subtitle-1 text-gray-600 ${className}`}>
        {children}
    </p>
);

export const SectionLabel = ({ children, className = '' }) => (
    <h3 className={`text-base font-semibold leading-7 text-orange-600 uppercase tracking-wider ${className}`}>
        {children}
    </h3>
);

export const CardTitle = ({ children, className = '' }) => (
    <h4 className={`text-heading-3 font-semibold text-gray-900 ${className}`}>
        {children}
    </h4>
);

export const BodyLarge = ({ children, className = '' }) => (
    <p className={`text-subtitle-2 text-gray-600 ${className}`}>
        {children}
    </p>
);

export const BodyText = ({ children, className = '' }) => (
    <p className={`text-body-1 text-gray-600 ${className}`}>
        {children}
    </p>
);

export const SmallText = ({ children, className = '' }) => (
    <p className={`text-body-2 text-gray-600 ${className}`}>
        {children}
    </p>
);

export const Caption = ({ children, className = '' }) => (
    <p className={`text-caption text-gray-500 ${className}`}>
        {children}
    </p>
); 