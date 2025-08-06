export type TemplateCategory =
  | 'Promotions'
  | 'Announcements'
  | 'Holiday / Seasonal'
  | 'Winback'
  | 'Urgency'
  | 'Social Proof'

export interface Template {
  id: string
  title: string
  category: TemplateCategory
  message: string
}

export const templates: Template[] = [
  // 📢 Promotions
  {
    id: 'promo-1',
    title: 'Flash Sale',
    category: 'Promotions',
    message: 'FLASH SALE! 20% off everything today only. Shop now: [link]',
  },
  {
    id: 'promo-2',
    title: 'Exclusive Deal',
    category: 'Promotions',
    message: 'You’ve unlocked an exclusive deal — 15% off your next purchase. Tap here: [link]',
  },
  {
    id: 'promo-3',
    title: 'Buy One Get One',
    category: 'Promotions',
    message: 'BOGO is back! Buy one, get one FREE this week only. Don’t miss it: [link]',
  },
  {
    id: 'promo-4',
    title: 'Free Shipping Promo',
    category: 'Promotions',
    message: 'Free shipping on all orders over $50 — for a limited time only. Start shopping: [link]',
  },
  {
    id: 'promo-5',
    title: 'VIP Offer',
    category: 'Promotions',
    message: 'VIPs get early access to our new collection + 10% off. Preview now: [link]',
  },

  // 📣 Announcements
  {
    id: 'announce-1',
    title: 'New Product Launch',
    category: 'Announcements',
    message: 'Our newest product is here! Be the first to check it out: [link]',
  },
  {
    id: 'announce-2',
    title: 'New Location',
    category: 'Announcements',
    message: 'We’ve moved! Visit our new location and say hi 👋 Find us here: [link]',
  },
  {
    id: 'announce-3',
    title: 'We’re Hiring',
    category: 'Announcements',
    message: 'We’re growing and hiring! Join the team or share with a friend: [link]',
  },
  {
    id: 'announce-4',
    title: 'Updated Hours',
    category: 'Announcements',
    message: 'Heads up: Our hours have changed! Check out the new schedule: [link]',
  },
  {
    id: 'announce-5',
    title: 'New Service Added',
    category: 'Announcements',
    message: 'Exciting news! We now offer [service name]. Learn more here: [link]',
  },

  // 🎄 Holiday / Seasonal
  {
    id: 'holiday-1',
    title: 'Black Friday',
    category: 'Holiday / Seasonal',
    message: 'Black Friday is here — 30% off everything. One day only! Shop now: [link]',
  },
  {
    id: 'holiday-2',
    title: 'New Year Deal',
    category: 'Holiday / Seasonal',
    message: 'Start the new year with savings — 25% off through Jan 1st. Tap here: [link]',
  },
  {
    id: 'holiday-3',
    title: 'Valentine’s Day Special',
    category: 'Holiday / Seasonal',
    message: 'Give the gift of [product] — Valentine’s Day sale ends soon 💝 Shop: [link]',
  },
  {
    id: 'holiday-4',
    title: 'Summer Sale',
    category: 'Holiday / Seasonal',
    message: '☀️ Summer savings are here — 20% off all items until Sunday. Shop now: [link]',
  },
  {
    id: 'holiday-5',
    title: 'Holiday Hours',
    category: 'Holiday / Seasonal',
    message: 'We’ll be closed on [holiday], but you can still shop online: [link]',
  },

  // 🔄 Winback
  {
    id: 'winback-1',
    title: 'We Miss You',
    category: 'Winback',
    message: 'It’s been a while! Here’s 15% off to welcome you back. Tap to use: [link]',
  },
  {
    id: 'winback-2',
    title: 'Still Thinking?',
    category: 'Winback',
    message: 'Still thinking about it? Here’s a deal to help you decide: [link]',
  },
  {
    id: 'winback-3',
    title: 'Come Back Soon',
    category: 'Winback',
    message: 'Haven’t seen you in a while! Come back and enjoy a little something on us: [link]',
  },
  {
    id: 'winback-4',
    title: 'Last Offer for You',
    category: 'Winback',
    message: 'This is your last chance to claim 20% off. After today, it’s gone! [link]',
  },
  {
    id: 'winback-5',
    title: 'Here If You Need Us',
    category: 'Winback',
    message: 'No pressure, just letting you know we’re here if you need anything: [link]',
  },

  // ⏰ Urgency
  {
    id: 'urgency-1',
    title: 'Ends Tonight',
    category: 'Urgency',
    message: '⏳ Last chance! Sale ends at midnight. Don’t miss out: [link]',
  },
  {
    id: 'urgency-2',
    title: 'Final Hours',
    category: 'Urgency',
    message: 'Only a few hours left to save 25%! Shop before it’s gone: [link]',
  },
  {
    id: 'urgency-3',
    title: 'Almost Gone',
    category: 'Urgency',
    message: 'We’re almost out of stock! Grab your favorites while they last: [link]',
  },
  {
    id: 'urgency-4',
    title: 'Last 10 Spots',
    category: 'Urgency',
    message: 'Only 10 spots left! Secure yours now before it’s too late: [link]',
  },
  {
    id: 'urgency-5',
    title: 'Final Call',
    category: 'Urgency',
    message: 'FINAL CALL — This offer expires in just a few hours. Tap to claim: [link]',
  },

  // ⭐ Social Proof
  {
    id: 'social-1',
    title: 'Top Rated',
    category: 'Social Proof',
    message: 'Rated 4.9 stars by 1,000+ happy customers. Try it for yourself: [link]',
  },
  {
    id: 'social-2',
    title: 'What People Are Saying',
    category: 'Social Proof',
    message: '“Best decision ever!” — Real review from a real customer. See more: [link]',
  },
  {
    id: 'social-3',
    title: 'Trusted by Many',
    category: 'Social Proof',
    message: 'Trusted by over 10,000 people. Join the community today: [link]',
  },
  {
    id: 'social-4',
    title: 'Featured In',
    category: 'Social Proof',
    message: 'As seen in [publication]. See why everyone’s talking: [link]',
  },
  {
    id: 'social-5',
    title: 'Customer Favorite',
    category: 'Social Proof',
    message: 'Our most-loved item is back in stock. See what the hype’s about: [link]',
  },
]
