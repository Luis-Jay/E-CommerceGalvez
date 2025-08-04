import { defineStore } from 'pinia'
import type { CartItem } from './cartStore'

export interface Order {
  orderId: string
  date: string
  status: string
  total: number
  items: CartItem[]
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[]
  }),
  actions: {
    loadOrders() {
      const savedOrders = localStorage.getItem('orders')
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders)
      }
    },
    addOrder(items: CartItem[], total: number) {
      const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`
      const date = new Date().toLocaleDateString()

      const newOrder: Order = {
        orderId,
        date,
        status: 'Paid', 
        total,
        items
      }

      this.orders.push(newOrder)
      localStorage.setItem('orders', JSON.stringify(this.orders))
    },
    clearOrders() {
      this.orders = []
      localStorage.removeItem('orders')
    }
  }
})
