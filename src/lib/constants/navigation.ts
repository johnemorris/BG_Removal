export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Studio',
    href: '/',
    description: 'Instant AI background removal & studio editor',
  },
  {
    label: 'Collage',
    href: '/collage',
    badge: 'New',
    description: 'Multi-image collage creator with placement, flip & resize',
  },
  {
    label: 'Batch Mode',
    href: '/batch',
    badge: 'Pro',
    description: 'Process up to 20 images at once with uniform presets',
  },
  {
    label: 'Pricing',
    href: '/pricing',
    description: 'Flexible subscriptions & pay-as-you-go credit packs',
  },
  {
    label: 'API Docs',
    href: '/api-docs',
    badge: 'v1.0',
    description: 'REST API & SDKs for automated workflows',
  },
];

export const FOOTER_LINKS = {
  product: [
    { label: 'Background Remover', href: '/' },
    { label: 'Batch Processing', href: '/batch' },
    { label: 'E-commerce Shadows', href: '/?tool=shadow' },
    { label: 'API & Developers', href: '/api-docs' },
    { label: 'Pricing Plans', href: '/pricing' },
  ],
  features: [
    { label: 'White Background for Amazon', href: '/?preset=amazon' },
    { label: 'Portrait Bokeh & Blur', href: '/?preset=blur' },
    { label: 'Drop Shadow Generator', href: '/?tool=shadow' },
    { label: 'Erase & Restore Brush', href: '/?tool=brush' },
    { label: '4K Ultra HD Export', href: '/pricing' },
  ],
  resources: [
    { label: 'API Documentation', href: '/api-docs' },
    { label: 'cURL & Python SDK', href: '/api-docs' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'System Status', href: '#' },
  ],
};
