import { create } from 'zustand'

export type Lang = 'badini' | 'sorani'
export type TabView = 'home' | 'questions' | 'top' | 'quiz' | 'results' | 'admin'

export interface PlayerData {
  id: string
  name: string
  avatar: string | null
  score: number
  correctCount: number
  totalAnswered: number
}

export interface DBQuestion {
  id: string
  textBadini: string
  textSorani: string
  option1Badini: string
  option1Sorani: string
  option2Badini: string
  option2Sorani: string
  option3Badini: string
  option3Sorani: string
  option4Badini: string
  option4Sorani: string
  correctAnswer: number
  categoryId: string
  category: {
    id: string
    nameBadini: string
    nameSorani: string
  }
}

export interface DBCategory {
  id: string
  nameBadini: string
  nameSorani: string
  _count: {
    questions: number
  }
}

interface AppState {
  // Language
  lang: Lang
  setLang: (lang: Lang) => void

  // Current tab
  tab: TabView
  setTab: (t: TabView) => void

  // Player info
  playerName: string
  setPlayerName: (n: string) => void
  playerAvatar: string | null
  setPlayerAvatar: (a: string | null) => void
  participantId: string | null
  setParticipantId: (id: string | null) => void

  // Selected category for quiz
  selectedCategory: string
  setSelectedCategory: (c: string) => void

  // Categories from DB
  categories: DBCategory[]
  setCategories: (c: DBCategory[]) => void

  // Questions from DB
  dbQuestions: DBQuestion[]
  setDbQuestions: (q: DBQuestion[]) => void

  // Quiz state
  quizQuestions: DBQuestion[]
  setQuizQuestions: (q: DBQuestion[]) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (i: number) => void
  selectedAnswer: number | null
  setSelectedAnswer: (a: number | null) => void
  isAnswered: boolean
  setIsAnswered: (v: boolean) => void
  correctCount: number
  incrementCorrect: () => void
  wrongCount: number
  incrementWrong: () => void
  score: number
  addScore: (pts: number) => void
  timeLeft: number
  setTimeLeft: (t: number) => void

  // Admin
  isAdminAuth: boolean
  setIsAdminAuth: (v: boolean) => void

  // Leaderboard from DB
  leaderboard: PlayerData[]
  setLeaderboard: (entries: PlayerData[]) => void

  // Reset
  resetQuiz: () => void
}

export const useAppStore = create<AppState>((set) => ({
  lang: 'badini',
  setLang: (lang) => set({ lang }),

  tab: 'home',
  setTab: (tab) => set({ tab }),

  playerName: '',
  setPlayerName: (playerName) => set({ playerName }),
  playerAvatar: null,
  setPlayerAvatar: (playerAvatar) => set({ playerAvatar }),
  participantId: null,
  setParticipantId: (participantId) => set({ participantId }),

  selectedCategory: '',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  categories: [],
  setCategories: (categories) => set({ categories }),

  dbQuestions: [],
  setDbQuestions: (dbQuestions) => set({ dbQuestions }),

  quizQuestions: [],
  setQuizQuestions: (quizQuestions) => set({ quizQuestions }),
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  selectedAnswer: null,
  setSelectedAnswer: (selectedAnswer) => set({ selectedAnswer }),
  isAnswered: false,
  setIsAnswered: (isAnswered) => set({ isAnswered }),
  correctCount: 0,
  incrementCorrect: () => set((s) => ({ correctCount: s.correctCount + 1 })),
  wrongCount: 0,
  incrementWrong: () => set((s) => ({ wrongCount: s.wrongCount + 1 })),
  score: 0,
  addScore: (pts) => set((s) => ({ score: s.score + pts })),
  timeLeft: 120,
  setTimeLeft: (timeLeft) => set({ timeLeft }),

  isAdminAuth: false,
  setIsAdminAuth: (isAdminAuth) => set({ isAdminAuth }),

  leaderboard: [],
  setLeaderboard: (leaderboard) => set({ leaderboard }),

  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswered: false,
      correctCount: 0,
      wrongCount: 0,
      score: 0,
      timeLeft: 120,
      quizQuestions: [],
    }),
}))
