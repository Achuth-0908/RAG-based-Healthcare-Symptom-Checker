import axios from 'axios'
import type {
  SessionRequest,
  SessionResponse,
  SymptomMessage,
  SymptomResponse,
  ConversationHistory,
  HealthCheck,
} from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiClient = {
  // Health check
  async healthCheck(): Promise<HealthCheck> {
    const response = await api.get('/api/health')
    return response.data
  },

  // Session management
  async startSession(data: SessionRequest): Promise<SessionResponse> {
    const response = await api.post('/api/symptom/start', data)
    return response.data
  },

  // Symptom analysis
  async sendMessage(data: SymptomMessage): Promise<SymptomResponse> {
    const response = await api.post('/api/symptom/message', data)
    return response.data
  },

  // Conversation history
  async getHistory(sessionId: string): Promise<ConversationHistory> {
    const response = await api.get(`/api/history/${sessionId}`)
    return response.data
  },

  // Export conversation
  async exportConversation(sessionId: string, format: 'json' | 'text') {
    const response = await api.post('/api/history/export', {
      session_id: sessionId,
      format,
    })
    return response.data
  },

  // Save assessment
  async saveAssessment(sessionId: string, assessment: any) {
    const response = await api.post('/api/history/save', {
      session_id: sessionId,
      assessment,
    })
    return response.data
  },
}

export default api
