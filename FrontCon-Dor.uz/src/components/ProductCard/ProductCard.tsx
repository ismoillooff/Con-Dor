import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingBagIcon, HeartIcon, PlusIcon } from '../Icons';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        name_ru?: string;
        slug: string;
        price: number;
        old_price: number | null;
        badge: string;
        badge_ru?: string;
        rating: number;
        reviews_count: number;
        images: { id: number; image: string; is_primary: boolean }[];
        colors?: string[];
        discount_percent?: number;
    };
    variant?: 'grid' | 'horizontal' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
    const { t, lang } = useLanguage();
    const { addToCart } = useCart();

    const pName = lang === 'ru' ? (product.name_ru || product.name) : product.name;
    const pBadge = lang === 'ru' ? (product.badge_ru || product.badge) : product.badge;
    const primaryImage = product.images.length > 0
        ? product.images.find(img => img.is_primary)?.image || product.images[0].image
        : null;

    if (variant === 'compact') {
        return (
            <Link to={`/product/${product.slug}`} className="p-card-compact">
                <div className="p-card-compact-img">
                    {primaryImage ? <img src={primaryImage} alt={pName} /> : <ShoppingBagIcon size={20} />}
                </div>
                <div className="p-card-compact-info">
                    <h4 className="p-card-compact-name">{pName}</h4>
                    <div className="p-card-compact-price">{product.price.toLocaleString('ru-RU')} {t('common.price')}</div>
                </div>
            </Link>
        );
    }

    return (
        <div className={`p-card p-card-${variant} glass-card fade-in`}>
            <Link to={`/product/${product.slug}`} className="p-card-link">
                <div className="p-card-image-wrapper">
                    {pBadge && (
                        <span className={`p-card-badge ${product.badge.toLowerCase()}`}>
                            {pBadge}
                        </span>
                    )}
                    <div className="p-card-actions-overlay">
                        <button className="p-card-action-btn wish" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <HeartIcon size={18} />
                        </button>
                    </div>
                    {primaryImage ? (
                        <img src={primaryImage} alt={pName} className="p-card-img" loading="lazy" />
                    ) : (
                        <div className="p-card-placeholder">
                            <ShoppingBagIcon size={40} />
                        </div>
                    )}
                    <div className="p-card-hover-actions">
                        <button
                            className="p-card-add-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product as any);
                                toast.success(t('common.added'));
                            }}
                        >
                            <PlusIcon size={18} />
                            <span>{t('common.add_to_cart')}</span>
                        </button>
                    </div>
                </div>

                <div className="p-card-content">
                    <div className="p-card-rating">
                        <div className="p-card-stars">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    size={12}
                                    className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                                />
                            ))}
                        </div>
                        <span className="p-card-reviews">({product.reviews_count})</span>
                    </div>

                    <h3 className="p-card-title">{pName}</h3>

                    <div className="p-card-footer">
                        {product.colors && product.colors.length > 0 && (
                            <div className="p-card-colors">
                                {product.colors.slice(0, 4).map((c, i) => {
                                    // Try to determine color preview
                                    const lowerC = c.toLowerCase();
                                    const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(c);
                                    let previewStyle = {};
                                    if (isHex) previewStyle = { backgroundColor: c };
                                    else if (lowerC === 'qora' || lowerC === 'black') previewStyle = { backgroundColor: '#000' };
                                    else if (lowerC === 'o\'q' || lowerC === 'oq' || lowerC === 'white') previewStyle = { backgroundColor: '#fff', border: '1px solid #ddd' };
                                    else if (lowerC === 'yashil' || lowerC === 'green') previewStyle = { backgroundColor: '#2d5a27' };
                                    else if (lowerC === 'ko\'k' || lowerC === 'kok' || lowerC === 'blue') previewStyle = { backgroundColor: '#1e40af' };
                                    else if (lowerC === 'qizil' || lowerC === 'red') previewStyle = { backgroundColor: '#dc2626' };
                                    else if (lowerC === 'jigarrang' || lowerC === 'brown') previewStyle = { backgroundColor: '#78350f' };
                                    else if (lowerC === 'kulrang' || lowerC === 'gray' || lowerC === 'grey') previewStyle = { backgroundColor: '#6b7280' };

                                    return (
                                        <span
                                            key={i}
                                            className="p-card-color-dot"
                                            style={previewStyle}
                                            title={c}
                                        />
                                    );
                                })}
                                {product.colors.length > 4 && <span className="p-card-colors-more">+{product.colors.length - 4}</span>}
                            </div>
                        )}
                        <div className="p-card-prices">
                            <span className="p-card-price">
                                {product.price.toLocaleString('ru-RU')} <small>{t('common.price')}</small>
                            </span>
                            {product.old_price && (
                                <span className="p-card-old-price">
                                    {product.old_price.toLocaleString('ru-RU')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
