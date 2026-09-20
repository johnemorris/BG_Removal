export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  credits: number;
  costPerImage: string;
  popular?: boolean;
  features: string[];
  cta: string;
  badge?: string;
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  pricePerCredit: string;
  popular?: boolean;
  savings?: string;
}

export const SUBSCRIPTION_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    tagline: 'Ideal for testing out background removal with basic needs.',
    monthlyPrice: 0,
    annualPrice: 0,
    credits: 3,
    costPerImage: '$0.00',
    features: [
      '3 High-Resolution HD credits',
      'Unlimited standard web preview downloads',
      'Interactive Before/After comparison',
      'Solid colors & studio gradients',
      'Standard processing speed',
      'Personal non-commercial use',
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Great for independent sellers, creators, and freelancers.',
    monthlyPrice: 9,
    annualPrice: 7,
    credits: 40,
    costPerImage: '$0.22',
    features: [
      '40 High-Resolution credits per month',
      'Full 4K Ultra-HD resolution export',
      'Realistic e-commerce drop shadows',
      'Erase & Restore refinement brush',
      'API access (50 requests / min)',
      'Commercial usage license',
      'Rollover unused credits (up to 5x)',
    ],
    cta: 'Start with Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'The gold standard for e-commerce stores, agencies & photographers.',
    monthlyPrice: 29,
    annualPrice: 23,
    credits: 200,
    costPerImage: '$0.14',
    popular: true,
    badge: 'Most Popular',
    features: [
      '200 High-Resolution credits per month',
      'Batch processing up to 20 images at once',
      'Full 4K & transparent WebP/PNG export',
      'High-speed priority AI inference queue',
      'E-commerce white backdrop automations',
      'Developer API with 500 requests / min',
      'Priority email & chat support',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Built for high-volume catalogs, brands, and automated pipelines.',
    monthlyPrice: 79,
    annualPrice: 63,
    credits: 800,
    costPerImage: '$0.09',
    badge: 'Best Value',
    features: [
      '800 High-Resolution credits per month',
      'Unlimited bulk batch processing',
      'Custom webhook integrations',
      'Team workspace (up to 5 members)',
      'Dedicated API rate limits & SLA (99.9%)',
      'Custom AI shadow & border presets',
      'Dedicated account manager',
    ],
    cta: 'Choose Business',
  },
];

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'pack-10',
    credits: 10,
    price: 9,
    pricePerCredit: '$0.90 / credit',
  },
  {
    id: 'pack-50',
    credits: 50,
    price: 35,
    pricePerCredit: '$0.70 / credit',
    popular: true,
    savings: 'Save 22%',
  },
  {
    id: 'pack-200',
    credits: 200,
    price: 99,
    pricePerCredit: '$0.49 / credit',
    savings: 'Save 45%',
  },
  {
    id: 'pack-1000',
    credits: 1000,
    price: 299,
    pricePerCredit: '$0.29 / credit',
    savings: 'Save 67%',
  },
];

export const PRICING_FAQS = [
  {
    question: 'How do credits work in ClearCut AI?',
    answer: '1 credit equals 1 high-resolution background removal download (up to 4K resolution). Standard web resolution previews and canvas preview edits are always 100% free and unlimited.',
  },
  {
    question: 'Do unused subscription credits expire?',
    answer: 'No, as long as your subscription remains active, your unused monthly credits roll over month-to-month up to 5 times your monthly allowance.',
  },
  {
    question: 'What is the difference between subscription and pay-as-you-go?',
    answer: 'Subscriptions offer our lowest per-image prices (starting at $0.09/image) and recur monthly or annually. Pay-as-you-go credit packs are one-time purchases with zero recurring charges, valid for 2 full years.',
  },
  {
    question: 'Can I use ClearCut AI via API?',
    answer: 'Yes! All paid plans and pay-as-you-go credit packs include full REST API access. You can generate API keys directly in your dashboard with code snippets for Python, Node.js, PHP, and cURL.',
  },
  {
    question: 'What image formats and resolutions are supported?',
    answer: 'We support JPG, PNG, WebP, and HEIC up to 30MB and up to 50 Megapixels. Exports can be transparent PNG, clean JPEG, or modern WebP format.',
  },
  {
    question: 'Are my images kept private and secure?',
    answer: 'Absolutely. Web studio images are processed client-side or automatically purged within 60 minutes after processing. We never sell, share, or use your photos for model training.',
  },
];
