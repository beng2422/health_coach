'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface DailyInfo {
  id: string
  user_id: string
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
  created_at?: string
}

export async function getOrCreateDailyInfo(userId: string, date: string): Promise<DailyInfo | null> {
  const supabase = createServerComponentClient({ cookies })
  
  // First try to get existing entry
  const { data, error } = await supabase
    .from('daily_info')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  // If no entry exists, create one
  if (!data && (!error || error.code === 'PGRST116')) {
    const { data: newData, error: insertError } = await supabase
      .from('daily_info')
      .insert({
        user_id: userId,
        date: date,
        journal: '',
        llm_analysis: null,
        nutrition_info: null
      })
      .select()
      .single()

    if (insertError) throw insertError
    return newData
  }

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return data
}

export async function updateDailyInfo(userId: string, date: string, data: Partial<DailyInfo>) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase
    .from('daily_info')
    .update(data)
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw error
  
  // Return updated record
  const { data: updated, error: fetchError } = await supabase
    .from('daily_info')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  if (fetchError) throw fetchError
  return updated
}

export async function getDailyInfos(userId: string, limit = 7) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('daily_info')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
} 