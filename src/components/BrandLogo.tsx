interface BrandLogoProps {
  className?: string;
  size?: 'md' | 'lg';
}

export const BrandLogo = ({ className = '', size = 'md' }: BrandLogoProps) => (
  <span className={`brand-lockup brand-${size} ${className}`}>
    <picture>
      <source type="image/webp" srcSet="/brand-logo-240.webp 240w, /brand-logo-480.webp 480w" sizes={size === 'lg' ? '160px' : '104px'} />
      <img src="/brand-logo-240.png" alt="Clean Corners Housekeeping Services" width="240" height="177" decoding="async" />
    </picture>
  </span>
);
