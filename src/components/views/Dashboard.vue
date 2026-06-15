<script setup>
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()

const stats = computed(() => [
  { title: '总房间数', value: dataStore.roomStats.total, icon: 'House', color: '#409eff', trend: '+' },
  { title: '空闲房间', value: dataStore.roomStats.available, icon: 'Check', color: '#67c23a', trend: '' },
  { title: '今日预订', value: dataStore.bookings.filter(b => b.status === '待确认' || b.status === '已确认').length, icon: 'Calendar', color: '#e6a23c', trend: '' },
  { title: '总营业额', value: '¥' + dataStore.revenueStats.totalRevenue.toLocaleString(), icon: 'Money', color: '#f56c6c', trend: '' }
])

const recentBookings = computed(() => dataStore.bookings.slice(0, 4))

const occupancyData = ref([
  { name: '标准间', occupancy: 75 },
  { name: '豪华间', occupancy: 82 },
  { name: '商务间', occupancy: 68 },
  { name: '总统套房', occupancy: 45 }
])

const getStatusType = (status) => {
  const map = {
    '已入住': 'success',
    '已预订': 'warning',
    '已退房': 'info',
    '待确认': 'warning',
    '已确认': 'info',
    '已完成': 'success'
  }
  return map[status] || 'info'
}
</script>

<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-trend">
                <span class="trend-up">↑ {{ stat.trend }}</span>
                <span>较昨日</span>
              </div>
            </div>
            <div class="stat-icon" :style="{ backgroundColor: stat.color + '20', color: stat.color }">
              <el-icon :size="32">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>入住率统计</span>
            </div>
          </template>
          <div class="occupancy-list">
            <div v-for="item in occupancyData" :key="item.name" class="occupancy-item">
              <div class="occupancy-label">{{ item.name }}</div>
              <el-progress 
                :percentage="item.occupancy" 
                :color="item.occupancy > 80 ? '#f56c6c' : item.occupancy > 60 ? '#e6a23c' : '#67c23a'"
                :stroke-width="16"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" size="large" @click="$router.push('/bookings')">
              <el-icon><Plus /></el-icon>
              新建预订
            </el-button>
            <el-button type="success" size="large" @click="$router.push('/rooms')">
              <el-icon><Edit /></el-icon>
              管理房间
            </el-button>
            <el-button type="info" size="large" @click="$router.push('/guests')">
              <el-icon><User /></el-icon>
              客户管理
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近预订</span>
              <el-button type="text" @click="$router.push('/bookings')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentBookings" stripe>
            <el-table-column prop="id" label="订单号" width="100" />
            <el-table-column prop="guest" label="客户姓名" />
            <el-table-column prop="room" label="房间号" />
            <el-table-column prop="checkIn" label="入住日期" />
            <el-table-column label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.stat-card {
  border-radius: 12px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 12px;
  color: #909399;
}

.trend-up {
  color: #67c23a;
  margin-right: 4px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.occupancy-list {
  padding: 8px 0;
}

.occupancy-item {
  margin-bottom: 24px;
}

.occupancy-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-actions .el-button {
  width: 100%;
  margin: 0;
}
</style>