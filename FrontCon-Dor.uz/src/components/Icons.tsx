import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
    strokeWidth?: number;
    style?: React.CSSProperties;
}

const defaultProps: IconProps = { size: 20, strokeWidth: 2 };

const icon = (paths: React.ReactNode, props: IconProps = {}) => {
    const { size = defaultProps.size, className, strokeWidth = defaultProps.strokeWidth, style } = props;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={style}
        >
            {paths}
        </svg>
    );
};

// ===== NAVIGATION =====
export const SearchIcon = (p: IconProps = {}) => icon(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>, p);
export const UserIcon = (p: IconProps = {}) => icon(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, p);
export const ShoppingBagIcon = (p: IconProps = {}) => icon(<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>, p);
export const PhoneIcon = (p: IconProps = {}) => icon(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />, p);
export const MailIcon = (p: IconProps = {}) => icon(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, p);
export const ChevronDownIcon = (p: IconProps = {}) => icon(<polyline points="6 9 12 15 18 9" />, p);
export const ChevronLeftIcon = (p: IconProps = {}) => icon(<polyline points="15 18 9 12 15 6" />, p);
export const ChevronRightIcon = (p: IconProps = {}) => icon(<polyline points="9 18 15 12 9 6" />, p);
export const ChevronUpIcon = (p: IconProps = {}) => icon(<polyline points="18 15 12 9 6 15" />, p);
export const ArrowRightIcon = (p: IconProps = {}) => icon(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>, p);
export const MenuIcon = (p: IconProps = {}) => icon(<><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>, p);
export const XIcon = (p: IconProps = {}) => icon(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, p);
export const GlobeIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, p);

// ===== THEME =====
export const SunIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>, p);
export const MoonIcon = (p: IconProps = {}) => icon(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />, p);

// ===== SOCIAL =====
export const InstagramIcon = (p: IconProps = {}) => icon(<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, p);
export const FacebookIcon = (p: IconProps = {}) => icon(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />, p);
export const TelegramIcon = (p: IconProps = {}) => icon(<path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 6.75a2.25 2.25 0 0 0 .126 4.112l4.752 1.582 1.77 5.9a2.28 2.28 0 0 0 4.154.2l3.1-4.426 4.896 3.774a2.25 2.25 0 0 0 3.61-1.464l3.75-18.25a2.25 2.25 0 0 0-2.846-2.393zm-10.435 12.639l-1.035 4.83a.75.75 0 0 1-1.378-.06l-1.221-4.07 10.94-6.96a.375.375 0 0 1 .457.593l-7.766 5.667z" />, p);

// ===== CLOTHING CATEGORY =====
export const ShirtIcon = (p: IconProps = {}) => icon(<><path d="M20.38 3.46L16 2H8L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10h12V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></>, p);
export const HatIcon = (p: IconProps = {}) => icon(<><path d="M2 18h20" /><path d="M4 18c0-4 3.5-8 8-8s8 4 8 8" /><path d="M12 10V6" /><circle cx="12" cy="4" r="2" /></>, p);
export const PantsIcon = (p: IconProps = {}) => icon(<><path d="M5 2h14v6l-3 14h-2l-2-10-2 10H8L5 8V2z" /></>, p);
export const JacketIcon = (p: IconProps = {}) => icon(<><path d="M16 2H8l-4 4v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-4-4z" /><path d="M12 2v8" /><path d="M4 6h4" /><path d="M16 6h4" /></>, p);
export const UmbrellaIcon = (p: IconProps = {}) => icon(<><path d="M23 12a11.05 11.05 0 0 0-22 0" /><path d="M12 12v9a3 3 0 0 0 6 0" /><line x1="12" y1="2" x2="12" y2="3" /></>, p);
export const BootIcon = (p: IconProps = {}) => icon(<><path d="M7 22h10" /><path d="M7 22V10l-3-2V6h4V2h8v4h4v2l-3 2v12" /><path d="M5 10h14" /></>, p);
export const SocksIcon = (p: IconProps = {}) => icon(<><path d="M6 2v8c0 2.2 1.8 4 4 4h0c2.2 0 4 1.8 4 4v0c0 2.2 1.8 4 4 4h0" /><path d="M8 2v6c0 1.1.9 2 2 2h0" /></>, p);
export const GlovesIcon = (p: IconProps = {}) => icon(<><path d="M7 12V4a2 2 0 0 1 4 0v6" /><path d="M11 10V2a2 2 0 0 1 4 0v8" /><path d="M15 8V4a2 2 0 0 1 4 0v10c0 4-3 7-7 8" /><path d="M7 12c-3 0-4 3-4 5v1h8" /></>, p);
export const CrosshairIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></>, p);
export const GlassesIcon = (p: IconProps = {}) => icon(<><circle cx="6" cy="14" r="4" /><circle cx="18" cy="14" r="4" /><path d="M10 14h4" /><path d="M2 14h0" /><path d="M22 14h0" /><path d="M6 10V6" /><path d="M18 10V6" /></>, p);

// ===== EQUIPMENT CATEGORY =====
export const ShieldIcon = (p: IconProps = {}) => icon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, p);
export const TargetIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>, p);
export const KnifeIcon = (p: IconProps = {}) => icon(<><path d="M14.5 2L6 10.5V14h3.5L18 5.5" /><path d="M17.5 2.5l4 4" /><path d="M2 22l6-6" /></>, p);
export const ToolIcon = (p: IconProps = {}) => icon(<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>, p);
export const FlashlightIcon = (p: IconProps = {}) => icon(<><path d="M18 6L6 18" /><path d="M8 4l4 4-6 6-4-4z" /><path d="M16 12l4 4-6 6-4-4z" /></>, p);
export const BatteryIcon = (p: IconProps = {}) => icon(<><rect x="2" y="7" width="18" height="10" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /></>, p);
export const BinocularsIcon = (p: IconProps = {}) => icon(<><circle cx="7" cy="14" r="5" /><circle cx="17" cy="14" r="5" /><path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" /><path d="M12 14v-4" /></>, p);
export const WatchIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="7" /><polyline points="12 9 12 12 13.5 13.5" /><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" /></>, p);

// ===== BACKPACK CATEGORY =====
export const BackpackIcon = (p: IconProps = {}) => icon(<><path d="M4 20V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /><path d="M8 14h8" /><path d="M8 18h8" /></>, p);
export const BriefcaseIcon = (p: IconProps = {}) => icon(<><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>, p);
export const WalletIcon = (p: IconProps = {}) => icon(<><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12a2 2 0 0 0 2 2h14v-4" /><circle cx="18" cy="14" r="1" /></>, p);
export const DropletIcon = (p: IconProps = {}) => icon(<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />, p);

// ===== SURVIVAL & CAMPING =====
export const TentIcon = (p: IconProps = {}) => icon(<><path d="M3 22l9-18 9 18H3z" /><path d="M12 4v18" /></>, p);
export const CampfireIcon = (p: IconProps = {}) => icon(<><path d="M12 2c-2 4-4 6-4 10a4 4 0 0 0 8 0c0-4-2-6-4-10z" /><path d="M5 22h14" /><path d="M8 22l4-8 4 8" /></>, p);
export const FirstAidIcon = (p: IconProps = {}) => icon(<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>, p);
export const CompassIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>, p);
export const ThermometerIcon = (p: IconProps = {}) => icon(<><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></>, p);
export const SunriseIcon = (p: IconProps = {}) => icon(<><path d="M17 18a5 5 0 0 0-10 0" /><line x1="12" y1="2" x2="12" y2="9" /><line x1="4.22" y1="10.22" x2="5.64" y2="11.64" /><line x1="1" y1="18" x2="3" y2="18" /><line x1="21" y1="18" x2="23" y2="18" /><line x1="18.36" y1="11.64" x2="19.78" y2="10.22" /><line x1="23" y1="22" x2="1" y2="22" /><polyline points="8 6 12 2 16 6" /></>, p);
export const BedIcon = (p: IconProps = {}) => icon(<><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 16h20" /><path d="M6 8v4" /></>, p);
export const UtensilsIcon = (p: IconProps = {}) => icon(<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" /></>, p);
export const ChairIcon = (p: IconProps = {}) => icon(<><path d="M19 10V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" /><rect x="3" y="10" width="18" height="4" rx="1" /><path d="M5 14v6" /><path d="M19 14v6" /><path d="M5 20h14" /></>, p);

// ===== TRUST / USP =====
export const TruckIcon = (p: IconProps = {}) => icon(<><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>, p);
export const ShieldCheckIcon = (p: IconProps = {}) => icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>, p);
export const CheckCircleIcon = (p: IconProps = {}) => icon(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>, p);
export const LockIcon = (p: IconProps = {}) => icon(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, p);
export const ZapIcon = (p: IconProps = {}) => icon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, p);
export const AwardIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>, p);
export const StarIcon = (p: IconProps = {}) => icon(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, p);
export const TrashIcon = (p: IconProps = {}) => icon(<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></>, p);
export const CreditCardIcon = (p: IconProps = {}) => icon(<><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, p);

// ===== MISC =====
export const PackageIcon = (p: IconProps = {}) => icon(<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>, p);
export const SmileIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>, p);
export const TrophyIcon = (p: IconProps = {}) => icon(<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V10" /><path d="M14 22V10" /><rect x="6" y="2" width="12" height="8" rx="1" /></>, p);
export const HeartIcon = (p: IconProps = {}) => icon(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, p);
export const ShareIcon = (p: IconProps = {}) => icon(<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></>, p);
export const RefreshCcwIcon = (p: IconProps = {}) => icon(<><path d="M1 4v6h6" /><path d="M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></>, p);
export const MinusIcon = (p: IconProps = {}) => icon(<line x1="5" y1="12" x2="19" y2="12" />, p);
export const PlusIcon = (p: IconProps = {}) => icon(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, p);
export const CheckIcon = (p: IconProps = {}) => icon(<polyline points="20 6 9 17 4 12" />, p);
export const PlayIcon = (p: IconProps = {}) => {
    const { size = 24, className } = p;
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="5 3 19 12 5 21 5 3" /></svg>;
};
export const SendIcon = (p: IconProps = {}) => icon(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>, p);
export const MapPinIcon = (p: IconProps = {}) => icon(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>, p);
export const ClockIcon = (p: IconProps = {}) => icon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, p);
export const BeltIcon = (p: IconProps = {}) => icon(<><rect x="2" y="9" width="20" height="6" rx="2" /><circle cx="12" cy="12" r="1.5" /></>, p);
export const RopeIcon = (p: IconProps = {}) => icon(<><path d="M4 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M4 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M4 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></>, p);
export const HammerIcon = (p: IconProps = {}) => icon(<><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" /><path d="M17.64 15L22 10.64" /><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V6.5L14.5 2.5 12 5l-1-1-3 3 1 1-1 1 3 3 1-1 1 1z" /></>, p);
export const HelmetIcon = (p: IconProps = {}) => icon(<><path d="M2 17h20" /><path d="M4 17c0-6 3.5-12 8-12s8 6 8 12" /><path d="M7 17v-2a5 5 0 0 1 10 0v2" /></>, p);

// ===== HUNTING =====
export const HuntingIcon = (p: IconProps = {}) => icon(<><path d="M2 22l10-10" /><path d="M16 8l-4 4" /><circle cx="18" cy="6" r="4" /></>, p);
