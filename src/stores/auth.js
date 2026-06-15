// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null,
    users: []  // 存储注册的用户
  }),
  
  persist: {
    key: 'auth-storage',
    storage: localStorage,
    paths: ['token', 'user', 'users']
  },
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    // 初始化默认用户
    initDefaultUsers() {
      if (this.users.length === 0) {
        this.users = [
          {
            id: 1,
            username: 'admin',
            password: '123456',  // 实际项目中应该加密存储
            email: 'admin@hotel.com',
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            username: 'user',
            password: '123456',
            email: 'user@hotel.com',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ]
      }
    },
    
    // 登录方法
    async login(credentials) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 初始化默认用户
          this.initDefaultUsers()
          
          // 查找用户
          const user = this.users.find(
            u => u.username === credentials.username && u.password === credentials.password
          )
          
          if (user) {
            // 登录成功，生成token（不包含密码）
            const { password, ...userWithoutPassword } = user
            const token = 'mock-token-' + Date.now() + '-' + user.id
            
            this.token = token
            this.user = userWithoutPassword
            resolve(userWithoutPassword)
          } else {
            // 登录失败
            reject(new Error('用户名或密码错误'))
          }
        }, 500)
      })
    },
    
    // 注册方法
    async register(userData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 初始化默认用户
          this.initDefaultUsers()
          
          // 检查用户名是否已存在
          const existingUser = this.users.find(u => u.username === userData.username)
          if (existingUser) {
            reject(new Error('用户名已存在，请使用其他用户名'))
            return
          }
          
          // 检查邮箱是否已存在
          const existingEmail = this.users.find(u => u.email === userData.email)
          if (existingEmail) {
            reject(new Error('邮箱已被注册'))
            return
          }
          
          // 验证密码
          if (userData.password !== userData.confirmPassword) {
            reject(new Error('两次输入的密码不一致'))
            return
          }
          
          // 创建新用户
          const newUser = {
            id: Date.now(),
            username: userData.username,
            password: userData.password,  // 实际项目中应该加密
            email: userData.email,
            role: 'user',
            createdAt: new Date().toISOString()
          }
          
          this.users.push(newUser)
          
          // 返回用户信息（不包含密码）
          const { password, ...userWithoutPassword } = newUser
          resolve(userWithoutPassword)
        }, 500)
      })
    },
    
    // 登出
    logout() {
      this.token = ''
      this.user = null
    },
    
    // 修改密码
    async changePassword(oldPassword, newPassword) {
      return new Promise((resolve, reject) => {
        const user = this.users.find(u => u.id === this.user.id)
        
        if (!user || user.password !== oldPassword) {
          reject(new Error('原密码错误'))
          return
        }
        
        user.password = newPassword
        resolve()
      })
    }
  }
})