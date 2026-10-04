import { useParams, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigationState = () => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeGroup = searchParams.get('group') || null; // This is the Category slug
    const activeSub = searchParams.get('sub') || 'Barchasi'; // This is the SubCategory slug or 'Barchasi'

    const setGroup = useCallback((groupSlug: string | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (groupSlug) {
            newParams.set('group', groupSlug);
            newParams.set('sub', 'Barchasi');
        } else {
            newParams.delete('group');
            newParams.delete('sub');
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const setSub = useCallback((subSlug: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (subSlug === 'Barchasi') {
            newParams.delete('sub');
        } else {
            newParams.set('sub', subSlug);
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    return {
        activeGroup,
        activeSub,
        setGroup,
        setSub,
        slug
    };
};
