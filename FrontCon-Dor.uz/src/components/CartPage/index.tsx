import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    TrashIcon, MinusIcon, PlusIcon,
    ChevronLeftIcon, ShoppingBagIcon,
    CreditCardIcon, ShieldCheckIcon
} from '../Icons';
import CheckoutModal from './CheckoutModal';
import './CartPage.css';

const CartPage: React.FC = () => {
    const { items, removeFromCart, updateQuantity, totalPrice, itemsCount } = useCart();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const { t, lang } = useLanguage();

    const getUniqueKey = (item: any) => `${item.id}-${item.size || ''}-${item.color || ''}`;

    if (items.length === 0) {
        return (
            <div className="cart-empty-state">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div className="empty-icon" style={{ opacity: 0.2, marginBottom: 20 }}>
                        <ShoppingBagIcon size={80} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 15 }}>{t('cart.empty')}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 30, maxWidth: 400, margin: '0 auto 30px' }}>{t('cart.empty_desc')}</p>
                    <Link to="/" className="adm-btn adm-btn-primary" style={{ padding: '12px 40px', textDecoration: 'none' }}>{t('cart.start_shopping')}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page fade-in">
            <div className="container">
                <header className="cart-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, borderBottom: '1px solid var(--color-border)', paddingBottom: 20 }}>
                    <div className="cart-header-left">
                        <button className="back-link" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', cursor: 'pointer', marginBottom: 10 }}>
                            <ChevronLeftIcon size={18} />
                            <span>{t('cart.continue')}</span>
                        </button>
                        <h1 className="cart-title" style={{ fontSize: '2.5rem', fontWeight: 900 }}>{t('cart.title')} <span className="count" style={{ fontSize: '1.2rem', opacity: 0.5, fontWeight: 600 }}>({itemsCount} {t('common.products')})</span></h1>
                    </div>
                </header>

                <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
                    <div className="cart-items-section">
                        {items.map(item => {
                            const uniqueKey = getUniqueKey(item);
                            return (
                                <div key={uniqueKey} className="cart-item" style={{ display: 'flex', gap: 20, background: '#fff', padding: 20, borderRadius: 16, border: '1px solid var(--color-border)', marginBottom: 20, transition: '0.3s' }}>
                                    <div className="item-img" style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', background: '#f9f9f9', flexShrink: 0, border: '1px solid var(--color-border-light)' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="item-details" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div className="item-info-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 className="item-name" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8 }}>{item.name}</h3>
                                                <div className="item-variants" style={{ display: 'flex', gap: 15, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                                    {item.size && <span className="v-tag"><b>{t('common.size')}:</b> {item.size}</span>}
                                                    {item.color && <span className="v-tag"><b>{t('common.color')}:</b> {item.color}</span>}
                                                </div>
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromCart(uniqueKey)} aria-label={t('cart.remove')} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 5, borderRadius: 8 }}>
                                                <TrashIcon size={20} />
                                            </button>
                                        </div>

                                        <div className="item-controls-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                            <div className="quantity-group" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
                                                <button onClick={() => updateQuantity(uniqueKey, -1)} style={{ width: 36, height: 36, border: 'none', background: '#fff', cursor: 'pointer' }}><MinusIcon size={14} /></button>
                                                <span className="qty" style={{ width: 40, textAlign: 'center', fontWeight: 800 }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(uniqueKey, 1)} style={{ width: 36, height: 36, border: 'none', background: '#fff', cursor: 'pointer' }}><PlusIcon size={14} /></button>
                                            </div>
                                            <div className="item-price" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-text)' }}>
                                                {(item.price * item.quantity).toLocaleString('ru-RU')} {t('common.price')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <aside className="cart-summary-section">
                        <div className="summary-card" style={{ background: '#f9f9f9', padding: 30, borderRadius: 20, position: 'sticky', top: 100, border: '1px solid var(--color-border)' }}>
                            <h3 className="summary-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 25, borderBottom: '1px solid var(--color-border)', paddingBottom: 15 }}>{t('cart.summary')}</h3>

                            <div className="summary-details" style={{ marginBottom: 25 }}>
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, color: 'var(--color-text-secondary)' }}>
                                    <span>{t('cart.items')} ({itemsCount})</span>
                                    <span>{totalPrice.toLocaleString('ru-RU')} {t('common.price')}</span>
                                </div>
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, color: 'var(--color-text-secondary)' }}>
                                    <span>{t('cart.shipping')}</span>
                                    <span style={{ color: '#16a34a', fontWeight: 700 }}>{t('cart.free')}</span>
                                </div>
                                {totalPrice > 500000 && (
                                    <div className="promo-info" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, marginTop: 10 }}>
                                        {lang === 'ru' ? '🎉 Бесплатная доставка активна!' : '🎉 Bepul yetkazib berish faol!'}
                                    </div>
                                )}
                            </div>

                            <div className="summary-total" style={{ borderTop: '2px dashed var(--color-border)', paddingTop: 20, marginBottom: 30 }}>
                                <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('cart.total_amount')}</span>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--color-accent)' }}>{totalPrice.toLocaleString('ru-RU')} {t('common.price')}</span>
                                </div>
                            </div>

                            <button className="checkout-btn" onClick={() => setModalOpen(true)} style={{ width: '100%', height: 60, borderRadius: 16, background: 'var(--color-accent)', color: '#fff', border: 'none', fontSize: '1.2rem', fontWeight: 850, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: '0.3s', boxShadow: '0 10px 20px rgba(var(--color-accent-rgb), 0.2)' }}>
                                <CreditCardIcon size={22} />
                                <span>{t('cart.checkout')}</span>
                            </button>

                            <div className="summary-guarantees" style={{ marginTop: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                <ShieldCheckIcon size={18} />
                                <span>{t('cart.secure')}</span>
                            </div>
                        </div>

                        <div className="cart-promo-box" style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                            <input type="text" placeholder={t('cart.promo_placeholder')} style={{ flexGrow: 1, padding: '12px 15px', borderRadius: 10, border: '1px solid var(--color-border)', outline: 'none' }} />
                            <button className="btn-apply" style={{ padding: '0 20px', borderRadius: 10, border: '1px solid var(--color-text)', background: 'transparent', fontWeight: 700, cursor: 'pointer' }}>{t('cart.apply')}</button>
                        </div>
                    </aside>
                </div>
            </div>

            <CheckoutModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                totalPrice={totalPrice}
                items={items}
            />

            <style>{`
                .cart-item:hover { border-color: var(--color-accent) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .v-tag { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; }
                .checkout-btn:hover { transform: translateY(-3px); filter: brightness(1.1); }
                @media (max-width: 991px) {
                    .cart-grid { grid-template-columns: 1fr; }
                    .cart-summary-section { order: -1; }
                }
            `}</style>
        </div>
    );
};

export default CartPage;
