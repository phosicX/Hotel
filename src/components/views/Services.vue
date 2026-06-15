<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()
const services = ref(dataStore.services)

onMounted(() => {
  services.value = dataStore.services
})

const dialogVisible = ref(false)
const formRef = ref()
const form = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  duration: '',
  status: '启用'
})

const rules = {
  name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入服务时间', trigger: 'blur' }]
}

const handleAdd = () => {
  form.value = { id: null, name: '', description: '', price: 0, duration: '', status: '启用' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除这个服务吗？', '提示', { type: 'warning' })
  const index = services.value.findIndex(s => s.id === row.id)
  services.value.splice(index, 1)
  ElMessage.success('删除成功')
}

const toggleStatus = async (row) => {
  row.status = row.status === '启用' ? '停用' : '启用'
  ElMessage.success(`已${row.status === '启用' ? '启用' : '停用'}服务`)
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id) {
        const index = services.value.findIndex(s => s.id === form.value.id)
        services.value[index] = { ...form.value }
        ElMessage.success('更新成功')
      } else {
        form.value.id = Date.now()
        services.value.push({ ...form.value })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <div class="services-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>增值服务管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加服务
          </el-button>
        </div>
      </template>
      
      <el-table :data="services" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="服务名称" width="140" />
        <el-table-column prop="description" label="服务描述" width="200" />
        <el-table-column prop="price" label="价格(元)" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="服务时间" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="启用" inactive-value="停用" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑服务' : '添加服务'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入服务描述" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="服务时间" prop="duration">
          <el-input v-model="form.duration" placeholder="如：07:00-09:30" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>