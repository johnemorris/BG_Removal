export interface SampleImage {
  id: string;
  name: string;
  category: 'Product' | 'Portrait' | 'Automotive' | 'Animals';
  thumbUrl: string;
  originalUrl: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'image' | 'transparent';
  value: string; // CSS color, gradient string, or image URL
  previewBg: string;
  textColor?: string;
  eCommerceBadge?: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-sneaker',
    name: 'Sneaker (E-Commerce)',
    category: 'Product',
    thumbUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'sample-portrait',
    name: 'Model Portrait',
    category: 'Portrait',
    thumbUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'sample-camera',
    name: 'Vintage Camera',
    category: 'Product',
    thumbUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'sample-pet',
    name: 'Golden Retriever',
    category: 'Animals',
    thumbUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'sample-car',
    name: 'Classic Porsche',
    category: 'Automotive',
    thumbUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90',
  },
];

export const COLOR_PRESETS: BackgroundPreset[] = [
  {
    id: 'bg-transparent',
    name: 'Transparent',
    type: 'transparent',
    value: 'transparent',
    previewBg: 'bg-transparency-grid',
  },
  {
    id: 'bg-amazon-white',
    name: 'Amazon Pure White',
    type: 'color',
    value: '#ffffff',
    previewBg: '#ffffff',
    eCommerceBadge: 'Amazon / eBay Standard',
  },
  {
    id: 'bg-studio-gray',
    name: 'Studio Soft Gray',
    type: 'color',
    value: '#f1f5f9',
    previewBg: '#f1f5f9',
  },
  {
    id: 'bg-charcoal',
    name: 'Slate Charcoal',
    type: 'color',
    value: '#1e293b',
    previewBg: '#1e293b',
  },
  {
    id: 'bg-pure-black',
    name: 'Onyx Black',
    type: 'color',
    value: '#020617',
    previewBg: '#020617',
  },
  {
    id: 'bg-powder-blue',
    name: 'Pastel Blue',
    type: 'color',
    value: '#e0f2fe',
    previewBg: '#e0f2fe',
  },
  {
    id: 'bg-soft-blush',
    name: 'Blush Rose',
    type: 'color',
    value: '#fce7f3',
    previewBg: '#fce7f3',
  },
  {
    id: 'bg-warm-sand',
    name: 'Warm Sand',
    type: 'color',
    value: '#fef3c7',
    previewBg: '#fef3c7',
  },
  {
    id: 'bg-mint',
    name: 'Fresh Mint',
    type: 'color',
    value: '#d1fae5',
    previewBg: '#d1fae5',
  },
  {
    id: 'bg-brand-teal',
    name: 'Teal Signature',
    type: 'color',
    value: '#0f766e',
    previewBg: '#0f766e',
  },
];

export const GRADIENT_PRESETS: BackgroundPreset[] = [
  {
    id: 'grad-sunset',
    name: 'Warm Sunset',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    previewBg: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
  },
  {
    id: 'grad-ocean',
    name: 'Deep Pacific',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #1e1b4b 100%)',
    previewBg: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #1e1b4b 100%)',
  },
  {
    id: 'grad-studio-radial',
    name: 'Studio Spotlight',
    type: 'gradient',
    value: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #cbd5e1 100%)',
    previewBg: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #cbd5e1 100%)',
  },
  {
    id: 'grad-aurora',
    name: 'Nordic Aurora',
    type: 'gradient',
    value: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)',
    previewBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)',
  },
  {
    id: 'grad-cyber',
    name: 'Cyber Violet',
    type: 'gradient',
    value: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    previewBg: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
  },
  {
    id: 'grad-minimal-gray',
    name: 'Minimal Vignette',
    type: 'gradient',
    value: 'radial-gradient(circle, #f8fafc 40%, #94a3b8 100%)',
    previewBg: 'radial-gradient(circle, #f8fafc 40%, #94a3b8 100%)',
  },
];

export const BACKDROP_SCENES: BackgroundPreset[] = [
  {
    id: 'scene-marble',
    name: 'Marble Countertop',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    previewBg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: 'scene-wood-desk',
    name: 'Oak Wood Surface',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    previewBg: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: 'scene-modern-loft',
    name: 'Modern Studio Loft',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    previewBg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: 'scene-bokeh-cafe',
    name: 'Warm Cafe Bokeh',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    previewBg: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: 'scene-botanical',
    name: 'Botanical Garden',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    previewBg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=200&q=60',
  },
];
