import { defineStore } from 'pinia'

export interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    size: string
    color: string
    currentPrice: number
    originalPrice: number
    onSale: boolean
    totalPrice: number
    deliveryOption: string
    deliveryFee: number
}

export interface Services {
    carePackage: boolean
    environmentFriendly: boolean
    goldenGuard: boolean
}



export const useCartStore = defineStore('cart', {
    state: () => ({
        items: (() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            const currentUserEmail = localStorage.getItem('currentUserEmail')
            const currentUser = users.find((u: any) => u.email === currentUserEmail)
            return currentUser ? currentUser.cartItems as CartItem[] : []
        })(),
        services: {} as Services,
        selectedDelivery: 'DPD' as string,
        isPaymentFormVisible: false,
        isPaymentSuccess: false,
        isPaymentError: false,
        isPaymentLoading: false,
        finalTotal: 0,
        couponCode: '',
        couponDiscount: 0,
        paymentForm: {
            firstName: '',
        }
    }),
    getters: {
        totalPrice: (state) => state.items.reduce((total, item) => total + item.currentPrice * item.quantity, 0),
        totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
        subtotal: (state) =>
            state.items.reduce((total, item) => {
              const price = item.currentPrice
              const quantity = item.quantity
              return total + price * quantity
            }, 0),
        deliveryPrice: (state) => {
            // Example: set delivery price based on selectedDelivery
            switch (state.selectedDelivery) {
                case 'DPD': return 312;
                case 'FedEx': return 362;
                case 'UPS': return 275;
                case 'Collect': return 0;
                default: return 0;
            }
        },
        servicesTotal: (state) => {
            let total = 0;
            if (state.services.carePackage) total += 500;
            if (state.services.environmentFriendly) total += 100;
            if (state.services.goldenGuard) total += 250;
            return total;
        },
        discountAmount: (state) => (discount: number) => state.items.reduce((total, item) => total + item.currentPrice * item.quantity, 0) * discount,
        finalTotal: (state) => (discount: number) => {
            const subtotal = state.items.reduce((total, item) => total + item.currentPrice * item.quantity, 0);
            const delivery = (function() {
                switch (state.selectedDelivery) {
                    case 'DPD': return 312;
                    case 'FedEx': return 362;
                    case 'UPS': return 275;
                    case 'Collect': return 0;
                    default: return 0;
                }
            })();
            let services = 0;
            if (state.services.carePackage) services += 500;
            if (state.services.environmentFriendly) services += 100;
            if (state.services.goldenGuard) services += 250;
            const discountAmount = subtotal * discount;
            return subtotal + delivery + services - discountAmount;
        }
    },  

    actions: {
        addItem(item: CartItem) {
            const existingItem = this.items.find(i => i.id === item.id)
            if (existingItem) {
                existingItem.quantity += item.quantity
            } else {
                this.items.push(item)
            }
        },
        removeItem(id: number) {
            this.items = this.items.filter(i => i.id !== id)
        },
        updateItemQuantity(id: number, quantity: number) {
            const existingItem = this.items.find(i => i.id === id)
            if (existingItem) {
                existingItem.quantity = quantity
            }
        },
        setDelivery(option: string) {
            this.selectedDelivery = option
        },
        toggleService(service: keyof Services) {
            this.services[service] = !this.services[service]
        },
        clearCart() {
            this.items = []
            this.selectedDelivery = ''
            this.services = {
              carePackage: false,
              environmentFriendly: false,
              goldenGuard: false
            }

            const currentUserEmail = localStorage.getItem('currentUserEmail')
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            const userIndex = users.findIndex((u: any) => u.email === currentUserEmail)
            if (userIndex !== -1) {
                users[userIndex].cartItems = []
                localStorage.setItem('users', JSON.stringify(users))
            }
          }
    }
})