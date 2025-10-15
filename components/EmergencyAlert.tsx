import React from 'react'
import { AlertTriangle, Phone, Heart, Zap } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'

interface EmergencyAlertProps {
  warning: string
  recommendations: string[]
  onCallEmergency?: () => void
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  warning,
  recommendations,
  onCallEmergency,
}) => {
  return (
    <Card className="border-emergency-200 bg-gradient-to-r from-emergency-50 to-red-50 animate-pulse-slow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-emergency-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-emergency-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-emergency-800 mb-2">
            🚨 Medical Emergency Detected
          </h3>
          
          <div className="prose prose-sm max-w-none text-emergency-700 mb-4">
            <p className="whitespace-pre-line">{warning}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-emergency-600" />
              <span className="font-medium text-emergency-800">
                Call 911 immediately
              </span>
            </div>
            
            {recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-emergency-800 flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Immediate Actions:
                </h4>
                <ul className="space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-emergency-700">
                      <Zap className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {onCallEmergency && (
            <div className="mt-6">
              <Button
                variant="emergency"
                size="lg"
                onClick={onCallEmergency}
                className="w-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Services
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default EmergencyAlert
