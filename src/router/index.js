// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../components/layouts/MainLayout.vue'
import Dashboard from '../components/views/Dashboard.vue'
import Rooms from '../components/views/Rooms.vue'
import Bookings from '../components/views/Bookings.vue'
import Guests from '../components/views/Guests.vue'
import Staff from '../components/views/Staff.vue'
import Services from '../components/views/Services.vue'
import Reports from '../components/views/Reports.vue'
import Settings from '../components/views/Settings.vue'
import Login from '../components/views/Login.vue'
import Register from '../components/views/Register.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresAuth: false } },
  { path: '/', component: MainLayout, meta: { requiresAuth: true }, children: [
      { path: '', name: 'Dashboard', component: Dashboard, meta: { title: '仪表盘' } },
      { path: 'rooms', name: 'Rooms', component: Rooms, meta: { title: '房间管理' } },
      { path: 'bookings', name: 'Bookings', component: Bookings, meta: { title: '预订管理' } },
      { path: 'guests', name: 'Guests', component: Guests, meta: { title: '客户管理' } },
      { path: 'staff', name: 'Staff', component: Staff, meta: { title: '员工管理' } },
      { path: 'services', name: 'Services', component: Services, meta: { title: '服务管理' } },
      { path: 'reports', name: 'Reports', component: Reports, meta: { title: '数据报表' } },
      { path: 'settings', name: 'Settings', component: Settings, meta: { title: '系统设置' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }
  
  if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    return '/'
  }
  
  return true
})

router.onError((error) => {
  console.error('路由错误:', error)
})

export default router