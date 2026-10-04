import { useState } from 'react';
import './admin.css';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import NavbarAdmin from './pages/NavbarAdmin';
import HeroAdmin from './pages/HeroAdmin';
import BannerAdmin from './pages/BannerAdmin';
import Settings from './pages/Settings';
import OrdersAdmin from './pages/OrdersAdmin';
import AnalyticsAdmin from './pages/AnalyticsAdmin';
import TelegramSettingsAdmin from './pages/TelegramSettingsAdmin';
import ProductEditor from './pages/ProductEditor';
import HeroEditor from './pages/HeroEditor';
import BranchesAdmin from './pages/BranchesAdmin';


type PageId =
    | 'dashboard' | 'orders' | 'analytics'
    | 'products' | 'categories' | 'product-add' | 'product-edit'
    | 'navbar' | 'hero' | 'hero-add' | 'hero-edit' | 'banner'
    | 'settings' | 'telegram-settings' | 'branches';


const PageRenderer = ({ page, onNavigate }: { page: PageId; onNavigate: (p: string) => void }) => {
    switch (page) {
        case 'dashboard': return <Dashboard onNavigate={onNavigate} />;
        case 'orders': return <OrdersAdmin />;
        case 'analytics': return <AnalyticsAdmin />;
        case 'products': return <Products onAdd={() => onNavigate('product-add')} onEdit={(id) => onNavigate(`product-edit:${id}`)} />;
        case 'product-add': return <ProductEditor onBack={() => onNavigate('products')} />;
        case 'categories': return <Categories />;
        case 'navbar': return <NavbarAdmin />;
        case 'hero': return <HeroAdmin onAdd={() => onNavigate('hero-add')} onEdit={(id) => onNavigate(`hero-edit:${id}`)} />;
        case 'hero-add': return <HeroEditor onBack={() => onNavigate('hero')} />;
        case 'banner': return <BannerAdmin />;
        case 'settings': return <Settings />;
        case 'telegram-settings': return <TelegramSettingsAdmin />;
        case 'branches': return <BranchesAdmin />;

        default:
            if (page.startsWith('product-edit:')) {
                const id = parseInt(page.split(':')[1]);
                return <ProductEditor productId={id} onBack={() => onNavigate('products')} />;
            }
            if (page.startsWith('hero-edit:')) {
                const id = parseInt(page.split(':')[1]);
                return <HeroEditor slideId={id} onBack={() => onNavigate('hero')} />;
            }
            return <Dashboard onNavigate={onNavigate} />;
    }
};



const AdminInner = () => {
    const { isAuthenticated } = useAdmin();
    const [activePage, setActivePage] = useState<PageId>(() => {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length > 1) {
            const page = parts[1] as PageId;
            const validPages: PageId[] = [
                'dashboard', 'orders', 'analytics', 'products',
                'categories', 'settings', 'telegram-settings', 'branches',
                'hero', 'banner'
            ];
            if (validPages.includes(page)) return page;
        }
        return 'dashboard';
    });

    if (!isAuthenticated) return <AdminLogin />;

    return (
        <AdminLayout activePage={activePage} onNavigate={(p) => setActivePage(p as PageId)}>
            <PageRenderer page={activePage} onNavigate={(p) => setActivePage(p as PageId)} />
        </AdminLayout>
    );
};

const AdminApp = () => (
    <AdminProvider>
        <AdminInner />
    </AdminProvider>
);

export default AdminApp;
