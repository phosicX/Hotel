<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()
const staff = ref(dataStore.staff)

onMounted(() => {
  staff.value = dataStore.staff
})

const departments = ['管理部', '客房部', '前台部', '餐饮部', '工程部']
const positions = ['总经理', '部门经理', '主管', '领班', '员工']

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({
  id: null,
  name: '',
  position: '',
  department: '',
  phone: '',
  hireDate: '',
  salary: 0
})

const rules = {
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请选择职位', trigger: 'change' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  salary: [{ required: true, message: '请输入工资', trigger: 'blur' }]
}

const handleAdd = () => {
  form.value = { id: null, name: '', position: '', department: '', phone: '', hireDate: '', salary: 0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除这个员工吗？', '提示', { type: 'warning' })
  const index = staff.value.findIndex(s => s.id === row.id)
  staff.value.splice(index, 1)
  ElMessage.success('删除成功')
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id) {
        dataStore.updateStaff(form)
        ElMessage.success('更新成功')
      } else {
        dataStore.addStaff(form)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<template>
  <div class="staff-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>员工管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加员工
          </el-button>
        </div>
      </template>
      
      <el-table :data="staff" stripe border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="员工姓名" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="hireDate" label="入职日期" width="120" />
        <el-table-column prop="salary" label="工资" width="120">
          <template #default="{ row }">
            ¥{{ row.salary }}
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
    
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑员工' : '添加员工'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
            <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-select v-model="form.position" placeholder="请选择职位" style="width: 100%">
            <el-option v-for="pos in positions" :key="pos" :label="pos" :value="pos" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker v-model="form.hireDate" type="date" placeholder="选择日期" style="width: 100%" value-format="YYYY-MM-DD"/>
        </el-form-item>
        <el-form-item label="工资" prop="salary">
          <el-input-number v-model="form.salary" :min="0" :step="500" style="width: 100%" />
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