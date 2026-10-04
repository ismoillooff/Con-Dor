import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { api, ApiError, getToken, setToken, clearToken } from '../lib/api';

/* ─── Types ─── */
export interface Toast { id: number; type: 'success' | 'error' | 'info'; message: string; }

export interface DashboardData {
    total_products: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
    recent_orders: number;
    active_products: number;
}

interface AdminContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
    toasts: Toast[];
    addToast: (type: Toast['type'], message: string) => void;
    removeToast: (id: number) => void;
    stats: DashboardData | null;
    fetchStats: () => Promise<void>;
    statsLoading: boolean;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);
export const useAdmin = () => useContext(AdminContext);

let _toastId = 0;

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        if (!getToken()) return;
        setStatsLoading(true);
        try {
            const res = await api.get<DashboardData>('/api/admin/dashboard');
            setStats(res);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<string | null> => {
        try {
            const res = await api.post<{ access_token: string }>('/api/auth/login', { email, password });
            setToken(res.access_token);
            setIsAuthenticated(true);
            return null; // no error
        } catch (err) {
            if (err instanceof ApiError) {
                return err.message;
            }
            return "Tarmoq xatosi. Qayta urinib ko'ring.";
        }
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setIsAuthenticated(false);
    }, []);

    const addToast = useCallback((type: Toast['type'], message: string) => {
        const id = ++_toastId;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <AdminContext.Provider value={{
            isAuthenticated, login, logout, toasts, addToast, removeToast,
            stats, fetchStats, statsLoading
        }}>
            {children}
        </AdminContext.Provider>
    );
};
