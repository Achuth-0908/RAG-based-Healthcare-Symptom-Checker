import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, AlertCircle } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import { SymptomMessage, SymptomResponse } from '@/types/api'

interface ChatInterfaceProps {
  sessionId: string
  onMessage: (message: SymptomMessage) => Promise<SymptomResponse>
  loading?: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId,
  onMessage,
  loading = false,
}) => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState(5)
  const [duration, setDuration] = useState('')
  const [messages, setMessages] = useState<SymptomResponse[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || loading) return

    const userMessage: SymptomMessage = {
      session_id: sessionId,
      message: message.trim(),
      severity,
      duration: duration || undefined,
    }

    try {
      const response = await onMessage(userMessage)
      setMessages([...messages, response])
      setMessage('')
      setDuration('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600 bg-red-50 border-red-200'
    if (severity >= 6) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (severity >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start describing your symptoms
            </h3>
            <p className="text-gray-600">
              Be as detailed as possible for the best assessment
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <Card className="max-w-xs bg-primary-50 border-primary-200">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900">{msg.assessment.reasoning}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Severity: {msg.assessment.urgency}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <Card className="max-w-2xl bg-white border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-600">AI</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Assessment #{msg.conversation_turn}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                          msg.assessment.urgency === 'emergency' ? 10 :
                          msg.assessment.urgency === 'urgent' ? 7 : 4
                        )}`}
                      >
                        {msg.assessment.urgency.toUpperCase()}
                      </span>
                    </div>
                    
                    {msg.assessment.emergency_warning && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <p className="text-sm text-red-800 font-medium">
                            Emergency Detected
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.assessment.probable_conditions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Probable Conditions:
                        </h4>
                        <div className="space-y-2">
                          {msg.assessment.probable_conditions.slice(0, 2).map((condition, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium text-gray-900">
                                {condition.name}
                              </span>
                              <span className="text-gray-600 ml-2">
                                ({Math.round(condition.probability * 100)}% confidence)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.assessment.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Recommendations:
                        </h4>
                        <ul className="space-y-1">
                          {msg.assessment.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.assessment.clarifying_questions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Questions:
                        </h4>
                        <ul className="space-y-1">
                          {msg.assessment.clarifying_questions.slice(0, 2).map((question, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              • {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Describe your symptoms..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span className="font-medium">{severity}</span>
                <span>Severe</span>
              </div>
            </div>

            <Input
              placeholder="Duration (e.g., 2 hours)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={!message.trim() || loading}
            loading={loading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
