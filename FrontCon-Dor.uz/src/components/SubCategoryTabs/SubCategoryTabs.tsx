import React from 'react';
import './SubCategoryTabs.css';

interface TabItem {
    label: string;
    value?: string;
    count: number;
}

interface SubCategoryTabsProps {
    items: TabItem[];
    activeItem: string;
    onSelect: (item: string) => void;
    accentColor?: string;
}

export const SubCategoryTabs: React.FC<SubCategoryTabsProps> = React.memo(({
    items,
    activeItem,
    onSelect,
    accentColor = 'var(--color-accent)'
}) => {
    return (
        <div className="sub-tabs-container">
            {items.map((item) => {
                const itemValue = item.value || item.label;
                const isActive = activeItem === itemValue;
                return (
                    <button
                        key={item.label}
                        className={`sub-tab-pill ${isActive ? 'active' : ''}`}
                        onClick={() => onSelect(itemValue)}
                        style={isActive ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                    >
                        <span className="sub-tab-label">{item.label}</span>
                        {item.count > 0 && <span className="sub-tab-count">{item.count}</span>}
                    </button>
                );
            })}
        </div>
    );
});
