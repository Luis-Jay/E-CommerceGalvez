// useModalStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('ui', () => {
  const showLoginModal = ref(false)
  return { showLoginModal }
})