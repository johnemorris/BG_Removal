import { ShadowSettings } from '@/lib/engine/shadowRenderer';

export type MarketplacePlatform = 'amazon' | 'shopify' | 'ebay' | 'etsy' | 'instagram' | 'custom';

export interface MarketplacePreset {
  id: string;
  name: string;
  platform: MarketplacePlatform;
  badge: string;
  description: string;
  width: number;
  height: number;
  aspectRatio: string;
  fillPercentage: number; // e.g. 85 = 85%
  backgroundColor: string; // hex
  shadow: ShadowSettings;
  complianceRules: string[];
}

export const MARKETPLACE_PRESETS: MarketplacePreset[] = [
  {
    id: 'amazon-compliance',
    name: 'Amazon Compliance',
    platform: 'amazon',
    badge: 'Amazon 100% Compliant',
    description: 'Meets Amazon main photo standards: pure RGB(255,255,255) white, 85% subject frame fill, and auto-centered bounds.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    fillPercentage: 85,
    backgroundColor: '#ffffff',
    shadow: {
      enabled: false,
      opacity: 0,
      blur: 0,
      angle: 90,
      distance: 0,
      color: '#000000',
    },
    complianceRules: [
      'Pure #FFFFFF background (RGB 255, 255, 255)',
      'Product fills exactly 85% of frame (Amazon Requirement)',
      'Centered bounding box with uniform margins',
      'No drop shadows, watermarks, or text',
      '2000×2000 px High-Res Zoomable Canvas',
    ],
  },
  {
    id: 'shopify-hero',
    name: 'Shopify Hero Product',
    platform: 'shopify',
    badge: 'Shopify Recommended',
    description: 'Clean modern e-commerce hero shot with soft floor contact shadow and 2048×2048 crisp resolution.',
    width: 2048,
    height: 2048,
    aspectRatio: '1:1',
    fillPercentage: 85,
    backgroundColor: '#ffffff',
    shadow: {
      enabled: true,
      opacity: 0.22,
      blur: 20,
      angle: 90,
      distance: 16,
      color: '#000000',
    },
    complianceRules: [
      '2048×2048 px Shopify Gold Standard',
      'Soft natural floor contact shadow',
      '85% frame fill with balanced padding',
      'Centered product subject',
    ],
  },
  {
    id: 'ebay-standard',
    name: 'eBay Standard Listing',
    platform: 'ebay',
    badge: 'eBay 1:1 Standard',
    description: 'Compliant with eBay seller image requirements: pure white background and centered 2000×2000 square frame.',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    fillPercentage: 85,
    backgroundColor: '#ffffff',
    shadow: {
      enabled: false,
      opacity: 0,
      blur: 0,
      angle: 90,
      distance: 0,
      color: '#000000',
    },
    complianceRules: [
      'Pure #FFFFFF neutral background',
      '2000×2000 px High-Res Zoom',
      '85% product fill with uniform margins',
      'Auto-centered product bounds',
    ],
  },
  {
    id: 'etsy-gallery',
    name: 'Etsy 4:3 Gallery',
    platform: 'etsy',
    badge: 'Etsy 4:3 Standard',
    description: 'Optimized for Etsy search results and product thumbnails using the recommended 4:3 aspect ratio (2000×1500).',
    width: 2000,
    height: 1500,
    aspectRatio: '4:3',
    fillPercentage: 80,
    backgroundColor: '#ffffff',
    shadow: {
      enabled: false,
      opacity: 0,
      blur: 0,
      angle: 90,
      distance: 0,
      color: '#000000',
    },
    complianceRules: [
      '2000×1500 px (4:3) Search Thumbnail Ratio',
      '80% frame fill preventing thumbnail clipping',
      'Clean pure white background',
      'Centered composition',
    ],
  },
  {
    id: 'instagram-square',
    name: 'Instagram Square (1:1)',
    platform: 'instagram',
    badge: 'Instagram 1:1',
    description: 'Standard 1080×1080 social media feed post with clean auto-centered subject and 80% padding.',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    fillPercentage: 80,
    backgroundColor: '#ffffff',
    shadow: {
      enabled: false,
      opacity: 0,
      blur: 0,
      angle: 90,
      distance: 0,
      color: '#000000',
    },
    complianceRules: [
      '1080×1080 px Square Feed Standard',
      '80% fill leaving generous breathing room',
      'Centered product placement',
    ],
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story / Reel (9:16)',
    platform: 'instagram',
    badge: 'Instagram 9:16',
    description: 'Vertical 1080×1920 canvas formatted for Instagram Stories, TikTok, and Reels with smart vertical centering.',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    fillPercentage: 75,
    backgroundColor: '#ffffff',
    shadow: {
      enabled: false,
      opacity: 0,
      blur: 0,
      angle: 90,
      distance: 0,
      color: '#000000',
    },
    complianceRules: [
      '1080×1920 px Full Vertical (9:16)',
      '75% fill avoiding story UI header/footer cutoffs',
      'Smart optical vertical & horizontal centering',
    ],
  },
];

export const FILL_PRESET_OPTIONS = [
  { value: 75, label: '75% (Relaxed)' },
  { value: 85, label: '85% (Amazon Std)' },
  { value: 90, label: '90% (Tight)' },
  { value: 100, label: '100% (Full Frame)' },
];
