// stores/data.js
import { defineStore } from 'pinia'

// 默认数据
const defaultRooms = [
  { id: 1, number: '801', type: '豪华间', price: 888, status: '空闲', floor: 8 },
  { id: 2, number: '802', type: '豪华间', price: 888, status: '已入住', floor: 8 },
  { id: 3, number: '501', type: '标准间', price: 388, status: '空闲', floor: 5 },
  { id: 4, number: '502', type: '标准间', price: 388, status: '维修中', floor: 5 },
  { id: 5, number: '1201', type: '总统套房', price: 2888, status: '已预订', floor: 12 }
]

const defaultBookings = [
  { id: 1, guest: '张三', guestPhone: '138****1234', room: '801', checkIn: '2024-01-15', checkOut: '2024-01-18', status: '已确认', amount: 2664 },
  { id: 2, guest: '李四', guestPhone: '139****5678', room: '502', checkIn: '2024-01-16', checkOut: '2024-01-17', status: '待确认', amount: 388 },
  { id: 3, guest: '王五', guestPhone: '137****9012', room: '306', checkIn: '2024-01-14', checkOut: '2024-01-16', status: '已入住', amount: 776 },
  { id: 4, guest: '赵六', guestPhone: '136****3456', room: '1203', checkIn: '2024-01-13', checkOut: '2024-01-15', status: '已完成', amount: 5776 }
]

const defaultGuests = [
  { id: 1, name: '张三', phone: '138****1234', idCard: '410***************', email: 'zhangsan@example.com', totalSpent: 5680, bookingCount: 3 },
  { id: 2, name: '李四', phone: '139****5678', idCard: '420***************', email: 'lisi@example.com', totalSpent: 2340, bookingCount: 2 },
  { id: 3, name: '王五', phone: '137****9012', idCard: '430***************', email: 'wangwu@example.com', totalSpent: 888, bookingCount: 1 }
]

const defaultStaff = [
  { id: 1, name: '王经理', position: '总经理', department: '管理部', phone: '138****1111', hireDate: '2020-01-15', salary: 15000 },
  { id: 2, name: '李主管', position: '客房主管', department: '客房部', phone: '138****2222', hireDate: '2020-03-20', salary: 8000 },
  { id: 3, name: '张领班', position: '前台领班', department: '前台部', phone: '138****3333', hireDate: '2020-05-10', salary: 6000 },
  { id: 4, name: '赵保洁', position: '保洁员', department: '客房部', phone: '138****4444', hireDate: '2020-06-01', salary: 4000 }
]

const defaultServices = [
  { id: 1, name: '早餐服务', description: '中西式自助早餐', price: 68, duration: '07:00-09:30', status: '启用' },
  { id: 2, name: '洗衣服务', description: '快速洗衣，当天送回', price: 50, duration: '08:00-20:00', status: '启用' },
  { id: 3, name: '机场接送', description: '专车接送服务', price: 200, duration: '全天', status: '启用' },
  { id: 4, name: 'SPA服务', description: '专业按摩放松', price: 388, duration: '10:00-22:00', status: '停用' }
]

const defaultHotelInfo = {
  name: 'XX国际酒店',
  address: 'XX市XX区XX路88号',
  phone: '400-888-8888',
  email: 'hotel@example.com',
  description: '五星级豪华酒店，提供优质服务'
}

export const useDataStore = defineStore('data', {
  state: () => ({
    rooms: [],
    bookings: [],
    guests: [],
    staff: [],
    services: [],
    hotelInfo: {}
  }),
  
  persist: {
    key: 'hotel-data',
    storage: localStorage,
    paths: ['rooms', 'bookings', 'guests', 'staff', 'services', 'hotelInfo']
  },
  
  getters: {
    // 房间统计
    roomStats: (state) => ({
      total: state.rooms.length,
      available: state.rooms.filter(r => r.status === '空闲').length,
      occupied: state.rooms.filter(r => r.status === '已入住').length,
      maintenance: state.rooms.filter(r => r.status === '维修中').length
    }),
    
    // 营收统计
    revenueStats: (state) => {
      const totalRevenue = state.bookings.reduce((sum, b) => sum + b.amount, 0)
      const completedBookings = state.bookings.filter(b => b.status === '已完成').length
      const activeBookings = state.bookings.filter(b => b.status === '已入住' || b.status === '已确认').length
      return { totalRevenue, completedBookings, activeBookings }
    }
  },
  
  actions: {
    // 初始化数据（从 localStorage 读取或使用默认数据）
    initData() {
      if (this.rooms.length === 0) {
        this.rooms = [...defaultRooms]
      }
      if (this.bookings.length === 0) {
        this.bookings = [...defaultBookings]
      }
      if (this.guests.length === 0) {
        this.guests = [...defaultGuests]
      }
      if (this.staff.length === 0) {
        this.staff = [...defaultStaff]
      }
      if (this.services.length === 0) {
        this.services = [...defaultServices]
      }
      if (Object.keys(this.hotelInfo).length === 0) {
        this.hotelInfo = { ...defaultHotelInfo }
      }
    },
    
    // 重置所有数据
    resetAllData() {
      this.rooms = [...defaultRooms]
      this.bookings = [...defaultBookings]
      this.guests = [...defaultGuests]
      this.staff = [...defaultStaff]
      this.services = [...defaultServices]
      this.hotelInfo = { ...defaultHotelInfo }
    },
    
    // 房间管理方法
    addRoom(room) {
      const newId = Math.max(...this.rooms.map(r => r.id), 0) + 1
      this.rooms.push({ ...room, id: newId })
    },
    
    updateRoom(room) {
      const index = this.rooms.findIndex(r => r.id === room.id)
      if (index !== -1) {
        this.rooms[index] = { ...room }
      }
    },
    
    deleteRoom(id) {
      const index = this.rooms.findIndex(r => r.id === id)
      if (index !== -1) {
        this.rooms.splice(index, 1)
      }
    },
    
    // 预订管理方法
    addBooking(booking) {
      const newId = Math.max(...this.bookings.map(b => b.id), 0) + 1
      this.bookings.push({ ...booking, id: newId })
      // 更新客户的预订次数和消费总额
      const guest = this.guests.find(g => g.name === booking.guest)
      if (guest) {
        guest.bookingCount = (guest.bookingCount || 0) + 1
        guest.totalSpent = (guest.totalSpent || 0) + booking.amount
      }
    },
    
    updateBooking(booking) {
      const index = this.bookings.findIndex(b => b.id === booking.id)
      if (index !== -1) {
        this.bookings[index] = { ...booking }
      }
    },
    
    deleteBooking(id) {
      const index = this.bookings.findIndex(b => b.id === id)
      if (index !== -1) {
        this.bookings.splice(index, 1)
      }
    },
    
    // 客户管理方法
    addGuest(guest) {
      const newId = Math.max(...this.guests.map(g => g.id), 0) + 1
      this.guests.push({ ...guest, id: newId, totalSpent: 0, bookingCount: 0 })
    },
    
    updateGuest(guest) {
      const index = this.guests.findIndex(g => g.id === guest.id)
      if (index !== -1) {
        this.guests[index] = { ...guest }
      }
    },
    
    deleteGuest(id) {
      const index = this.guests.findIndex(g => g.id === id)
      if (index !== -1) {
        this.guests.splice(index, 1)
      }
    },
    
    // 员工管理方法
    addStaff(staff) {
      const newId = Math.max(...this.staff.map(s => s.id), 0) + 1
      this.staff.push({ ...staff, id: newId })
    },
    
    updateStaff(staff) {
      const index = this.staff.findIndex(s => s.id === staff.id)
      if (index !== -1) {
        this.staff[index] = { ...staff }
      }
    },
    
    deleteStaff(id) {
      const index = this.staff.findIndex(s => s.id === id)
      if (index !== -1) {
        this.staff.splice(index, 1)
      }
    },
    
    // 服务管理方法
    addService(service) {
      const newId = Math.max(...this.services.map(s => s.id), 0) + 1
      this.services.push({ ...service, id: newId })
    },
    
    updateService(service) {
      const index = this.services.findIndex(s => s.id === service.id)
      if (index !== -1) {
        this.services[index] = { ...service }
      }
    },
    
    deleteService(id) {
      const index = this.services.findIndex(s => s.id === id)
      if (index !== -1) {
        this.services.splice(index, 1)
      }
    },
    
    // 酒店信息管理
    updateHotelInfo(info) {
      this.hotelInfo = { ...info }
    }
  }
})