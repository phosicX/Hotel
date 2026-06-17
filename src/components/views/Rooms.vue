<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()
const rooms = ref(dataStore.rooms)

onMounted(() => { rooms.value = dataStore.rooms })

const dialogVisible = ref(false)
const dialogTitle = ref('添加房间')
const formRef = ref()

const form = reactive({
  id: null,
  number: '',
  type: '',
  price: '',
  status: '空闲',
  floor: ''
})

const rules = {
  number: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
  type: [{ required: true, message: '请选择房间类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  floor: [{ required: true, message: '请输入楼层', trigger: 'blur' }]
}

const statusOptions = [
  { label: '空闲', value: '空闲' },
  { label: '已入住', value: '已入住' },
  { label: '已预订', value: '已预订' },
  { label: '维修中', value: '维修中' }
]

const roomTypes = ['标准间', '豪华间', '商务间', '总统套房']

const getStatusType = (status) => {
  const map = {
    '空闲': 'success',
    '已入住': 'danger',
    '已预订': 'warning',
    '维修中': 'info'
  }
  return map[status] || 'info'
}

const handleAdd = () => {
  dialogTitle.value = '添加房间'
  Object.assign(form, {
    id: null,
    number: '',
    type: '',
    price: '',
    status: '空闲',
    floor: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑房间'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除这个房间吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  dataStore.deleteRoom(row.id)
  ElMessage.success('删除成功')
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.id) {
        dataStore.updateRoom(form)
        ElMessage.success('更新成功')
      } else {
        dataStore.addRoom(form)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <div class="rooms-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>房间管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加房间
          </el-button>
        </div>
      </template>
      
      <el-table :data="rooms" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="number" label="房间号" width="120" />
        <el-table-column prop="type" label="房间类型" width="120" />
        <el-table-column prop="floor" label="楼层" width="100" />
        <el-table-column prop="price" label="价格(元/晚)" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="房间号" prop="number">
          <el-input v-model="form.number" placeholder="请输入房间号" />
        </el-form-item>
        <el-form-item label="房间类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择房间类型" style="width: 100%">
            <el-option v-for="type in roomTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input-number v-model="form.floor" :min="1" :max="30" style="width: 100%" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="50" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
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