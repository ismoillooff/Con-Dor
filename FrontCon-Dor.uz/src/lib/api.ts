/* ─── Centralized API Client ──────────────────────────
   - Base URL from env
   - Auto JWT injection
   - X-Session-Key for guest cart
   - Timeout + error handling
   - 401 → clear auth
   ───────────────────────────────────────────────────── */

const BASE = import.meta.env.VITE_API_BASE_URL || '';
const TIMEOUT_MS = 15_000;

/* ── Session key for guest cart ── */
function getSessionKey(): string {
    let key = localStorage.getItem('session_key');
    if (!key) {
        key = crypto.randomUUID();
        localStorage.setItem('session_key', key);
    }
    return key;
}

/* ── Token helpers ── */
export function getToken(): string | null {
    return localStorage.getItem('auth_token');
}
export function setToken(token: string): void {
    localStorage.setItem('auth_token', token);
}
export function clearToken(): void {
    localStorage.removeItem('auth_token');
}

/* ── Error class ── */
export class ApiError extends Error {
    status: number;
    body: unknown;
    constructor(status: number, body: unknown) {
        super(typeof body === 'object' && body && 'detail' in body
            ? String((body as { detail: string }).detail)
            : `API error ${status}`);
        this.status = status;
        this.body = body;
    }
}

/* ── Core request function ── */
async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    opts?: { raw?: boolean }
): Promise<T> {
    const url = `${BASE}${path}`;
    const headers: Record<string, string> = {};
    const token = getToken();

    if (token) headers['Authorization'] = `Bearer ${token}`;
    headers['X-Session-Key'] = getSessionKey();

    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            method,
            headers,
            body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });

        clearTimeout(timer);

        // 401 → clear auth
        if (res.status === 401) {
            clearToken();
            // Don't throw for login attempts
            if (!path.includes('/auth/login')) {
                window.location.reload();
            }
        }

        if (opts?.raw) return res as unknown as T;

        // 204 No Content
        if (res.status === 204) return null as T;

        const data = await res.json().catch(() => null);

        if (!res.ok) throw new ApiError(res.status, data);

        return data as T;
    } catch (err) {
        clearTimeout(timer);
        if (err instanceof ApiError) throw err;
        if ((err as Error).name === 'AbortError') {
            throw new ApiError(408, { detail: "So'rov vaqti tugadi. Qayta urinib ko'ring." });
        }
        throw err;
    }
}

/* ── Public API methods ── */
export const api = {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
    put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
    patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
    del: <T>(path: string) => request<T>('DELETE', path),
    upload: <T>(path: string, formData: FormData) => request<T>('POST', path, formData),
};
