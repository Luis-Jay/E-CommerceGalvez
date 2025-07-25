import { defineStore } from 'pinia'
import router from '@/router'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentStatus: '' as 'idle' | 'processing' | 'success' | 'error',
    checkoutUrl: '',
    error: ''
  }),

  actions: {
    async createCheckout(amount: number, description: string) {
      this.paymentStatus = 'processing'
      try {
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + btoa('pk_test_2mu7hHk3XidpUfXSPi2bwMT6:'), // Replace!
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              attributes: {
                send_email_receipt: true,
                show_description: true,
                show_line_items: true,
                cancel_url: `${window.location.origin}/cancel`,
                success_url: `${window.location.origin}/success`,
                line_items: [
                  {
                    currency: 'PHP',
                    amount: amount * 100, // centavos
                    description,
                    name: 'Sample Product',
                    quantity: 1
                  }
                ],
                payment_method_types: ['gcash', 'card']
              }
            }
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.detail || 'Checkout failed')
        }

        this.checkoutUrl = data.data.attributes.checkout_url
        this.paymentStatus = 'success'

        // Redirect to PayMongo checkout page
        window.location.href = this.checkoutUrl
      } catch (err: any) {
        this.error = err.message || 'Something went wrong'
        this.paymentStatus = 'error'
        router.push('/cancel')
      }
    }
  }
})
