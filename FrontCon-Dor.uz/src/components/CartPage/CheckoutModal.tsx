import React, { useState } from 'react';
import { XIcon, UserIcon, PhoneIcon, MapPinIcon, SendIcon } from '../Icons';
import { api } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    items: any[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalPrice, items }) => {
    const { clearCart } = useCart();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    size: item.size || '',
                    color: item.color || ''
                })),
                full_name: formData.full_name,
                phone: formData.phone,
                address: formData.address,
                note: formData.note
            };

            await api.post('/api/orders/', orderData);
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({ full_name: '', phone: '', address: '', note: '' });
            }, 3000);
        } catch (err: any) {
            console.error('Order creation error:', err);
            setError(err.message || t('checkout.error'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content success-state" onClick={e => e.stopPropagation()}>
                    <div className="success-icon">✓</div>
                    <h2>{t('checkout.success_title')}</h2>
                    <p>{t('checkout.success_desc')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h3>{t('checkout.title')}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <XIcon size={20} />
                    </button>
                </header>

                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            <UserIcon size={16} />
                            <span>{t('checkout.name')}</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('checkout.name_placeholder')}
                            required
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <PhoneIcon size={16} />
                            <span>{t('checkout.phone')}</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="+998 90 123 45 67"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <MapPinIcon size={16} />
                            <span>{t('checkout.address')}</span>
                        </label>
                        <textarea
                            placeholder={t('checkout.address_placeholder')}
                            required
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>{t('checkout.note')}</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('checkout.note_placeholder')}
                            value={formData.note}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="order-summary">
                        <div className="summary-row">
                            <span>{t('cart.total_amount')}:</span>
                            <strong>{totalPrice.toLocaleString('ru-RU')} {t('common.price')}</strong>
                        </div>
                    </div>

                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? (
                            t('checkout.sending')
                        ) : (
                            <>
                                <SendIcon size={18} />
                                <span>{t('checkout.submit')}</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
