<template>
    <div class="page-content">
      <el-button type="primary" @click="uiStore.showLoginModal = true" class="login-register-button">
        <el-icon class="login-register-icon" style="color: #f57224;"><User /></el-icon>
        <span class="login-register-text">Login / Register</span>
      </el-button>
  
      <!-- Overlay and Card -->
      <div v-if="uiStore.showLoginModal" class="modal-overlay" @click.self="uiStore.showLoginModal = false">
        <div class="auth-container">
          <div class="auth-card">
            <div class="card-header">
              <h2 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
              <p class="auth-subtitle">{{ isLogin ? 'Sign in to your account' : 'Join thousands of happy customers' }}</p>
              <el-button @click="uiStore.showLoginModal = false" icon="Close" circle size="small" class="close-button"/>
            </div>

            <!-- Social Login Buttons -->
            <div class="social-login">
              <el-button @click="loginWithGoogle" class="social-button google-btn">
                <img class="social-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" />
                Continue with Google
              </el-button>
              <el-button @click="loginWithFacebook" class="social-button facebook-btn">
                <img class="social-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/768px-Facebook_f_logo_%282019%29.svg.png" />
                Continue with Facebook
              </el-button>
            </div>

            <!-- Divider -->
            <div class="divider">
              <span>or</span>
            </div>

            <!-- Form content -->
            <el-form 
              ref="formRef"
              :model="form" 
              :rules="formRules"
              class="auth-form"
            >
              <el-form-item prop="email">
                <el-input 
                  v-model="form.email" 
                  placeholder="Email address" 
                  class="modern-input"
                  prefix-icon="Message"
                />
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input 
                  v-model="form.password" 
                  type="password" 
                  show-password 
                  placeholder="Password"
                  class="modern-input"
                  prefix-icon="Lock"
                />
              </el-form-item>

              
    
              <template v-if="!isLogin">

                <el-form-item prop="confirmPassword">
                <el-input
                v-model="form.confirmPassword"
                tpye="password"
                show-password
                placeholder="Confirm Password"
                class="modern-input"
                prefix-icon="Lock"
                />
              </el-form-item>

                <el-form-item prop="username">
                  <el-input 
                    v-model="form.username" 
                    placeholder="Full name"
                    class="modern-input"
                    prefix-icon="User"
                  />
                </el-form-item>
                <el-form-item prop="phone">
                  <el-input 
                    v-model="form.phone" 
                    placeholder="Phone number"
                    class="modern-input"
                    prefix-icon="Phone"
                  />
                </el-form-item>
              </template>

              <!-- Remember me / Forgot password -->
              <div class="form-extras" v-if="isLogin">
                <el-checkbox v-model="form.remember" class="remember-me">
                  Remember me
                </el-checkbox>
                <el-button type="text" class="forgot-link">
                  Forgot password?
                </el-button>
              </div>

              <!-- Terms for registration -->
              <div class="terms-container" v-if="!isLogin">
                <el-checkbox v-model="form.agreeTerms" class="terms-checkbox">
                  I agree to the 
                  <a href="#" class="terms-link">Terms of Service</a> and 
                  <a href="#" class="terms-link">Privacy Policy</a>
                </el-checkbox>
              </div>
    
              <el-button type="primary" @click="isLogin ? handleLogin() : handleRegister()" class="auth-button">
                {{ isLogin ? 'Sign In' : 'Create Account' }}
              </el-button>
              
              <div class="switch-auth">
                {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
                <el-button type="text" @click="isLogin = !isLogin" class="switch-link">
                  {{ isLogin ? "Sign up" : "Sign in" }}
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Close, User, Message, Lock, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useModalStore } from '@/stores/useModalStore'
import { showMessageOnce } from '@/utils/showMessageOnce'

const uiStore = useModalStore()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const username = ref('')
const phone = ref('')
const address = ref('')
const formRef = ref<FormInstance>()
const router = useRouter()


const loginRules = {
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }]
};

const registerRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' }
  ],
  username: [
    { required: true, message: 'Please enter your full name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Name must be between 2 and 50 characters', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' },
    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  agreeTerms: [
    { 
      required: true, 
      type: 'boolean', 
      validator: (rule: any, value: boolean, callback: (error?: Error) => void) => value ? callback() : callback(new Error('You must agree to the terms')), 
      trigger: 'change' 
    }
  ]
};

const formRules = computed(() => isLogin.value ? loginRules : registerRules);


const form = ref({
  email: '',
  password: '',
  username: '',
  phone: '',
  remember: false,
  agreeTerms: false,
  address: '',
  confirmPassword: ''
})

// Social login functions
function loginWithGoogle() {
  // Open fake Google sign-in window
  const googleWindow = window.open(
    '/google-signin',
    'googleSignIn',
    'width=400,height=600,scrollbars=yes,resizable=yes'
  )
  
  if (!googleWindow) {
    ElMessage.error('Please allow popups to sign in with Google')
    return
  }

  // Listen for messages from the Google sign-in window
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return
    
    if (event.data.type === 'GOOGLE_SIGNIN_SUCCESS') {
      const userData = event.data.user
      
      // Close the popup window
      googleWindow.close()
      
      // Remove the event listener
      window.removeEventListener('message', handleMessage)
      
      // Sign in the user
      handleGoogleSignIn(userData)
    } else if (event.data.type === 'GOOGLE_SIGNIN_CANCEL') {
      // Close the popup window
      googleWindow.close()
      
      // Remove the event listener
      window.removeEventListener('message', handleMessage)
    }
  }
  
  window.addEventListener('message', handleMessage)
}

function handleGoogleSignIn(userData: any) {
  try {
    const authStore = useAuthStore()
    
    // Check if user already exists
    const existingUser = authStore.users.find(u => u.email === userData.email)
    
    if (existingUser) {
      // User exists, log them in
      authStore.loginUser(userData.email, userData.password)
      ElMessage.success(`Welcome back, ${userData.name}!`)
    } else {
      // Create new user account
      const newUser = {
        username: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be handled differently
        phone: userData.phone || '',
        address: '',
        cartItems: [],
        orders: [],
        savedAddresses: []
      }
      
      authStore.registerUser(newUser)
      ElMessage.success(`Welcome, ${userData.name}! Your account has been created.`)
    }
    
    // Close the login modal
    uiStore.showLoginModal = false
    
  } catch (error) {
    console.error('Google sign-in error:', error)
    ElMessage.error('Failed to sign in with Google')
  }
}

function loginWithFacebook() {
  console.log('Facebook login clicked')
  // Implement Facebook OAuth here
}

async function handleLogin() {
  if (!formRef.value) return
  try {
    // Only validate login fields
    await formRef.value.validateField(['email', 'password'])
    useAuthStore().loginUser(form.value.email, form.value.password)
    console.log('Logging in user:', form.value)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

 async function handleRegister() {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      if(!form.value.agreeTerms) {
        ElMessage.error('Please agree to the terms and conditions')
    }

    if(
      !form.value.password ||
      !form.value.confirmPassword ||
      !form.value.username ||
      !form.value.phone
    ) {
      showMessageOnce('Please fill in all fields', 'error')
    }

    if(form.value.password !== form.value.confirmPassword) {
      showMessageOnce('Passwords do not match', 'error')
    }

    if(form.value.password.length < 8) {
      showMessageOnce('Password must be at least 8 characters long', 'error')
    }

    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.value.password)) {
      ElMessage.error('Password must contain at least one uppercase letter and one number')
      return
    }

    showMessageOnce('Registration successful!', 'success')
    uiStore.showLoginModal = false
    isLogin.value = true

    useAuthStore().registerUser({
    username: form.value.username,
    password: form.value.password,
    email: form.value.email,
    phone: form.value.phone,
    address: form.value.address,
    cartItems: [],
    orders: []
    })

    formRef.value.resetFields()

} catch (error) {
  console.error('Form validation failed:', error)
}
 }


 
</script>

<style scoped>
.page-content {
  padding: 2rem;
  text-align: center;
}




.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-container {
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-card {
  width: 480px;
  max-width: 90vw;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #f57224;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.auth-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  background-color: #f57224;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Lato', sans-serif;
}

.auth-subtitle {
  color: #718096;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.close-button {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f7fafc;
  border: none;
  color: #a0aec0;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #fed7d7;
  color: #e53e3e;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.social-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  margin: 0;
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.social-icon {
    width: 20px;
  height: 20px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.google-btn:hover {
  border-color: #4285f4;
}

.facebook-btn:hover {
  border-color: #1877f2;
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
  color: #a0aec0;
  font-weight: 500;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.divider span {
  background: white;
  padding: 0 20px;
  font-size: 14px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -8px 0 8px 0;
}

.remember-me {
  font-size: 14px;
  color: #4a5568;
}

.forgot-link {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
  height: auto;
}

.forgot-link:hover {
  color: #764ba2;
}

.terms-container {
  margin: -8px 0 8px 0;
}

.terms-checkbox {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.auth-button {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f57224 0%, #f57224 100%);
  border: none;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  color: #ffffff !important;
}


.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.switch-auth {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #718096;
}

.switch-link {
  color: #667eea;
  font-weight: 600;
  padding: 0;
  height: auto;
  font-size: 14px;
}

.switch-link:hover {
  color: #4ba2a2;
}

/* Modern Input Styles */
:deep(.modern-input .el-input__wrapper) {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  height: 52px;
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.modern-input .el-input__wrapper:hover) {
  border-color: #cbd5e0;
  background: #f1f5f9;
}

:deep(.modern-input .el-input__wrapper.is-focus) {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.modern-input .el-input__inner) {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #2d3748;
  font-weight: 500;
}

:deep(.modern-input .el-input__inner::placeholder) {
  color: #a0aec0;
  font-weight: 400;
}

:deep(.modern-input .el-input__prefix) {
  color: #a0aec0;
}

:deep(.modern-input .el-input__wrapper.is-focus .el-input__prefix) {
  color: #667eea;
}

/* Form Item Spacing */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__content) {
  line-height: normal;
}

/* Checkbox Styling */
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #667eea;
  border-color: #667eea;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #2d3748;
}

.el-button.social-button.facebook-btn {
    background-color: #1877f2;
    color: #ffffff;
    border-color: #1877f2;
}

.login-register-text {
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    text-transform: none;
    text-align: center;
    color: #f57224;
}

.login-register-button {
    background-color: #f57224;
    color: #f57224;
    border-color: #f57224;
}

@media (max-width: 600px) {
  .auth-card {
    width: 90vw;
    padding: 24px;
    border-radius: 16px;
  }

  .auth-title {
    font-size: 24px;
  }

  .auth-subtitle {
    font-size: 14px;
  }

  .auth-button {
    font-size: 14px;
    height: 48px;
  }

  .social-button {
    font-size: 14px;
    height: 44px;
  }

  .divider span {
    font-size: 12px;
  }
}

@media (max-width: 400px) {
  .auth-card {
    width: 95vw;
    padding: 16px;
  }

  .auth-title {
    font-size: 20px;
  }

  .auth-subtitle {
    font-size: 13px;
  }
}






</style>