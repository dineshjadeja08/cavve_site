import { supabase } from './supabase'
import type { Product } from '../data/catalog'

export async function fetchDbProducts(): Promise<Product[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(mapDbProductToFrontend)
}

export async function fetchDbProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  return mapDbProductToFrontend(data)
}

function mapDbProductToFrontend(db: any): Product {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    color: db.color || 'Onyx',
    colorHex: db.color_hex || '#000000',
    price: db.price_inr,
    compareAt: db.compare_at_inr || undefined,
    fit: db.fit || 'Oversized',
    gsm: db.gsm || '240 GSM',
    sizes: db.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
    stock: db.stock || 10,
    gallery: db.images || [],
    copy: db.description || '',
    details: db.details || ['240 GSM Compact Cotton', 'Boxy oversized fit', 'Structural integrity']
  }
}
