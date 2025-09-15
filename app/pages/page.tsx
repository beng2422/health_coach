'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { WeekSlider } from '@/app/components/week-slider'
import { MotivationMessage } from '@/components/motivation-message'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { getOrCreateDailyInfo, updateDailyInfo } from '@/app/actions/daily-info'

interface DailyReport {
  other: string
  food: string
  activity: string
  date: string
  journal: string
  llm_analysis?: string
  nutrition_info?: {
    calories: number
    protein: number
    carbs: number
    fats: number
    calories_burned: number
    calories_maintenance: number
  }
  user_id: string
  created_at?: string
}

export default function DailyReportPage() {
  const supabase = createClientComponentClient()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [report, setReport] = useState<DailyReport | null>(null)
  const [journalEntry, setJournalEntry] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState('')
  const [nutritionInfo, setNutritionInfo] = useState<DailyReport['nutrition_info']>()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        if (!user) return
        const dateStr = selectedDate.toISOString().split('T')[0]
        
        const data = await getOrCreateDailyInfo(user.id, dateStr)
        setJournalEntry(data?.journal || '')
        setReport(data as DailyReport | null)
        setAnalysisResult(data?.llm_analysis || '')
        setNutritionInfo(data?.nutrition_info)
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to fetch daily report')
      }
    }

    if (user) {
      fetchDailyReport()
    }
  }, [selectedDate, user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (!user) {
        toast.error('You must be logged in to save')
        return
      }

      const dateStr = selectedDate.toISOString().split('T')[0]
      await updateDailyInfo(user.id, dateStr, {
        journal: journalEntry,
        created_at: new Date().toISOString()
      })

      toast.success('Journal entry saved!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save journal entry')
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeEntry = async () => {
    if (!journalEntry.trim()) {
      toast.error('Please write your journal entry first')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            journalEntry: journalEntry,
            userProfile: user?.user_metadata?.user_current_profile || ''
          },
          type: 'analyze'
        })
      })

      if (!response.ok) throw new Error('Analysis failed')
      
      const data = await response.json()
      const { analysis, nutrition } = data

      // Save to database using server action
      if (user) {
        const dateStr = selectedDate.toISOString().split('T')[0]
        await updateDailyInfo(user.id, dateStr, {
          journal: journalEntry,
          llm_analysis: analysis,
          nutrition_info: nutrition
        })
      }

      setAnalysisResult(analysis)
      setNutritionInfo(nutrition)
      toast.success('Analysis complete!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to analyze entry')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-start py-10">
      <div className="w-full max-w-3xl px-4">
        <MotivationMessage dailyInfo={report ? { food: report.food, activity: report.activity, other_notes: report.other || '' } : undefined} />
        
        <div className="mt-6">
          <WeekSlider 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          
          <div className="mt-6 w-full max-w-3xl">
            <div className="rounded-lg border bg-white p-8 shadow-lg">
              <div className="space-y-4">
                <Label htmlFor="journal" className="text-blue-800">Quick Journal Entry</Label>
                <Textarea
                  id="journal"
                  value={journalEntry}
                  onChange={e => setJournalEntry(e.target.value)}
                  placeholder="Write about your day... Include your meals, activities, thoughts, and feelings."
                  className="min-h-[150px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <div className="flex space-x-4">
                  <Button 
                    onClick={analyzeEntry}
                    disabled={isAnalyzing || !journalEntry}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Entry'}
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isLoading || !journalEntry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </div>
            </div>

            {analysisResult && (
              <div className="mt-4 space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h2 className="font-semibold text-green-800 mb-2">Analysis</h2>
                  <p className="text-green-700 whitespace-pre-wrap">{analysisResult}</p>
                </div>
                {nutritionInfo && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="font-semibold text-blue-800 mb-2">Nutrition Estimates</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-blue-600">Calories Consumed: {nutritionInfo.calories}</p>
                        <p className="text-blue-600">Calories Burned: {nutritionInfo.calories_burned}</p>
                        <p className="text-blue-600">Maintenance Calories: {nutritionInfo.calories_maintenance}</p>
                        <p className="text-blue-600">Protein: {nutritionInfo.protein}g</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Carbs: {nutritionInfo.carbs}g</p>
                        <p className="text-blue-600">Fats: {nutritionInfo.fats}g</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 