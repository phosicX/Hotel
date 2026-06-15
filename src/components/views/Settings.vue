<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const activeTab = ref('profile')

const profileForm = reactive({
  username: authStore.currentUser?.username || '',
  email: authStore.currentUser?.email || '',
  phone: '138****8888',
  role: authStore.currentUser?.role || '管理员'
})

const securityForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const hotelInfo = reactive({
  name: 'XX国际酒店',
  address: 'XX市XX区XX路88号',
  phone: '400-888-8888',
  email: 'hotel@example.com',
  description: '五星级豪华酒店，提供优质服务'
})

const saveProfile = () => {
  ElMessage.success('个人资料已更新')
}

const savePassword = () => {
  if (securityForm.newPassword !== securityForm.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }
  ElMessage.success('密码已更新')
}

const saveHotelInfo = () => {
  ElMessage.success('酒店信息已更新')
}
</script>

<template>
  <div class="settings-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人资料" name="profile">
          <el-form :model="profileForm" label-width="100px" style="max-width: 500px">
            <el-form-item label="用户名">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profileForm.email" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="profileForm.phone" />
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="profileForm.role" disabled />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="修改密码" name="password">
          <el-form :model="securityForm" label-width="100px" style="max-width: 500px">
            <el-form-item label="原密码">
              <el-input v-model="securityForm.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="securityForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认新密码">
              <el-input v-model="securityForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="savePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="酒店信息" name="hotel">
          <el-form :model="hotelInfo" label-width="100px" style="max-width: 500px">
            <el-form-item label="酒店名称">
              <el-input v-model="hotelInfo.name" />
            </el-form-item>
            <el-form-item label="酒店地址">
              <el-input v-model="hotelInfo.address" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="hotelInfo.phone" />
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input v-model="hotelInfo.email" />
            </el-form-item>
            <el-form-item label="酒店简介">
              <el-input v-model="hotelInfo.description" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveHotelInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>