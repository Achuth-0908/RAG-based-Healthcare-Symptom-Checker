import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Calendar, Pill, AlertTriangle, Plus, X } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import { SessionRequest } from '@/types/api'

interface SessionFormProps {
  onSubmit: (data: SessionRequest) => void
  loading?: boolean
}

interface FormData {
  age: number
  sex: string
  medicalHistory: string[]
  medications: string[]
  allergies: string[]
}

const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, loading }) => {
  const [medicalHistory, setMedicalHistory] = useState<string[]>([])
  const [medications, setMedications] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [newMedicalHistory, setNewMedicalHistory] = useState('')
  const [newMedication, setNewMedication] = useState('')
  const [newAllergy, setNewAllergy] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
  })
  
  const watchedAge = watch('age')
  const watchedSex = watch('sex')

  const addMedicalHistory = () => {
    if (newMedicalHistory.trim()) {
      setMedicalHistory([...medicalHistory, newMedicalHistory.trim()])
      setNewMedicalHistory('')
    }
  }

  const removeMedicalHistory = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_, i) => i !== index))
  }

  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()])
      setNewMedication('')
    }
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()])
      setNewAllergy('')
    }
  }

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index))
  }

  const onFormSubmit = (data: FormData) => {
    console.log('Form submitted with data:', data)
    console.log('Medical history:', medicalHistory)
    console.log('Medications:', medications)
    console.log('Allergies:', allergies)
    
    onSubmit({
      age: data.age,
      sex: data.sex,
      medical_history: medicalHistory,
      medications: medications,
      allergies: allergies,
    })
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start Your Health Assessment
          </h2>
          <p className="text-gray-600">
            Provide some basic information to get personalized medical insights
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Required:</strong> Age and Sex are required to start your assessment. 
              Medical history, medications, and allergies are optional but help provide more accurate insights.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Age and Sex */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Age"
              type="number"
              placeholder="Enter your age"
              leftIcon={<Calendar className="w-4 h-4" />}
              {...register('age', {
                required: 'Age is required',
                min: { value: 1, message: 'Age must be at least 1' },
                max: { value: 150, message: 'Age must be realistic' },
                valueAsNumber: true,
              })}
              error={errors.age?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                {...register('sex', { required: 'Sex is required' })}
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.sex && (
                <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Medical History
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add medical condition"
                value={newMedicalHistory}
                onChange={(e) => setNewMedicalHistory(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addMedicalHistory}
                disabled={!newMedicalHistory.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {medicalHistory.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medicalHistory.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMedicalHistory(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Current Medications
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add medication"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                leftIcon={<Pill className="w-4 h-4" />}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addMedication}
                disabled={!newMedication.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medications.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Allergies
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                leftIcon={<AlertTriangle className="w-4 h-4" />}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addAllergy}
                disabled={!newAllergy.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full"
            disabled={!isValid || !watchedAge || !watchedSex}
          >
            {!isValid || !watchedAge || !watchedSex 
              ? 'Please fill in required fields' 
              : 'Start Health Assessment'
            }
          </Button>
        </form>
      </div>
    </Card>
  )
}

export default SessionForm
