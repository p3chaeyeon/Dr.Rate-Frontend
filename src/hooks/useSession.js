/* src/hooks/useSession.js */

import { useAtom } from 'jotai';
import { sessionAtom } from 'src/atoms/sessionAtom';

export const useSession = () => {
    const [session, setSession] = useAtom(sessionAtom);

    console.log('Current Session Value:', session);

    const updateSession = (newToken) => {
        localStorage.setItem('Authorization', newToken);
        setSession(newToken);
    };

    const clearSession = () => {
        localStorage.removeItem('Authorization');
        setSession(null);
        console.log('Session Cleared');
    };

    return { session, updateSession, clearSession };
};
