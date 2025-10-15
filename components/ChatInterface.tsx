import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, AlertCircle, User, Bot } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import { SymptomMessage, SymptomResponse } from '@/types/api'
import { UserIcon, BrainIcon, ShieldIcon } from './MedicalIcons'

interface ChatInterfaceProps {
  sessionId: string
  onMessage: (message: SymptomMessage) => Promise<SymptomResponse>
  loading?: boolean
}

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  severity?: number
  timestamp: string
  assessment?: SymptomResponse['assessment']
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId,
  onMessage,
  loading = false,
}) => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState(5)
  const [duration, setDuration] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isLoading) return

    const userMessage: SymptomMessage = {
      session_id: sessionId,
      message: message.trim(),
      duration: duration.trim() || 'unknown',
      severity: severity,
    }

    // Add user message to chat
    const userChatMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      severity: severity,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userChatMessage])
    setMessage('')
    setDuration('')
    setIsLoading(true)

    try {
      const response = await onMessage(userMessage)
      
      // Add AI response to chat
      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.assessment.reasoning || 'Assessment completed',
        timestamp: new Date().toISOString(),
        assessment: response.assessment,
      }

      setMessages(prev => [...prev, aiChatMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-emergency-600 bg-emergency-50 border-emergency-200'
    if (severity >= 6) return 'text-warning-600 bg-warning-50 border-warning-200'
    if (severity >= 4) return 'text-warning-500 bg-warning-50 border-warning-200'
    return 'text-health-600 bg-health-50 border-health-200'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'text-emergency-600 bg-emergency-50 border-emergency-200'
      case 'urgent':
        return 'text-warning-600 bg-warning-50 border-warning-200'
      default:
        return 'text-health-600 bg-health-50 border-health-200'
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Futuristic Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-medical-500 to-health-500 rounded-3xl mb-6 shadow-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                <MessageCircle className="w-12 h-12 text-slate-800 relative z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emergency-500 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-medical-400/30 to-health-400/30 rounded-3xl blur-2xl -z-10"></div>
            </div>
            <h3 className="text-3xl font-bold mb-4 font-futuristic">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                AI Medical Assistant Ready
              </span>
            </h3>
            <p className="text-slate-800/80 max-w-lg mx-auto text-lg leading-relaxed mb-6">
              Describe your symptoms in detail for professional medical analysis. 
              Include timing, severity, and any associated factors.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="medical-badge medical-badge-primary">
                <ShieldIcon className="w-3 h-3 mr-1" />
                HIPAA Secure
              </span>
              <span className="medical-badge medical-badge-primary">
                <BrainIcon className="w-3 h-3 mr-1" />
                AI-Powered
              </span>
              <span className="medical-badge medical-badge-primary">
                <MessageCircle className="w-3 h-3 mr-1" />
                Real-time
              </span>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`max-w-3xl ${msg.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                {msg.type === 'user' ? (
                  <div className="medical-chat-bubble medical-chat-user">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <UserIcon className="w-5 h-5 text-slate-800" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-semibold leading-relaxed">{msg.content}</p>
                        <div className="flex items-center justify-between mt-3 text-xs text-slate-800/90">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Severity:</span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                msg.severity && msg.severity >= 8 ? 'bg-emergency-300' :
                                msg.severity && msg.severity >= 6 ? 'bg-warning-300' :
                                msg.severity && msg.severity >= 4 ? 'bg-warning-200' :
                                'bg-health-300'
                              }`}></div>
                              <span className="font-bold">{msg.severity}/10</span>
                            </div>
                          </div>
                          <span className="font-medium">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="medical-chat-bubble medical-chat-assistant">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-medical-500 to-health-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <BrainIcon className="w-6 h-6 text-slate-800" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-slate-800 font-futuristic">
                              AI Medical Assessment
                            </span>
                            {msg.assessment && (
                              <span className={`medical-status-indicator ${
                                msg.assessment.urgency === 'emergency' ? 'medical-status-emergency' :
                                msg.assessment.urgency === 'urgent' ? 'medical-status-warning' :
                                'medical-status-healthy'
                              }`}>
                                {msg.assessment.urgency.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-800/70 font-medium">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-neutral-800 leading-relaxed">{msg.content}</p>
                        
                        {msg.assessment?.emergency_warning && (
                          <div className="medical-card border-emergency-200 bg-gradient-to-r from-emergency-50/80 to-emergency-100/80 relative overflow-hidden">
                            <div className="absolute inset-0 bg-emergency-pattern opacity-5"></div>
                            <div className="relative z-10">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-emergency-500 to-emergency-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                  <AlertCircle className="w-6 h-6 text-slate-800" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-emergency-800 mb-2 text-lg font-futuristic">
                                    🚨 Emergency Detected
                                  </h4>
                                  <p className="text-emergency-700 leading-relaxed">
                                    {msg.assessment.emergency_warning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.assessment?.probable_conditions && msg.assessment.probable_conditions.length > 0 && (
                          <div className="bg-gradient-to-r from-medical-50 to-health-50 rounded-xl p-4 border border-medical-200">
                            <h4 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center space-x-2">
                              <ShieldIcon className="w-4 h-4 text-medical-600" />
                              <span>Probable Conditions</span>
                            </h4>
                            <div className="space-y-2">
                              {msg.assessment.probable_conditions.map((condition, index) => (
                                <div key={index} className="text-sm text-neutral-700 bg-white/50 rounded-lg p-2">
                                  {condition.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.assessment?.recommendations && msg.assessment.recommendations.length > 0 && (
                          <div className="bg-gradient-to-r from-health-50 to-medical-50 rounded-xl p-4 border border-health-200">
                            <h4 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center space-x-2">
                              <svg className="w-4 h-4 text-health-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Recommendations</span>
                            </h4>
                            <ul className="space-y-2">
                              {msg.assessment.recommendations.map((recommendation, index) => (
                                <li key={index} className="text-sm text-neutral-700 flex items-start space-x-2">
                                  <span className="text-health-600 mt-1">•</span>
                                  <span>{recommendation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-slide-in-right">
            <div className="medical-chat-bubble medical-chat-assistant">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-medical-500 to-health-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BrainIcon className="w-5 h-5 text-slate-800 animate-pulse" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-800/80">Analyzing symptoms...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-medical-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-medical-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-medical-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Professional Input Form */}
      <div className="border-t border-slate-200 p-8 bg-gradient-to-r from-white via-slate-50/50 to-medical-50/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="medical-grid medical-grid-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800/90 flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-medical-500" />
                  <span>Symptom Description</span>
                </label>
                <Input
                  placeholder="Describe your symptoms in detail... (e.g., chest pain, headache, fever)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  className="medical-input text-base"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-slate-800/90 flex items-center space-x-2 mb-3">
                <AlertCircle className="w-4 h-4 text-warning-500" />
                <span>Severity Level</span>
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="medical-severity-slider"
                    disabled={isLoading}
                    style={{
                      background: `linear-gradient(to right, 
                        ${severity >= 8 ? '#ef4444' : severity >= 6 ? '#f59e0b' : severity >= 4 ? '#f59e0b' : '#22c55e'} 0%, 
                        ${severity >= 8 ? '#ef4444' : severity >= 6 ? '#f59e0b' : severity >= 4 ? '#f59e0b' : '#22c55e'} ${(severity - 1) * 11.11}%, 
                        #e5e7eb ${(severity - 1) * 11.11}%, 
                        #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-800/70 font-medium">
                  <span>Mild (1)</span>
                  <span className={`medical-status-indicator ${
                    severity >= 8 ? 'medical-status-emergency' :
                    severity >= 6 ? 'medical-status-warning' :
                    'medical-status-healthy'
                  }`}>
                    {severity}/10
                  </span>
                  <span>Severe (10)</span>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-bold ${
                    severity >= 8 ? 'text-emergency-600' :
                    severity >= 6 ? 'text-warning-600' :
                    severity >= 4 ? 'text-warning-500' :
                    'text-health-600'
                  }`}>
                    {severity >= 8 ? '🚨 Critical' :
                     severity >= 6 ? '⚠️ Severe' :
                     severity >= 4 ? '⚡ Moderate' :
                     '✅ Mild'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="medical-grid medical-grid-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-800/90 flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-medical-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Duration</span>
              </label>
              <Input
                placeholder="e.g., 2 hours, since yesterday, 3 days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={isLoading}
                className="medical-input"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="medical-button w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {isLoading ? 'Analyzing...' : 'Send for Analysis'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface