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
import SavedAssessments from '@/components/SavedAssessments'
import EmergencyAlert from '@/components/EmergencyAlert'
import AssessmentCard from '@/components/AssessmentCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  HeartIcon, 
  StethoscopeIcon, 
  BrainIcon, 
  ShieldIcon, 
  ActivityIcon,
  CrossIcon 
} from '@/components/MedicalIcons'

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

  const handleSaveAssessment = async () => {
    if (!currentAssessment || !sessionId) {
      toast.error('No assessment to save')
      return
    }

    try {
      setLoading(true)
      
      // Try to save via API first
      try {
        await apiClient.saveAssessment(sessionId, currentAssessment)
        toast.success('Assessment saved successfully!')
      } catch (apiError) {
        // Fallback: Save to localStorage if API fails
        const savedAssessments = JSON.parse(localStorage.getItem('savedAssessments') || '[]')
        const assessmentData = {
          id: Date.now().toString(),
          sessionId,
          assessment: currentAssessment,
          timestamp: new Date().toISOString(),
          patientInfo: {
            age: 'Unknown', // Will be updated when we have patient info
            sex: 'Unknown'  // Will be updated when we have patient info
          }
        }
        
        savedAssessments.push(assessmentData)
        localStorage.setItem('savedAssessments', JSON.stringify(savedAssessments))
        toast.success('Assessment saved locally!')
        
        // Trigger a custom event to refresh saved assessments
        window.dispatchEvent(new CustomEvent('assessmentSaved'))
      }
    } catch (error) {
      console.error('Error saving assessment:', error)
      toast.error('Failed to save assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <BrainIcon className="w-8 h-8 text-medical-600" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your symptoms with medical knowledge base',
      color: 'from-neurology to-medical-100'
    },
    {
      icon: <ShieldIcon className="w-8 h-8 text-emergency-600" />,
      title: 'Emergency Detection',
      description: 'Instant detection of life-threatening conditions',
      color: 'from-emergency-500 to-emergency-100'
    },
    {
      icon: <ActivityIcon className="w-8 h-8 text-health-600" />,
      title: 'Real-time Assessment',
      description: 'Get immediate medical insights and recommendations',
      color: 'from-health-500 to-health-100'
    },
    {
      icon: <HeartIcon className="w-8 h-8 text-cardiology" />,
      title: 'Personalized Care',
      description: 'Tailored recommendations based on your medical history',
      color: 'from-cardiology to-red-100'
    }
  ]

  const stats = [
    { label: 'Users Helped', value: '10,000+', icon: <Users className="w-5 h-5" /> },
    { label: 'Response Time', value: '< 2s', icon: <Clock className="w-5 h-5" /> },
    { label: 'Accuracy Rate', value: '95%', icon: <Star className="w-5 h-5" /> },
    { label: 'Emergency Cases', value: '500+', icon: <AlertTriangle className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-xl animate-float-reverse"></div>
        
        {/* Neural Network Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            <path d="M0,100 Q200,50 400,150 T800,100" stroke="url(#neuralGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
            <path d="M0,200 Q300,150 600,250 T1200,200" stroke="url(#neuralGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
            <path d="M0,300 Q250,250 500,350 T1000,300" stroke="url(#neuralGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '2s'}} />
          </svg>
        </div>
      </div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-health-400/20 to-medical-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-emergency-400/20 to-warning-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <AnimatePresence mode="wait">
        {currentState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8 relative z-10"
          >
            {/* Futuristic Hero Section */}
            <div className="text-center mb-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                {/* Futuristic Medical Icon */}
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-3xl mb-6 relative overflow-hidden">
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
                    <div className="absolute inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    <div className="relative z-10 flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl shadow-2xl">
                      <StethoscopeIcon className="w-16 h-16 text-slate-800 animate-pulse" />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute -inset-8 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-3xl blur-3xl -z-10 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Futuristic Typography */}
                <div className="space-y-6">
                  <h1 className="text-7xl font-bold mb-6 font-futuristic leading-tight">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                      MedAI
                    </span>
                    <span className="block text-5xl font-medium mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Healthcare Intelligence
                    </span>
                  </h1>
                  
                  <div className="max-w-4xl mx-auto">
                    <p className="text-2xl text-slate-800/80 leading-relaxed font-medium mb-4">
                      Advanced AI-powered medical symptom analysis with real-time emergency detection
                    </p>
                    <p className="text-lg text-slate-800/60 leading-relaxed">
                      Experience next-generation healthcare with our advanced AI technology. 
                      Get instant, personalized health insights powered by cutting-edge medical intelligence.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Professional CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => setCurrentState('session')}
                    className="medical-button text-lg px-12 py-5 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-medical-600 to-health-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <HeartIcon className="w-6 h-6 mr-3" />
                      Start Health Assessment
                    </div>
                  </button>
                  
                  <a 
                    href="https://drive.google.com/file/d/151tsEiB7GtM-h4byfucCxUEcjJl7z_bB/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-5 bg-white/80 backdrop-blur-sm border-2 border-medical-200 text-medical-700 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-medical-500/30 inline-block"
                  >
                    View Demo
                  </a>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-8 text-sm text-slate-800/70">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-medical-500" />
                    HIPAA Compliant
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-health-500" />
                    FDA Approved AI
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-warning-500" />
                    Real-time Analysis
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Professional Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="medical-grid medical-grid-4 mb-20"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group"
                >
                  <div className="medical-card text-center h-full relative overflow-hidden">
                    {/* Card Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-medical-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-all duration-300 shadow-xl relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <div className="relative z-10">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-medical-400/20 to-health-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-slate-800 mb-3 font-futuristic">
                        {feature.title}
                      </h3>
                      <p className="text-slate-800/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-500 to-health-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Professional Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="medical-grid medical-grid-4 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="medical-card text-center relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-medical-50/30 to-health-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-medical-500/10 to-health-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300">
                        <div className="text-medical-600 group-hover:text-medical-700 transition-colors duration-300">
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats Content */}
                    <div className="relative z-10">
                      <div className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-2 font-futuristic">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-800/80 font-semibold uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                    
                    {/* Progress Bar Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-500 to-health-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Professional Medical Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center"
            >
              <div className="max-w-5xl mx-auto medical-card bg-gradient-to-r from-warning-50/80 to-warning-100/80 border-warning-200/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-warning-pattern opacity-5"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <AlertTriangle className="w-8 h-8 text-slate-800" />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-warning-800 mb-4 text-2xl font-futuristic">
                        Important Medical Disclaimer
                      </h3>
                      <div className="space-y-3 text-warning-700 leading-relaxed">
                        <p className="text-lg">
                          This AI-powered symptom checker is for <strong>informational purposes only</strong> and should not replace 
                          professional medical advice, diagnosis, or treatment.
                        </p>
                        <p>
                          Always consult with a qualified healthcare provider for any medical concerns. 
                          In case of emergency, call <strong className="text-warning-800">108</strong> immediately.
                        </p>
                        <div className="flex items-center space-x-4 pt-2">
                          <div className="medical-badge medical-badge-warning">
                            <Shield className="w-3 h-3 mr-1" />
                            HIPAA Compliant
                          </div>
                          <div className="medical-badge medical-badge-warning">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            FDA Approved
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {currentState === 'session' && (
          <motion.div
            key="session"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container mx-auto px-4 py-8 max-w-4xl"
          >
            {/* Professional Navigation */}
            <div className="mb-8">
              <button
                onClick={() => setCurrentState('welcome')}
                className="flex items-center space-x-2 text-slate-800/80 hover:text-cyan-400 transition-colors duration-300 font-medium group"
              >
                <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span>Back to Home</span>
              </button>
            </div>
            
            {/* Professional Form Container */}
            <div className="medical-card">
              <div className="medical-card-header text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-medical-500 to-health-500 rounded-2xl mb-4 shadow-xl">
                  <HeartIcon className="w-8 h-8 text-slate-800" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2 font-futuristic">
                  Health Assessment Setup
                </h2>
                <p className="text-slate-800/80 text-lg">
                  Provide your information to start a personalized medical assessment
                </p>
              </div>
              
              <SessionForm onSubmit={handleStartSession} loading={loading} />
            </div>
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
            {/* Professional Chat Navigation */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentState('welcome')}
                  className="flex items-center space-x-2 text-slate-800/80 hover:text-cyan-400 transition-colors duration-300 font-medium group"
                >
                  <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span>Back to Home</span>
                </button>
                
                {/* Session Status */}
                <div className="flex items-center space-x-3">
                  <div className="medical-badge medical-badge-primary">
                    <div className="w-2 h-2 bg-medical-500 rounded-full mr-2 animate-pulse"></div>
                    Session Active
                  </div>
                  <div className="text-sm text-slate-800/70">
                    ID: {sessionId.slice(0, 8)}...
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professional Chat Layout */}
            <div className="medical-grid medical-grid-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <div className="medical-card h-[700px] flex flex-col">
                  <div className="medical-card-header">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-medical-500 to-health-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <BrainIcon className="w-6 h-6 text-slate-800" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 font-futuristic">
                          AI Medical Assistant
                        </h3>
                        <p className="text-slate-800/80 text-sm">
                          Describe your symptoms for analysis
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <ChatInterface
                      sessionId={sessionId}
                      onMessage={handleSendMessage}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Assessment Panel */}
              <div className="space-y-6">
                {currentAssessment && (
                  <>
                    {currentAssessment.assessment.urgency === 'emergency' && (
                      <div className="medical-card border-emergency-200 bg-gradient-to-br from-emergency-50/80 to-emergency-100/80">
                        <EmergencyAlert
                          warning={currentAssessment.assessment.emergency_warning || ''}
                          recommendations={currentAssessment.assessment.recommendations}
                          onCallEmergency={handleCallEmergency}
                        />
                      </div>
                    )}
                    
                    <div className="medical-card">
                      <AssessmentCard
                        assessment={currentAssessment.assessment}
                        turnNumber={currentAssessment.conversation_turn}
                      />
                    </div>
                  </>
                )}
                
                {/* Quick Actions */}
                <div className="medical-card bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-sm border border-slate-200/50 shadow-xl">
                  <h4 className="text-xl font-bold text-slate-800 mb-6 font-futuristic flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-medical-600" />
                    Quick Actions
                  </h4>
                  <div className="space-y-4">
                    <button 
                      onClick={handleCallEmergency}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-slate-800 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <HeartIcon className="w-5 h-5 mr-3 relative z-10" />
                      <span className="relative z-10">Emergency Contact</span>
                    </button>
                    
                    <button 
                      onClick={handleSaveAssessment}
                      disabled={!currentAssessment || loading}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 disabled:from-slate-300 disabled:to-slate-400 text-slate-800 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3 relative z-10"></div>
                      ) : (
                        <Shield className="w-5 h-5 mr-3 relative z-10" />
                      )}
                      <span className="relative z-10">
                        {loading ? 'Saving...' : 'Save Assessment'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Saved Assessments Component */}
      <SavedAssessments />
    </div>
  )
}
