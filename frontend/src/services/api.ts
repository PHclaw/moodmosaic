import axios from 'axios'
import { useAuthStore } from '../stores/auth'
const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })
api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token
  if (token) cfg.headers.Authorization = "Bearer " + token
  return cfg
})
export const authApi = {
  register: (d: { email: string; username: string; password: string }) => api.post('/auth/register', d),
  login: (d: { email: string; password: string }) => api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
}
export const moodApi = {
  create: (d: { date: string; mood: string; color: string; note?: string }) => api.post('/moods/', d),
  calendar: (year: number, month?: number) => api.get('/moods/calendar', { params: { year, month } }),
  today: () => api.get('/moods/today'),
  insight: (period: string) => api.get('/moods/insight', { params: { period } }),
}
export default api
