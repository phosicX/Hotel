<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()
const guests = ref(dataStore.guests)

onMounted(() => {
  guests.value = dataStore.guests
})

const dialogVisible = ref(false)
const formRef = ref()
const form = ref({
  id: null,
  name: '',
  phone: '',
  idCard: '',
  email: '',
  totalSpent: 0,
  bookingCount: 0
})

const rules = {
  name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]
}

const handleAdd = () => {
  form.value = { id: null, name: '', phone: '', idCard: '', email: '', totalSpent: 0, bookingCount: 0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除这个客户吗？', '提示', { type: 'warning' })
  const index = guests.value.findIndex(g => g.id === row.id)
  guests.value.splice(index, 1)
  ElMessage.success('删除成功')
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id) {
        const index = guests.value.findIndex(g => g.id === form.value.id)
        guests.value[index] = { ...form.value }
        ElMessage.success('更新成功')
      } else {
        form.value.id = Date.now()
        guests.value.push({ ...form.value })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <div class="guests-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加客户
          </el-button>
        </div>
      </template>
      
      <el-table :data="guests" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="客户姓名" width="120" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="bookingCount" label="预订次数" width="100" />
        <el-table-column prop="totalSpent" label="消费总额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalSpent }}
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
    
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑客户' : '添加客户'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
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