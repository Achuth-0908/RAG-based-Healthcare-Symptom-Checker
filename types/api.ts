export interface SessionRequest {
  age: number
  sex: string
  medical_history?: string[]
  medications?: string[]
  allergies?: string[]
}

export interface SessionResponse {
  session_id: string
  message: string
  created_at: string
}

export interface SymptomMessage {
  session_id: string
  message: string
  severity: number
  duration?: string
}

export interface Condition {
  name: string
  probability: number
  description: string
  urgency_level: string
  recommendations: string[]
}

export interface Assessment {
  urgency: 'emergency' | 'urgent' | 'routine'
  emergency_warning?: string
  probable_conditions: Condition[]
  clarifying_questions: string[]
  reasoning: string
  recommendations: string[]
  body_systems_affected: string[]
  disclaimer: string
}

export interface SymptomResponse {
  session_id: string
  assessment: Assessment
  conversation_turn: number
  timestamp: string
}

export interface ConversationTurn {
  user_message: string
  assistant_response: Assessment
  timestamp: string
  severity_reported?: number
}

export interface ConversationHistory {
  session_id: string
  turns: ConversationTurn[]
  total_turns: number
  created_at: string
  last_updated: string
  summary?: string
}

export interface HealthCheck {
  status: string
  services: {
    database: string
    rag: string
    llm: string
  }
}
