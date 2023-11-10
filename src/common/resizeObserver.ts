import React from 'react';

export function useResizeObserver() {
    const [, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });
    React.useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }
        window.addEventListener('resize', handleResize);
        setTimeout(handleResize, 300);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
}
