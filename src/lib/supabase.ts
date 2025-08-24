import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://btyyeibhufhducfcorgb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0eXllaWJodWZoZHVjZmNvcmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMTY1ODEsImV4cCI6MjA3MTU5MjU4MX0.yP5Va2E7xzVlXl13HGCHlEdqL8dffkNjzXaNHl1wZxA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for game scores
export interface GameScore {
  id: string
  player_name: string
  game_type: 'tetris' | 'snake' | 'pong' | '2048' | 'memory'
  score: number
  level_or_lines: number
  duration: number
  extra_data?: Record<string, any>
  created_at: string
}

// Game scores service
export class GameScoresService {
  static async getScores(gameType?: string, limit = 50) {
    let query = supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)

    if (gameType) {
      query = query.eq('game_type', gameType)
    }

    const { data, error } = await query
    if (error) throw error
    return data as GameScore[]
  }

  static async getTopScores(gameType: string, limit = 10) {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('game_type', gameType)
      .order('score', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as GameScore[]
  }

  static async saveScore(scoreData: Omit<GameScore, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('game_scores')
      .insert([scoreData])
      .select()
      .single()

    if (error) throw error
    return data as GameScore
  }

  static async getPlayerStats(playerName: string) {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('player_name', playerName)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as GameScore[]
  }

  static async getGameStats(gameType: string) {
    const { data, error } = await supabase
      .from('game_scores')
      .select('score, level_or_lines, duration')
      .eq('game_type', gameType)

    if (error) throw error
    
    if (!data || data.length === 0) {
      return {
        totalPlayers: 0,
        averageScore: 0,
        highestScore: 0,
        totalGames: 0
      }
    }

    return {
      totalPlayers: new Set(data.map((_, i) => i)).size,
      averageScore: Math.round(data.reduce((sum, score) => sum + score.score, 0) / data.length),
      highestScore: Math.max(...data.map(score => score.score)),
      totalGames: data.length
    }
  }
}