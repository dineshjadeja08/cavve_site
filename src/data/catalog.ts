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
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1400&q=90', // Men's black tee editorial
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=90',
    ],
    copy: 'A fundamental silhouette. Engineered for the modern man who values restraint over noise.',
    details: ['240 GSM Compact Cotton', 'Boxy oversized fit', 'Double-needle structural seams', 'Tonal CAVVE embroidery'],
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
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=90', // Men's beige tee
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=90',
    ],
    copy: 'The architectural foundation of a disciplined wardrobe. Muted tones, maximum impact.',
    details: ['240 GSM heavyweight cotton', 'Oversized block pattern', 'Pre-shrunk for lifecycle stability', 'Seamless side construction'],
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
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=90', // Men's white tee editorial
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1400&q=90',
    ],
    copy: 'Clinical white. Pure structure. An essential repetition for the focused professional.',
    details: ['240 GSM organic long-staple cotton', 'Relaxed silhouette', 'Durable high-density rib neck', 'Breathable structural drape'],
  },
]

export const journalPosts = [
  {
    title: 'Architecture of Men',
    date: 'Launch Essay',
    excerpt: 'Why disciplined wardrobes remove noise from ambitious days. A deep dive into the CAVVE philosophy.',
  },
  {
    title: 'The 240 GSM Protocol',
    date: 'Fabric Notes',
    excerpt: 'A close look at why heavyweight cotton is the only choice for the modern man.',
  },
  {
    title: 'Quiet Presence',
    date: 'Field Notes',
    excerpt: 'How restraint in dress leads to maximum presence in the room.',
  },
]
