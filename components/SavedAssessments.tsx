'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react'

interface SavedAssessment {
  id: string
  sessionId: string
  assessment: any
  timestamp: string
  patientInfo: {
    age: string
    sex: string
  }
}

const SavedAssessments: React.FC = () => {
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadAssessments = () => {
      const assessments = JSON.parse(localStorage.getItem('savedAssessments') || '[]')
      setSavedAssessments(assessments)
    }
    
    loadAssessments()
    
    // Listen for new assessments
    const handleAssessmentSaved = () => {
      loadAssessments()
    }
    
    window.addEventListener('assessmentSaved', handleAssessmentSaved)
    
    return () => {
      window.removeEventListener('assessmentSaved', handleAssessmentSaved)
    }
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'urgent':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'routine':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <AlertCircle className="w-4 h-4" />
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  if (savedAssessments.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 text-slate-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Shield className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/50">
          <div className="p-4 border-b border-slate-200/50">
            <h3 className="font-semibold text-slate-800">Saved Assessments</h3>
          </div>
          
          <div className="p-4 space-y-3">
            {savedAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getUrgencyIcon(assessment.assessment.assessment.urgency)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(assessment.assessment.assessment.urgency)}`}>
                      {assessment.assessment.assessment.urgency.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-800/70">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-800/80 mb-2">
                  <User className="w-3 h-3" />
                  <span>{assessment.patientInfo.age} years, {assessment.patientInfo.sex}</span>
                </div>
                
                <div className="text-sm text-slate-800/90">
                  {assessment.assessment.assessment.probable_conditions?.slice(0, 2).map((condition: any, index: number) => (
                    <span key={index}>
                      {condition.name}
                      {index < Math.min(assessment.assessment.assessment.probable_conditions.length, 2) - 1 && ', '}
                    </span>
                  ))}
                  {assessment.assessment.assessment.probable_conditions?.length > 2 && '...'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedAssessments
