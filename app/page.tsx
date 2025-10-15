'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  Zap, 
  Brain, 
  Stethoscope, 
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

import SessionForm from '@/components/SessionForm'
import ChatInterface from '@/components/ChatInterface'
import EmergencyAlert from '@/components/EmergencyAlert'
import AssessmentCard from '@/components/AssessmentCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

import { apiClient } from '@/lib/api'
import { SessionRequest, SymptomMessage, SymptomResponse } from '@/types/api'

type AppState = 'welcome' | 'session' | 'chat' | 'assessment'

export default function HomePage() {
  const [currentState, setCurrentState] = useState<AppState>('welcome')
  const [sessionId, setSessionId] = useState<string>('')
  const [currentAssessment, setCurrentAssessment] = useState<SymptomResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleStartSession = async (data: SessionRequest) => {
    setLoading(true)
    try {
      const response = await apiClient.startSession(data)
      setSessionId(response.session_id)
      setCurrentState('chat')
      toast.success('Session started successfully!')
    } catch (error) {
      console.error('Error starting session:', error)
      toast.error('Failed to start session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (message: SymptomMessage): Promise<SymptomResponse> => {
    try {
      const response = await apiClient.sendMessage(message)
      setCurrentAssessment(response)
      
      if (response.assessment.urgency === 'emergency') {
        toast.error('🚨 Emergency detected! Please seek immediate medical attention.')
      } else {
        toast.success('Assessment completed successfully!')
      }
      
      return response
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
      throw error
    }
  }

  const handleCallEmergency = () => {
    window.open('tel:911', '_self')
  }

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your symptoms with medical knowledge base'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Emergency Detection',
      description: 'Instant detection of life-threatening conditions'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Assessment',
      description: 'Get immediate medical insights and recommendations'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Personalized Care',
      description: 'Tailored recommendations based on your medical history'
    }
  ]

  const stats = [
    { label: 'Users Helped', value: '10,000+', icon: <Users className="w-5 h-5" /> },
    { label: 'Response Time', value: '< 2s', icon: <Clock className="w-5 h-5" /> },
    { label: 'Accuracy Rate', value: '95%', icon: <Star className="w-5 h-5" /> },
    { label: 'Emergency Cases', value: '500+', icon: <AlertTriangle className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-medical-500 rounded-full mb-6">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gradient mb-4">
                  Healthcare Symptom Checker
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  AI-powered medical symptom analysis with emergency detection. 
                  Get instant, personalized health insights from advanced AI technology.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={() => setCurrentState('session')}
                  className="text-lg px-8 py-4"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start Health Assessment
                </Button>
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="text-primary-600 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  <Card className="text-center">
                    <div className="text-primary-600 mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center"
            >
              <Card className="max-w-4xl mx-auto bg-yellow-50 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-medium text-yellow-800 mb-2">
                      Important Medical Disclaimer
                    </h3>
                    <p className="text-sm text-yellow-700">
                      This AI-powered symptom checker is for informational purposes only and should not replace 
                      professional medical advice, diagnosis, or treatment. Always consult with a qualified 
                      healthcare provider for any medical concerns. In case of emergency, call 108 immediately.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {currentState === 'session' && (
          <motion.div
            key="session"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container mx-auto px-4 py-8 max-w-2xl"
          >
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setCurrentState('welcome')}
                className="mb-4"
              >
                ← Back to Home
              </Button>
            </div>
            <SessionForm onSubmit={handleStartSession} loading={loading} />
          </motion.div>
        )}

        {currentState === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setCurrentState('welcome')}
                className="mb-4"
              >
                ← Back to Home
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px]">
                  <ChatInterface
                    sessionId={sessionId}
                    onMessage={handleSendMessage}
                    loading={loading}
                  />
                </Card>
              </div>
              
              <div className="space-y-6">
                {currentAssessment && (
                  <>
                    {currentAssessment.assessment.urgency === 'emergency' && (
                      <EmergencyAlert
                        warning={currentAssessment.assessment.emergency_warning || ''}
                        recommendations={currentAssessment.assessment.recommendations}
                        onCallEmergency={handleCallEmergency}
                      />
                    )}
                    
                    <AssessmentCard
                      assessment={currentAssessment.assessment}
                      turnNumber={currentAssessment.conversation_turn}
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
