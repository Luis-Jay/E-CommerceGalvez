import { defineStore } from 'pinia'

export interface User {
    username: string
    password: string
    email: string
    phone: string
    address: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('AuthUser') || 'null') as User | null,
        isLoggedIn: !!localStorage.getItem('AuthUser'),
}),

actions: {
    register(newUser: User) {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

        const exists = users.find(u => u.username === newUser.username)
        if (exists) {
            throw new Error('Username already exists')
        }

        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        // Auto-login after registration
        this.login({ email: newUser.email, password: newUser.password })
    },

    login({ email, password }: { email: string, password: string }) {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

        const match = users.find(u => u.email === email && u.password === password)
        if(!match) {
            throw new Error('Invalid credentials')
        }

        this.user = match
        this.isLoggedIn = true
        localStorage.setItem('AuthUser', JSON.stringify(match))
    },

    logout() {
        this.user = null
        this.isLoggedIn = false
        localStorage.removeItem('AuthUser')
    }
},

getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    user: (state) => state.user,
}
})