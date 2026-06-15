<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const formRef = ref()

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.login(form)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 添加演示账号快速填充功能
const fillDemoAccount = (username, password) => {
  form.username = username
  form.password = password
}

// 清除localStorage数据（调试用）
const clearData = () => {
  localStorage.clear()
  ElMessage.success('已清除所有本地数据，请刷新页面')
  setTimeout(() => {
    location.reload()
  }, 1000)
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <el-icon :size="48" color="#409eff">
          <Hotel />
        </el-icon>
        <h1>酒店管理系统</h1>
        <p>欢迎登录，请填写您的账户信息</p>
      </div>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
        
        <!-- 演示账号提示 -->
        <el-alert
          title="演示账号"
          type="info"
          :closable="false"
          style="margin-bottom: 16px"
        >
          <template #default>
            <div style="font-size: 12px">
              <div>管理员：admin / 123456</div>
              <div>普通用户：user / 123456</div>
            </div>
          </template>
        </el-alert>
        
        <!-- 快速填充按钮（开发调试用） -->
        <div class="demo-buttons">
          <el-button size="small" @click="fillDemoAccount('admin', '123456')">
            填充管理员账号
          </el-button>
          <el-button size="small" @click="fillDemoAccount('user', '123456')">
            填充普通账号
          </el-button>
        </div>
        
        <div class="login-footer">
          <span>还没有账号？</span>
          <el-link type="primary" @click="router.push('/register')">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 24px;
  color: #333;
  margin: 16px 0 8px;
}

.login-header p {
  color: #999;
  font-size: 14px;
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  width: 100%;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.demo-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  justify-content: center;
}

.demo-buttons .el-button {
  flex: 1;
}
</style>