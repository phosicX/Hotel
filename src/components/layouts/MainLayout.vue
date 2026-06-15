// layouts/MainLayout.vue
<script setup>
import { ref, computed, watch, onMounted, onErrorCaptured } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useDataStore } from '../../stores/data'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const dataStore = useDataStore()
const isCollapse = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// 捕获组件错误
onErrorCaptured((err, instance, info) => {
  console.error('组件错误:', err, info)
  errorMessage.value = err.message || '组件加载失败'
  ElMessage.error('页面加载失败，请刷新重试')
  return false // 阻止错误继续传播
})

const menuItems = [
  { path: '/', name: 'Dashboard', title: '仪表盘', icon: 'Monitor' },
  { path: '/rooms', name: 'Rooms', title: '房间管理', icon: 'House' },
  { path: '/bookings', name: 'Bookings', title: '预订管理', icon: 'Calendar' },
  { path: '/guests', name: 'Guests', title: '客户管理', icon: 'User' },
  { path: '/staff', name: 'Staff', title: '员工管理', icon: 'UserFilled' },
  { path: '/services', name: 'Services', title: '服务管理', icon: 'Service' },
  { path: '/reports', name: 'Reports', title: '数据报表', icon: 'DataAnalysis' },
  { path: '/settings', name: 'Settings', title: '系统设置', icon: 'Setting' }
]

const currentTitle = computed(() => {
  const current = menuItems.find(item => item.path === route.path)
  return current?.title || '酒店管理系统'
})

const handleLogout = () => {
  ElMessage.success('已退出登录')
  authStore.logout()
  router.push('/login')
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 监听路由变化，确保组件重新渲染
watch(() => route.path, (newPath, oldPath) => {
  isLoading.value = true
  // 确保数据已初始化
  if (dataStore.rooms.length === 0) {
    dataStore.initData()
  }
  setTimeout(() => {
    isLoading.value = false
  }, 100)
})

onMounted(() => {
  // 初始化数据
  dataStore.initData()
  isLoading.value = false
})

// 强制刷新当前路由
const refreshCurrentRoute = () => {
  isLoading.value = true
  router.go(0) // 刷新页面
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo-container">
        <el-icon :size="24" color="#fff">
          <Hotel />
        </el-icon>
        <span v-if="!isCollapse" class="logo-text">酒店管理系统</span>
      </div>
      
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
      
      <div class="toggle-btn" @click="toggleSidebar">
        <el-icon>
          <DArrowLeft v-if="!isCollapse" />
          <DArrowRight v-else />
        </el-icon>
      </div>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h2>{{ currentTitle }}</h2>
        </div>
        <div class="header-right">
          <el-button 
            type="primary" 
            link 
            @click="refreshCurrentRoute"
            title="刷新页面"
            style="margin-right: 12px"
          >
            <el-icon><Refresh /></el-icon>
          </el-button>
          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="36" :icon="UserFilled" />
              <span class="username">{{ authStore.currentUser?.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/settings')">
                  <el-icon><User /></el-icon>
                  个人设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <el-loading v-if="isLoading" :loading="isLoading" text="加载中..." />
        <router-view v-else :key="route.path" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  height: 100%;
  position: relative;
  transition: width 0.3s;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #263445;
  color: #fff;
}

.logo-text {
  font-size: 16px;
  font-weight: bold;
}

.el-menu {
  border-right: none;
  height: calc(100% - 120px);
}

.toggle-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  background-color: #263445;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #bfcbd9;
  transition: all 0.3s;
}

.toggle-btn:hover {
  background-color: #409eff;
  color: #fff;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left h2 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #333;
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>