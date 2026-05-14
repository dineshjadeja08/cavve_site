export type Product = {
  id: string
  slug: string
  name: string
  color: string
  colorHex: string
  price: number
  compareAt?: number
  fit: string
  gsm: string
  sizes: string[]
  stock: number
  gallery: string[]
  copy: string
  details: string[]
}

export const products: Product[] = [
  {
    id: 'tee-jet-black',
    slug: 'jet-black-oversized-tee',
    name: 'Jet Black Oversized Tee',
    color: 'Jet Black',
    colorHex: '#0D0D0D',
    price: 2490,
    compareAt: 2990,
    fit: 'Oversized',
    gsm: '240 GSM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 42,
    gallery: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=90',
    ],
    copy: 'Heavyweight comfort. Quiet confidence.',
    details: ['240 GSM compact cotton', 'Dropped shoulders', 'Soft structured drape', 'Minimal tonal branding'],
  },
  {
    id: 'tee-stone-beige',
    slug: 'stone-beige-oversized-tee',
    name: 'Stone Beige Oversized Tee',
    color: 'Stone Beige',
    colorHex: '#D8CBB8',
    price: 2490,
    compareAt: 2990,
    fit: 'Oversized',
    gsm: '240 GSM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 35,
    gallery: [
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1400&q=90',
    ],
    copy: 'Uniform for disciplined men.',
    details: ['240 GSM heavyweight cotton', 'Oversized block', 'Pre-shrunk finish', 'Muted neutral tone'],
  },
  {
    id: 'tee-soft-white',
    slug: 'soft-white-oversized-tee',
    name: 'Soft White Oversized Tee',
    color: 'Soft White',
    colorHex: '#F5F5F2',
    price: 2490,
    compareAt: 2990,
    fit: 'Oversized',
    gsm: '240 GSM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 28,
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1400&q=90',
    ],
    copy: 'The essential foundation. Zero noise.',
    details: ['240 GSM organic cotton', 'Relaxed silhouette', 'Durable rib neck', 'Breathable heavyweight feel'],
  },
]

export const journalPosts = [
  {
    title: 'The Uniform Mindset',
    date: 'Launch Essay',
    excerpt: 'Why disciplined wardrobes remove noise from ambitious days.',
  },
  {
    title: 'Heavyweight, Not Heavy',
    date: 'Fabric Notes',
    excerpt: 'A close look at 240 GSM cotton, structure, and drape.',
  },
  {
    title: 'Quiet Confidence',
    date: 'Field Notes',
    excerpt: 'How restraint became the most modern form of presence.',
  },
]

