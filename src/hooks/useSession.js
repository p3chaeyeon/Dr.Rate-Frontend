/* src/hooks/useSession.js */

import { useAtom } from 'jotai';
import { sessionAtom } from 'src/atoms/sessionAtom';

export const useSession = () => {
    const [session, setSession] = useAtom(sessionAtom);

    const updateSession = (newToken) => {
        setSession(newToken); // 세션을 업데이트 (로그인)
        console.log('Session Updated:', newToken);
    };

    const clearSession = () => {
        setSession(null); // 세션을 초기화 (로그아웃)
        console.log('Session Cleared');
    };

    return { session, updateSession, clearSession };
};





