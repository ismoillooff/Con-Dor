import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color?: string;
    size?: string;
    sub?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (uniqueKey: string) => void;
    updateQuantity: (uniqueKey: string, delta: number) => void;
    clearCart: () => void;
    itemsCount: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate a unique key for items with same ID but different variants
const getUniqueKey = (item: any) => `${item.id}-${item.size || ''}-${item.color || ''}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any, quantity = 1) => {
        setItems(prev => {
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.image || product.image || '',
                quantity,
                color: product.selectedColor || product.color,
                size: product.selectedSize || product.size,
                sub: product.sub
            };

            const key = getUniqueKey(newItem);
            const existingIndex = prev.findIndex(item => getUniqueKey(item) === key);

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (uniqueKey: string) => {
        setItems(prev => prev.filter(item => getUniqueKey(item) !== uniqueKey));
    };

    const updateQuantity = (uniqueKey: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (getUniqueKey(item) === uniqueKey) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setItems([]);

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemsCount,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
