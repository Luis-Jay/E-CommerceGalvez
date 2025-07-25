import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', () => {
    const router = useRouter()
    const store = useAuthStore()
    const isAuth = ref(store.isAuthenticated.value)
    return {isAuth}

})