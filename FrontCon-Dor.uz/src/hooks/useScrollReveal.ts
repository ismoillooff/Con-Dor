import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(threshold = 0.1) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        // Remove visible class when element leaves viewport
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        // Observe the element and all children with reveal classes
        const revealEls = el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
        revealEls.forEach((child) => observer.observe(child));

        if (el.classList.contains('reveal') || el.classList.contains('reveal-left') ||
            el.classList.contains('reveal-right') || el.classList.contains('reveal-scale') ||
            el.classList.contains('stagger-children')) {
            observer.observe(el);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return ref;
}

export function useCountUp(end: number, duration = 2000, startOnVisible = true) {
    const ref = useRef<HTMLElement>(null);
    const counted = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || counted.current) return;

        const hasDecimal = end % 1 !== 0;
        const decimals = hasDecimal ? (end.toString().split('.')[1]?.length || 1) : 0;

        const animate = () => {
            counted.current = true;
            const startTime = performance.now();

            const step = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo — fast start, smooth deceleration
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = end * eased;

                if (hasDecimal) {
                    el.textContent = current.toFixed(decimals);
                } else {
                    el.textContent = Math.round(current).toLocaleString();
                }

                if (progress < 1) requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
        };

        if (startOnVisible) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        animate();
                        observer.disconnect();
                    }
                },
                { threshold: 0.3 }
            );
            observer.observe(el);
            return () => observer.disconnect();
        } else {
            animate();
        }
    }, [end, duration, startOnVisible]);

    return ref;
}
