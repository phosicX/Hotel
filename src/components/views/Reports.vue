// views/Reports.vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()
const activeTab = ref('revenue')

// 从 store 获取真实数据
const revenueData = computed(() => {
  const bookings = dataStore.bookings
  const completedBookings = bookings.filter(b => b.status === '已完成')
  
  // 计算日营收（最近7天）
  const today = new Date()
  const dailyBookings = bookings.filter(b => {
    const checkIn = new Date(b.checkIn)
    const diffTime = Math.abs(today - checkIn)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 1
  })
  
  // 计算周营收（最近30天）
  const weeklyBookings = bookings.filter(b => {
    const checkIn = new Date(b.checkIn)
    const diffTime = Math.abs(today - checkIn)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  })
  
  // 月营收（所有已完成订单）
  const monthlyRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0)
  
  // 计算入住率
  const totalRooms = dataStore.rooms.length
  const occupiedRooms = dataStore.rooms.filter(r => r.status === '已入住').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  
  return {
    daily: {
      revenue: dailyBookings.reduce((sum, b) => sum + b.amount, 0),
      bookings: dailyBookings.length,
      occupancy: occupancyRate
    },
    weekly: {
      revenue: weeklyBookings.reduce((sum, b) => sum + b.amount, 0),
      bookings: weeklyBookings.length,
      occupancy: occupancyRate
    },
    monthly: {
      revenue: monthlyRevenue,
      bookings: completedBookings.length,
      occupancy: occupancyRate
    }
  }
})

// 热门房间统计（从真实数据计算）
const popularRooms = computed(() => {
  const roomStats = {}
  
  dataStore.bookings.forEach(booking => {
    if (!roomStats[booking.room]) {
      roomStats[booking.room] = {
        bookings: 0,
        revenue: 0,
        type: booking.room.includes('80') ? '豪华间' : 
               booking.room.includes('50') ? '标准间' :
               booking.room.includes('12') ? '总统套房' : '商务间'
      }
    }
    roomStats[booking.room].bookings++
    roomStats[booking.room].revenue += booking.amount
  })
  
  // 按房间类型汇总
  const typeStats = {}
  Object.values(roomStats).forEach(stat => {
    if (!typeStats[stat.type]) {
      typeStats[stat.type] = { bookings: 0, revenue: 0, type: stat.type }
    }
    typeStats[stat.type].bookings += stat.bookings
    typeStats[stat.type].revenue += stat.revenue
  })
  
  return Object.values(typeStats)
})

// 客户统计（从真实数据计算）
const guestStats = computed(() => {
  // 按月统计客户增长
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  let cumulativeTotal = 0
  
  return months.map((month, index) => {
    // 模拟每月新增客户（基于实际预订数据）
    const monthlyBookings = dataStore.bookings.filter(b => {
      const bookingMonth = new Date(b.checkIn).getMonth()
      return bookingMonth === index
    })
    
    const newGuests = monthlyBookings.length
    cumulativeTotal += newGuests
    
    return {
      month,
      newGuests,
      totalGuests: cumulativeTotal
    }
  })
})

// 统计数据卡片
const statsCards = computed(() => {
  return [
    { title: '日营业额', value: revenueData.value.daily.revenue, icon: 'Money', color: '#409eff' },
    { title: '周营业额', value: revenueData.value.weekly.revenue, icon: 'Money', color: '#67c23a' },
    { title: '月营业额', value: revenueData.value.monthly.revenue, icon: 'Money', color: '#e6a23c' }
  ]
})

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    '已入住': 'success',
    '已预订': 'warning',
    '待确认': 'warning',
    '已确认': 'info',
    '已完成': 'success',
    '已退房': 'info'
  }
  return map[status] || 'info'
}

onMounted(() => {
  // 确保数据已初始化
  if (dataStore.rooms.length === 0) {
    dataStore.initData()
  }
})
</script>

<template>
  <div class="reports-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="stat in statsCards" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value-large">¥{{ stat.value.toLocaleString() }}</div>
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
    
    <!-- 数据报表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>数据报表</span>
              <el-radio-group v-model="activeTab" size="small">
                <el-radio-button label="revenue">营收分析</el-radio-button>
                <el-radio-button label="rooms">房间分析</el-radio-button>
                <el-radio-button label="guests">客户分析</el-radio-button>
                <el-radio-button label="bookings">预订分析</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          
          <!-- 营收分析 -->
          <div v-if="activeTab === 'revenue'">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="stat-box">
                  <div class="stat-label">日营收</div>
                  <div class="stat-number">¥{{ revenueData.daily.revenue.toLocaleString() }}</div>
                  <div class="stat-detail">预订数: {{ revenueData.daily.bookings }} | 入住率: {{ revenueData.daily.occupancy }}%</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-box">
                  <div class="stat-label">周营收</div>
                  <div class="stat-number">¥{{ revenueData.weekly.revenue.toLocaleString() }}</div>
                  <div class="stat-detail">预订数: {{ revenueData.weekly.bookings }} | 入住率: {{ revenueData.weekly.occupancy }}%</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-box">
                  <div class="stat-label">月营收</div>
                  <div class="stat-number">¥{{ revenueData.monthly.revenue.toLocaleString() }}</div>
                  <div class="stat-detail">预订数: {{ revenueData.monthly.bookings }} | 入住率: {{ revenueData.monthly.occupancy }}%</div>
                </div>
              </el-col>
            </el-row>
            
            <!-- 营收趋势图（简单展示） -->
            <div style="margin-top: 20px">
              <el-alert type="success" :closable="false">
                <template #title>
                  营收趋势：月营收环比增长 {{ Math.round((revenueData.monthly.revenue - revenueData.weekly.revenue) / revenueData.weekly.revenue * 100) }}%
                </template>
              </el-alert>
            </div>
          </div>
          
          <!-- 房间分析 -->
          <div v-if="activeTab === 'rooms'">
            <el-table :data="popularRooms" stripe border>
              <el-table-column prop="type" label="房间类型" width="150" />
              <el-table-column prop="bookings" label="预订次数" width="150" />
              <el-table-column prop="revenue" label="营收总额">
                <template #default="{ row }">
                  ¥{{ (row.revenue || 0).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column label="平均价格">
                <template #default="{ row }">
                  ¥{{ row.bookings > 0 ? Math.round(row.revenue / row.bookings).toLocaleString() : 0 }}
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 房间状态分布 -->
            <div style="margin-top: 20px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="mini-stat">
                    <div class="mini-stat-label">总房间数</div>
                    <div class="mini-stat-value">{{ dataStore.roomStats.total }}</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="mini-stat">
                    <div class="mini-stat-label">空闲房间</div>
                    <div class="mini-stat-value">{{ dataStore.roomStats.available }}</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="mini-stat">
                    <div class="mini-stat-label">已入住</div>
                    <div class="mini-stat-value">{{ dataStore.roomStats.occupied }}</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="mini-stat">
                    <div class="mini-stat-label">维修中</div>
                    <div class="mini-stat-value">{{ dataStore.roomStats.maintenance }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          
          <!-- 客户分析 -->
          <div v-if="activeTab === 'guests'">
            <el-table :data="guestStats" stripe border>
              <el-table-column prop="month" label="月份" width="120" />
              <el-table-column prop="newGuests" label="新增客户" width="150" />
              <el-table-column prop="totalGuests" label="累计客户" />
            </el-table>
            <div class="summary-box" v-if="guestStats.length > 0">
              <el-alert type="info" :closable="false">
                <template #title>
                  客户分析摘要：本月新增客户 {{ guestStats[guestStats.length - 1].newGuests }} 人，
                  累计客户 {{ guestStats[guestStats.length - 1].totalGuests }} 人
                </template>
              </el-alert>
            </div>
          </div>
          
          <!-- 预订分析 -->
          <div v-if="activeTab === 'bookings'">
            <el-table :data="dataStore.bookings" stripe border>
              <el-table-column prop="id" label="订单号" width="100" />
              <el-table-column prop="guest" label="客户" width="120" />
              <el-table-column prop="room" label="房间号" width="100" />
              <el-table-column prop="checkIn" label="入住日期" width="120" />
              <el-table-column prop="amount" label="金额" width="120">
                <template #default="{ row }">
                  ¥{{ row.amount }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 预订统计 -->
            <div style="margin-top: 20px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="mini-stat">
                    <div class="mini-stat-label">总订单数</div>
                    <div class="mini-stat-value">{{ dataStore.bookings.length }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="mini-stat">
                    <div class="mini-stat-label">总营业额</div>
                    <div class="mini-stat-value">¥{{ dataStore.revenueStats.totalRevenue.toLocaleString() }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="mini-stat">
                    <div class="mini-stat-label">平均订单金额</div>
                    <div class="mini-stat-value">
                      ¥{{ dataStore.bookings.length > 0 ? Math.round(dataStore.revenueStats.totalRevenue / dataStore.bookings.length).toLocaleString() : 0 }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value-large {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-box {
  background-color: #f5f7fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.stat-box:hover {
  background-color: #ecf5ff;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-detail {
  font-size: 12px;
  color: #909399;
}

.summary-box {
  margin-top: 20px;
}

.mini-stat {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #fff;
}

.mini-stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.mini-stat-value {
  font-size: 24px;
  font-weight: bold;
}
</style>