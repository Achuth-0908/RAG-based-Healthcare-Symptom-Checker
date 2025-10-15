import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Calendar, Pill, AlertTriangle, Plus, X, Stethoscope } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import { SessionRequest } from '@/types/api'
import { UserIcon, ClockIcon, ShieldIcon } from './MedicalIcons'

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
    onSubmit({
      age: data.age,
      sex: data.sex,
      medical_history: medicalHistory,
      medications: medications,
      allergies: allergies,
    })
  }

  return (
    <div className="space-y-8">
      {/* Futuristic Form Header */}
      <div className="text-center">
        <div className="medical-card mb-8">
          <div className="flex items-start space-x-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl relative overflow-hidden">
                {/* Rotating Ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                <div className="absolute inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                <div className="relative z-10 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl">
                  <ShieldIcon className="w-7 h-7 text-white animate-pulse" />
                </div>
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-2xl blur-lg -z-10 animate-pulse"></div>
              </div>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-2xl font-bold mb-3 font-futuristic">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Patient Information Required
                </span>
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                <span className="text-cyan-400 font-semibold">Required:</span> Age and Sex are mandatory for medical assessment. 
                Medical history, medications, and allergies are optional but significantly improve diagnostic accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Required Information Section */}
        <div className="medical-card">
          <div className="medical-card-header">
            <h3 className="text-xl font-bold font-futuristic">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Required Information
              </span>
            </h3>
            <p className="text-white/70">
              Basic demographic information for medical assessment
            </p>
          </div>
          
          <div className="medical-grid medical-grid-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2 mb-3">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Age</span>
                <span className="text-emergency-500">*</span>
              </label>
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
                className="medical-input"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Sex</span>
                <span className="text-emergency-500">*</span>
              </label>
              <select
                className="medical-input"
                {...register('sex', { required: 'Sex is required' })}
              >
                <option value="">Select your sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.sex && (
                <p className="mt-2 text-sm text-emergency-500 font-medium">{errors.sex.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Medical History Section */}
        <div className="medical-card">
          <div className="medical-card-header">
            <h3 className="text-xl font-bold font-futuristic">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Medical History
              </span>
            </h3>
            <p className="text-white/70">
              Previous medical conditions and diagnoses (optional)
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              <Input
                placeholder="e.g., diabetes, hypertension, asthma"
                value={newMedicalHistory}
                onChange={(e) => setNewMedicalHistory(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                className="medical-input flex-1"
              />
              <button
                type="button"
                onClick={addMedicalHistory}
                disabled={!newMedicalHistory.trim()}
                className="medical-button px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {medicalHistory.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {medicalHistory.map((item, index) => (
                  <span
                    key={index}
                    className="medical-badge medical-badge-primary group"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMedicalHistory(index)}
                      className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medications Section */}
        <div className="medical-card">
          <div className="medical-card-header">
            <h3 className="text-xl font-bold font-futuristic">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Current Medications
              </span>
            </h3>
            <p className="text-white/70">
              Medications you are currently taking (optional)
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              <Input
                placeholder="e.g., metformin, lisinopril, aspirin"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                leftIcon={<Pill className="w-4 h-4" />}
                className="medical-input flex-1"
              />
              <button
                type="button"
                onClick={addMedication}
                disabled={!newMedication.trim()}
                className="medical-button px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {medications.map((item, index) => (
                  <span
                    key={index}
                    className="medical-badge medical-badge-health group"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Allergies Section */}
        <div className="medical-card">
          <div className="medical-card-header">
            <h3 className="text-xl font-bold font-futuristic">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Allergies
              </span>
            </h3>
            <p className="text-white/70">
              Known allergies and adverse reactions (optional)
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              <Input
                placeholder="e.g., penicillin, shellfish, latex"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                leftIcon={<AlertTriangle className="w-4 h-4" />}
                className="medical-input flex-1"
              />
              <button
                type="button"
                onClick={addAllergy}
                disabled={!newAllergy.trim()}
                className="medical-button px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {allergies.map((item, index) => (
                  <span
                    key={index}
                    className="medical-badge medical-badge-warning group"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="ml-2 text-pink-400 hover:text-pink-300 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={!isValid || !watchedAge || !watchedSex || loading}
            className="medical-button text-lg px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Starting Assessment...
              </div>
            ) : !isValid || !watchedAge || !watchedSex ? (
              'Please fill in required fields'
            ) : (
              <div className="flex items-center">
                <Stethoscope className="w-5 h-5 mr-3" />
                Start Health Assessment
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SessionForm