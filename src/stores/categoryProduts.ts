import { defineStore } from 'pinia'


export const useCategoryProductsStore = defineStore('categoryProducts', {
    state: () => ({
        categoryProductListsMobile: [
            {
                id: 5,
                name: 'Smartphones',
                icon: 'https://img.lazcdn.com/g/p/e0d94f066ffbdac16fc6bbd8f95dcad8.png_400x400q80.png_.avif',
                products: [],
                price: 399,
                originalPrice: 499,
                discount: 20,
                image: 'https://img.lazcdn.com/g/p/e0d94f066ffbdac16fc6bbd8f95dcad8.png_400x400q80.png_.avif'
            },
            {
                id: 6,
                name: 'Laptops',
                icon: 'https://img.lazcdn.com/g/p/f3646215fd441e0c01e8b4a69e5f6e0b.png_400x400q80.png_.avif',
                products: [],
                price: 899,
                originalPrice: 1099,
                discount: 18,
                image: 'https://img.lazcdn.com/g/p/f3646215fd441e0c01e8b4a69e5f6e0b.png_400x400q80.png_.avif'
            },
            {
                id: 7,
                name: 'Headphones',
                icon: 'https://img.lazcdn.com/g/p/ea6bd47d8c30c170da5b7f217b1352d0.png_400x400q80.png_.avif',
                products: [],
                price: 59,
                originalPrice: 79,
                discount: 25,
                image: 'https://img.lazcdn.com/g/p/ea6bd47d8c30c170da5b7f217b1352d0.png_400x400q80.png_.avif'
            },
            {
                id: 8,
                name: 'Gaming Consoles',
                icon: 'https://img.lazcdn.com/g/p/cfb29c8e301c137aa92755e23a8a13ee.png_400x400q80.png_.avif',
                products: [],
                price: 499,
                originalPrice: 549,
                discount: 9,
                image: 'https://img.lazcdn.com/g/p/cfb29c8e301c137aa92755e23a8a13ee.png_400x400q80.png_.avif'
            },
            {
                id: 9,
                name: 'Smartwatches',
                icon: 'https://img.lazcdn.com/g/p/6d12c7865145eb69fc6e8f8263163191.png_400x400q80.png_.avif',
                products: [],
                price: 149,
                originalPrice: 199,
                discount: 25,
                image: 'https://img.lazcdn.com/g/p/6d12c7865145eb69fc6e8f8263163191.png_400x400q80.png_.avif'
            },
            {
                id: 10,
                name: 'Bluetooth Speakers',
                icon: 'https://img.lazcdn.com/g/p/f548ba5be262a43859e1d44e8960ef87.png_400x400q80.png_.avif',
                products: [],
                price: 89,
                originalPrice: 129,
                discount: 31,
                image: 'https://img.lazcdn.com/g/p/f548ba5be262a43859e1d44e8960ef87.png_400x400q80.png_.avif'
            },
            {
                id: 11,
                name: 'Monitors',
                icon: 'https://img.lazcdn.com/g/p/1e28bfbf6d6b42a592ed028d22240d90.png_400x400q80.png_.avif',
                products: [],
                price: 229,
                originalPrice: 299,
                discount: 23,
                image: 'https://img.lazcdn.com/g/p/1e28bfbf6d6b42a592ed028d22240d90.png_400x400q80.png_.avif'
            },
            {
                id: 12,
                name: 'Keyboards',
                icon: 'https://img.lazcdn.com/g/p/f97e353edc77606c49d5736be4bbad46.png_400x400q80.png_.avif',
                products: [],
                price: 45,
                originalPrice: 59,
                discount: 24,
                image: 'https://img.lazcdn.com/g/p/f97e353edc77606c49d5736be4bbad46.png_400x400q80.png_.avif'
            },
            {
                id: 13,
                name: 'Power Banks',
                icon: 'https://img.lazcdn.com/g/p/1194b06515be6fc1399e2dfaf28a51dc.png_400x400q80.png_.avif',
                products: [],
                price: 35,
                originalPrice: 50,
                discount: 30,
                image: 'https://img.lazcdn.com/g/p/1194b06515be6fc1399e2dfaf28a51dc.png_400x400q80.png_.avif'
            },
            {
                id: 14,
                name: 'CCTV Cameras',
                icon: 'https://img.lazcdn.com/g/p/f25ae0e4206a58fba902c6a177b2f7dc.png_400x400q80.png_.avif',
                products: [],
                price: 199,
                originalPrice: 250,
                discount: 20,
                image: 'https://img.lazcdn.com/g/p/f25ae0e4206a58fba902c6a177b2f7dc.png_400x400q80.png_.avif'
            },
            {
                id: 15,
                name: 'Smart Home Devices',
                icon: 'https://img.lazcdn.com/g/p/1194b06515be6fc1399e2dfaf28a51dc.png_400x400q80.png_.avif',
                products: [],
            }
        ],
        categoryProductListsFashion: [
            {
                id: 1,
                name: 'Clothing',
                icon: 'https://img.lazcdn.com/g/p/d3e71f03e916682274322be6e171dfa4.png_400x400q80.png_.avif',
                products: [],
                price: 100,
                originalPrice: 100,
                discount: 0,    
            },
            {
                id: 2,
                name: 'Shoes',
                icon: 'https://img.lazcdn.com/g/p/d3e71f03e916682274322be6e171dfa4.png_400x400q80.png_.avif',
                products: [],
                price: 100,
            },
            {
                id: 3,
                name: 'Accessories',
                icon: 'https://img.lazcdn.com/g/p/d3e71f03e916682274322be6e171dfa4.png_400x400q80.png_.avif',
                products: [],
                price: 100,
            },
            {
                id: 4,
                name: 'Bags',
                icon: 'https://img.lazcdn.com/g/p/d3e71f03e916682274322be6e171dfa4.png_400x400q80.png_.avif',
                products: [],
                price: 100,
                originalPrice: 100,
                discount: 0,
            },
            {
                id: 5,
                name: 'Watches',
                icon: 'https://img.lazcdn.com/g/p/d3e71f03e916682274322be6e171dfa4.png_400x400q80.png_.avif',
                products: [],
                price: 100,
            }
        ]
    }),
    getters: {
        getCategoryProductLists: (state) => state.categoryProductListsMobile
    },

    actions: {
        init(products: any) {
            this.categoryProductListsMobile = products
        }
    }
})