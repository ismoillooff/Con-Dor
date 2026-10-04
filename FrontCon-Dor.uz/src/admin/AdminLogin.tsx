import { useState } from 'react';
import { useAdmin } from './AdminContext';

const AdminLogin = () => {
    const { login } = useAdmin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const errMsg = await login(email, password);
        if (errMsg) {
            setError(errMsg);
            setPassword('');
        }
        setLoading(false);
    };

    return (
        <div className="adm-login-page">
            <div className="adm-login-bg" />
            <div className="adm-login-grid" />
            <div className="adm-login-box">
                <div className="adm-login-logo">
                    <div className="adm-login-logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                            <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <div className="adm-login-logo-text">
                        <div className="primary">ARMYSHOP</div>
                        <div className="sub">TASHQI VA TAKTIK</div>
                    </div>
                </div>

                <h1 className="adm-login-title">Admin Panel</h1>
                <p className="adm-login-sub">Do'kon boshqaruv tizimiga kirish</p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="adm-login-error">⚠ {error}</div>}
                    <div className="adm-form-group">
                        <label className="adm-form-label">Email</label>
                        <input
                            type="email"
                            className="adm-form-input"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="adm-form-group">
                        <label className="adm-form-label">Parol</label>
                        <input
                            type="password"
                            className="adm-form-input"
                            placeholder="Parolni kiriting..."
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="adm-login-btn"
                        disabled={loading || !email || !password}
                        style={{ opacity: loading || !email || !password ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Tekshirilmoqda...
                            </span>
                        ) : 'Kirish →'}
                    </button>
                </form>

                <p className="adm-login-hint">
                    Faqat ruxsat etilgan foydalanuvchilar kirishi mumkin
                </p>
            </div>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminLogin;
