import React from 'react'
import { CheckCircle, AlertCircle, Clock, Target, Brain } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { Assessment } from '@/types/api'
import { getUrgencyColor, getUrgencyIcon, calculateConfidenceColor } from '@/lib/utils'

interface AssessmentCardProps {
  assessment: Assessment
  turnNumber: number
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  turnNumber,
}) => {
  const urgencyColor = getUrgencyColor(assessment.urgency)
  const urgencyIcon = getUrgencyIcon(assessment.urgency)

  return (
    <Card className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-600">
              {turnNumber}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI Assessment
            </h3>
            <p className="text-sm text-gray-500">
              Turn {turnNumber} • {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <Badge
          variant={assessment.urgency === 'emergency' ? 'error' : 
                  assessment.urgency === 'urgent' ? 'warning' : 'success'}
          className={urgencyColor}
        >
          <span className="mr-1">{urgencyIcon}</span>
          {assessment.urgency.toUpperCase()}
        </Badge>
      </div>

      {/* Probable Conditions */}
      {assessment.probable_conditions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Target className="w-4 h-4 mr-2 text-primary-600" />
            Probable Conditions
          </h4>
          <div className="space-y-3">
            {assessment.probable_conditions.map((condition, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">
                    {condition.name}
                  </h5>
                  <span
                    className={`text-sm font-semibold ${calculateConfidenceColor(
                      condition.probability
                    )}`}
                  >
                    {Math.round(condition.probability * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {condition.description}
                </p>
                {condition.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">
                      Recommendations:
                    </p>
                    <ul className="space-y-1">
                      {condition.recommendations.map((rec, recIndex) => (
                        <li
                          key={recIndex}
                          className="text-xs text-gray-600 flex items-start"
                        >
                          <CheckCircle className="w-3 h-3 mt-0.5 mr-1 text-green-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reasoning */}
      {assessment.reasoning && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Brain className="w-4 h-4 mr-2 text-primary-600" />
            AI Reasoning
          </h4>
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            {assessment.reasoning}
          </p>
        </div>
      )}

      {/* Recommendations */}
      {assessment.recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-medical-600" />
            Recommendations
          </h4>
          <ul className="space-y-2">
            {assessment.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-sm text-gray-700"
              >
                <CheckCircle className="w-4 h-4 mt-0.5 text-medical-500 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clarifying Questions */}
      {assessment.clarifying_questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
            Follow-up Questions
          </h4>
          <ul className="space-y-2">
            {assessment.clarifying_questions.map((question, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-sm text-gray-700"
              >
                <Clock className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Body Systems */}
      {assessment.body_systems_affected.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Body Systems Affected</h4>
          <div className="flex flex-wrap gap-2">
            {assessment.body_systems_affected.map((system, index) => (
              <Badge key={index} variant="info" size="sm">
                {system}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          {assessment.disclaimer}
        </p>
      </div>
    </Card>
  )
}

export default AssessmentCard
