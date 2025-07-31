<template>
  <div class="google-signin-container">
    <div class="google-header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png" alt="Google" class="google-logo" />
      <h1>Sign in</h1>
      <p>to continue to E-Commerce</p>
    </div>

    <div class="signin-form">
      <div class="form-group">
        <label>Email or phone</label>
        <input 
          v-model="email" 
          type="email" 
          class="google-input"
          :class="{ 'error': emailError }"
          placeholder="Enter your email"
          @keyup.enter="handleEmailSubmit"
          @blur="validateEmail"
          @input="clearEmailError"
        />
        <div v-if="emailError" class="error-message">{{ emailError }}</div>
      </div>

      <div v-if="showPassword" class="form-group">
        <label>Password</label>
        <input 
          v-model="password" 
          type="password" 
          class="google-input"
          :class="{ 'error': passwordError }"
          placeholder="Enter your password"
          @keyup.enter="handlePasswordSubmit"
          @blur="validatePassword"
          @input="clearPasswordError"
        />
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
      </div>

      <div v-if="showAccountSelection" class="account-selection">
        <h3>Choose an account</h3>
        <div class="accounts-list">
          <div 
            v-for="account in fakeAccounts" 
            :key="account.email"
            class="account-item"
            @click="selectAccount(account)"
          >
            <div class="account-avatar">
              {{ account.name.charAt(0).toUpperCase() }}
            </div>
            <div class="account-info">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-email">{{ account.email }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button 
          v-if="!showAccountSelection && !showPassword" 
          @click="handleEmailSubmit"
          class="google-button primary"
          :disabled="!isEmailValid"
        >
          Next
        </button>
        <button 
          v-if="showPassword" 
          @click="handlePasswordSubmit"
          class="google-button primary"
          :disabled="!isPasswordValid"
        >
          Sign in
        </button>
        <button 
          v-if="showAccountSelection" 
          @click="cancelSignIn"
          class="google-button secondary"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="google-footer">
      <a href="#" @click="cancelSignIn">Create account</a>
      <span class="separator">•</span>
      <a href="#" @click="cancelSignIn">Forgot password?</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Fake Google accounts
const fakeAccounts = [
  {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    password: 'password123',
    phone: '+1234567890'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    password: 'password123',
    phone: '+1987654321'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@gmail.com',
    password: 'password123',
    phone: '+1555123456'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@gmail.com',
    password: 'password123',
    phone: '+1444333222'
  }
]

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showAccountSelection = ref(false)
const selectedAccount = ref<any>(null)

// Form validation rules
const emailRules = [
  { required: true, message: 'Enter your email', trigger: 'blur' },
  { type: 'email', message: 'Enter a valid email address', trigger: 'blur' }
]

const passwordRules = [
  { required: true, message: 'Enter your password', trigger: 'blur' },
  { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
]

// Validation state
const emailError = ref('')
const passwordError = ref('')
const isEmailValid = ref(false)
const isPasswordValid = ref(false)

// Validation functions
const validateEmail = () => {
  emailError.value = ''
  isEmailValid.value = false
  
  if (!email.value) {
    emailError.value = 'Enter your email'
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Enter a valid email address'
    return false
  }
  
  // Check if email exists in our fake accounts (optional validation)
  const accountExists = fakeAccounts.some(acc => acc.email.toLowerCase() === email.value.toLowerCase())
  if (!accountExists) {
    // Don't show error, just show account selection
    isEmailValid.value = true
    return true
  }
  
  isEmailValid.value = true
  return true
}

const validatePassword = () => {
  passwordError.value = ''
  isPasswordValid.value = false
  
  if (!password.value) {
    passwordError.value = 'Enter your password'
    return false
  }
  
  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }
  
  isPasswordValid.value = true
  return true
}

const clearEmailError = () => {
  if (emailError.value) {
    emailError.value = ''
  }
}

const clearPasswordError = () => {
  if (passwordError.value) {
    passwordError.value = ''
  }
}

const validateAccountCredentials = (email: string, password: string) => {
  const account = fakeAccounts.find(acc => 
    acc.email.toLowerCase() === email.toLowerCase() && 
    acc.password === password
  )
  
  return account || null
}

const handleEmailSubmit = () => {
  if (!validateEmail()) return

  // Check if email matches any fake account
  const account = fakeAccounts.find(acc => acc.email.toLowerCase() === email.value.toLowerCase())
  
  if (account) {
    selectedAccount.value = account
    showPassword.value = true
  } else {
    // Show account selection for unknown emails
    showAccountSelection.value = true
  }
}

const handlePasswordSubmit = () => {
  if (!validatePassword() || !selectedAccount.value) return

  // Validate account credentials
  const validAccount = validateAccountCredentials(selectedAccount.value.email, password.value)
  
  if (validAccount) {
    // Send success message to parent window
    window.opener?.postMessage({
      type: 'GOOGLE_SIGNIN_SUCCESS',
      user: validAccount
    }, window.location.origin)
    
    // Close the window
    window.close()
  } else {
    passwordError.value = 'Incorrect password. Please try again.'
    password.value = ''
  }
}

const selectAccount = (account: any) => {
  selectedAccount.value = account
  email.value = account.email
  showAccountSelection.value = false
  showPassword.value = true
}

const cancelSignIn = () => {
  // Send cancel message to parent window
  window.opener?.postMessage({
    type: 'GOOGLE_SIGNIN_CANCEL'
  }, window.location.origin)
  
  // Close the window
  window.close()
}


</script>

<style scoped>
.google-signin-container {
  font-family: 'Roboto', Arial, sans-serif;
  max-width: 450px;
  margin: 0 auto;
  padding: 48px 40px 36px;
  background: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.google-header {
  text-align: center;
  margin-bottom: 32px;
}

.google-logo {
  width: 75px;
  height: auto;
  margin-bottom: 16px;
}

.google-header h1 {
  font-size: 24px;
  font-weight: 400;
  color: #202124;
  margin: 0 0 8px 0;
}

.google-header p {
  font-size: 16px;
  font-weight: 400;
  color: #202124;
  margin: 0;
}

.signin-form {
  flex: 1;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 8px;
}

.google-input {
  width: 100%;
  height: 56px;
  padding: 13px 15px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 16px;
  color: #202124;
  background: white;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.google-input:focus {
  outline: none;
  border-color: #1a73e8;
  border-width: 2px;
}

.google-input.error {
  border-color: #d93025;
  border-width: 2px;
}

.google-input.error:focus {
  border-color: #d93025;
  box-shadow: 0 0 0 2px rgba(217, 48, 37, 0.2);
}

.error-message {
  color: #d93025;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.google-input::placeholder {
  color: #5f6368;
}

.account-selection {
  margin-bottom: 24px;
}

.account-selection h3 {
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  margin: 0 0 16px 0;
}

.accounts-list {
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f1f3f4;
}

.account-item:last-child {
  border-bottom: none;
}

.account-item:hover {
  background-color: #f8f9fa;
}

.account-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  margin-right: 16px;
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 2px;
}

.account-email {
  font-size: 14px;
  color: #5f6368;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
}

.google-button {
  padding: 0 24px;
  height: 36px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.google-button.primary {
  background: #1a73e8;
  color: white;
}

.google-button.primary:hover:not(:disabled) {
  background: #1557b0;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.google-button.primary:disabled {
  background: #dadce0;
  color: #5f6368;
  cursor: not-allowed;
}

.google-button.secondary {
  background: transparent;
  color: #1a73e8;
}

.google-button.secondary:hover {
  background: #f8f9fa;
}

.google-footer {
  margin-top: 48px;
  text-align: center;
  font-size: 14px;
}

.google-footer a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
}

.google-footer a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 8px;
  color: #5f6368;
}

@media (max-width: 480px) {
  .google-signin-container {
    padding: 24px 20px;
  }
  
  .google-header h1 {
    font-size: 20px;
  }
  
  .google-input {
    height: 48px;
    font-size: 14px;
  }
}
</style> 