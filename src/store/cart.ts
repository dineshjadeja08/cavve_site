import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../data/catalog'

export type CartItem = {
  product: Product
  size: string
  quantity: number
}

type CommerceState = {
  cart: CartItem[]
  wishlist: string[]
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product, size?: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  removeFromCart: (id: string, size: string) => void
  toggleWishlist: (id: string) => void
  clearCart: () => void
}

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      addToCart: (product, size = 'M') =>
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id && item.size === size)
          const newCart = existing
            ? state.cart.map((item) =>
                item.product.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...state.cart, { product, size, quantity: 1 }]
          
          return { cart: newCart, isCartOpen: true }
        }),
      updateQuantity: (id, size, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) => (item.product.id === id && item.size === size ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        })),
      removeFromCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== id || item.size !== size),
        })),
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((item) => item !== id)
            : [...state.wishlist, id],
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cavve-commerce' },
  ),
)
