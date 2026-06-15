<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()

const bookings = ref(dataStore.bookings)

onMounted(() => {
  bookings.value = dataStore.bookings
})

const dialogVisible = ref(false)
const formRef = ref()
const form = ref({
  id: null,
  guest: '',
  guestPhone: '',
  room: '',
  checkIn: '',
  checkOut: '',
  status: '待确认',
  amount: 0
})

const rules = {
  guest: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  guestPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  room: [{ required: true, message: '请选择房间', trigger: 'change' }],
  checkIn: [{ required: true, message: '请选择入住日期', trigger: 'change' }],
  checkOut: [{ required: true, message: '请选择离店日期', trigger: 'change' }]
}

const statusOptions = ['待确认', '已确认', '已入住', '已完成', '已取消']
const rooms = ['801', '802', '501', '502', '1201']

const getStatusType = (status) => {
  const map = {
    '待确认': 'warning',
    '已确认': 'info',
    '已入住': 'success',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

const handleAdd = () => {
  form.value = { id: null, guest: '', guestPhone: '', room: '', checkIn: '', checkOut: '', status: '待确认', amount: 0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除这个预订吗？', '提示', { type: 'warning' })
  const index = bookings.value.findIndex(b => b.id === row.id)
  bookings.value.splice(index, 1)
  ElMessage.success('删除成功')
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id) {
        const index = bookings.value.findIndex(b => b.id === form.value.id)
        bookings.value[index] = { ...form.value }
        ElMessage.success('更新成功')
      } else {
        form.value.id = Date.now()
        bookings.value.push({ ...form.value })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <div class="bookings-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>预订管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新建预订
          </el-button>
        </div>
      </template>
      
      <el-table :data="bookings" stripe border>
        <el-table-column prop="id" label="订单号" width="100" />
        <el-table-column prop="guest" label="客户姓名" width="120" />
        <el-table-column prop="guestPhone" label="联系电话" width="130" />
        <el-table-column prop="room" label="房间号" width="100" />
        <el-table-column prop="checkIn" label="入住日期" width="120" />
        <el-table-column prop="checkOut" label="离店日期" width="120" />
        <el-table-column prop="amount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
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
    
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑预订' : '新建预订'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="客户姓名" prop="guest">
          <el-input v-model="form.guest" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="guestPhone">
          <el-input v-model="form.guestPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="房间号" prop="room">
          <el-select v-model="form.room" placeholder="请选择房间" style="width: 100%">
            <el-option v-for="room in rooms" :key="room" :label="room" :value="room" />
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期" prop="checkIn">
          <el-date-picker v-model="form.checkIn" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="离店日期" prop="checkOut">
          <el-date-picker v-model="form.checkOut" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option v-for="opt in statusOptions" :key="opt" :label="opt" :value="opt" />
          </el-select>
        </el-form-item>
        <el-form-item label="总金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :step="100" style="width: 100%" />
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