'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore, Lang, QuizQuestion, QuizCategory } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  UserPlus,
  Shield,
  Plus,
  Trash2,
  LogOut,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Brain,
  BookOpen,
  Languages,
  Home,
  Star,
  Zap,
  Timer,
  PartyPopper,
  ThumbsUp,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

// ===================== TRANSLATIONS =====================
const translations = {
  badini: {
    appName: '7S SQUAD PSYAR',
    welcome: 'بەخێربێیت',
    enterName: 'ناڤێ خۆ بنڤیسە...',
    uploadAvatar: 'وێنە یان لۆگۆ باربکە',
    startQuiz: 'دەستپێبکە',
    selectCategory: 'جۆرێ پرسیارێ هەڵبژێرە',
    allCategories: 'تەڤایەتی',
    nextQuestion: 'پرسیارا دواوە',
    viewResults: 'ئەنجامەکان ببینە',
    correct: 'بەرسڤ دروسته!',
    wrong: 'ببوورە بەرسڤ خەلەتە',
    wrongCorrectIs: 'بەرسڤا درست ئەڤەیە',
    timeUp: 'دەم ب دوماهی هات!',
    timeUpCorrectIs: 'بەرسڤا درست ئەڤەیە',
    timeRemaining: 'دەمی ماوە',
    question: 'پرسیار',
    of: 'ژ',
    score: 'خاڵ',
    correctAnswers: 'بەرسڤێن دروست',
    wrongAnswers: 'بەرسڤێن خەلەت',
    unanswered: 'بەرسڤ نەدان',
    adminPanel: 'پەنەلا ئەدمین',
    adminPassword: 'پەیڤا نهێنی',
    login: 'چوونەژوورێ',
    addCategory: 'جۆرێ نوو زێدەبکە',
    categoryNameBadini: 'ناڤێ جۆرێ ب بادینی',
    categoryNameSorani: 'ناڤێ جۆرێ ب سورانی',
    addQuestion: 'پرسیارێ نوو زێدەبکە',
    questionTextBadini: 'دەقێ پرسیارێ ب بادینی',
    questionTextSorani: 'دەقێ پرسیارێ ب سورانی',
    option: 'هەڵبژارتن',
    correctOption: 'هەڵبژارتنا دروست',
    category: 'جۆر',
    delete: 'ژێببە',
    save: 'پاشەکەوتبکە',
    noQuestions: 'پرسیارێ نین',
    backToHome: 'گەڕانەوە دەستپێک',
    quizComplete: 'کویز تەواو بوو!',
    yourScore: 'خاڵێ تە',
    questions: 'پرسیار',
    manageCategories: 'بەڕێوەبردنا جۆران',
    manageQuestions: 'بەڕێوەبردنا پرسیاران',
    invalidPassword: 'پەیڤا نهێنی خەلەتە!',
    selectLanguage: 'زاراوێک هەڵبژێرە',
    badini: 'بادینی',
    sorani: 'سورانی',
    logout: 'دەرچوو',
    retryQuiz: 'دووبارە کویز',
    answered: 'بەرسڤ دراوە',
    notAnswered: 'بەرسڤ نەدراوە',
    excellent: 'ئەلەم! سەرکەوتن!',
    good: 'باشە! بەردەوامبە!',
    tryAgain: 'هەوڵبدەرەوە!',
    ready: 'ئامادەیت؟',
  },
  sorani: {
    appName: '7S SQUAD PSYAR',
    welcome: 'بەخێربێیت',
    enterName: 'ناوت بنووسە...',
    uploadAvatar: 'وێنە یان لۆگۆ باربکە',
    startQuiz: 'دەستپێبکە',
    selectCategory: 'جۆرى پرسیار هەڵبژێرە',
    allCategories: 'تەواوى',
    nextQuestion: 'پرسیارى دواتر',
    viewResults: 'ئەنجامەکان ببینە',
    correct: 'وەڵامى ڕاستە!',
    wrong: 'ببورە وەڵام هەڵەیە',
    wrongCorrectIs: 'وەڵامى ڕاست ئەمەیە',
    timeUp: 'کات تەواو بوو!',
    timeUpCorrectIs: 'وەڵامى ڕاست ئەمەیە',
    timeRemaining: 'کاتى ماوە',
    question: 'پرسیار',
    of: 'لە',
    score: 'خاڵ',
    correctAnswers: 'وەڵامى ڕاست',
    wrongAnswers: 'وەڵامى هەڵە',
    unanswered: 'وەڵام نەدراوە',
    adminPanel: 'پانێلى ئەدمین',
    adminPassword: 'وشەى نهێنى',
    login: 'چوونەژوورەوە',
    addCategory: 'جۆرى نوێ زیادبکە',
    categoryNameBadini: 'ناوێ جۆر ب بادینی',
    categoryNameSorani: 'ناوێ جۆر ب سورانی',
    addQuestion: 'پرسیارى نوێ زیادبکە',
    questionTextBadini: 'دەقى پرسیار ب بادینی',
    questionTextSorani: 'دەقى پرسیار ب سورانی',
    option: 'هەڵبژاردن',
    correctOption: 'هەڵبژاردنى ڕاست',
    category: 'جۆر',
    delete: 'سڕینەوە',
    save: 'پاشەکەوتکردن',
    noQuestions: 'پرسیارێک نییە',
    backToHome: 'گەڕانەوە سەرەتا',
    quizComplete: 'کویز تەواو بوو!',
    yourScore: 'خاڵى تۆ',
    questions: 'پرسیار',
    manageCategories: 'بەڕێوەبردنى جۆرەکان',
    manageQuestions: 'بەڕێوەبردنى پرسیارەکان',
    invalidPassword: 'وشەى نهێنى هەڵەیە!',
    selectLanguage: 'زارییەک هەڵبژێرە',
    badini: 'بادینی',
    sorani: 'سورانی',
    logout: 'دەرچوون',
    retryQuiz: 'دووبارە کویز',
    answered: 'وەڵام دراوە',
    notAnswered: 'وەڵام نەدراوە',
    excellent: 'ئەلەم! سەرکەوتن!',
    good: 'باشە! بەردەوامبە!',
    tryAgain: 'هەوڵبدەرەوە!',
    ready: 'ئامادەیت؟',
  },
}

function t(lang: Lang, key: keyof typeof translations.badini) {
  return translations[lang][key]
}

// ===================== ANIMATED BACKGROUND PARTICLES =====================
function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// ===================== CIRCULAR TIMER =====================
function CircularTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const percentage = (timeLeft / maxTime) * 100
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLow = timeLeft <= 30
  const isCritical = timeLeft <= 10

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
        {/* Progress circle */}
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#3b82f6'}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
          style={{ filter: isLow ? `drop-shadow(0 0 6px ${isCritical ? '#ef4444' : '#f59e0b'})` : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold font-mono ${isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-white/40 text-[10px]">
          <Clock className="w-3 h-3 inline mr-1" />
          {timeLeft > 0 ? '...' : ''}
        </span>
      </div>
    </div>
  )
}

// ===================== WELCOME PAGE =====================
function WelcomePage() {
  const { setView, setParticipant, lang, setLang, setSelectedCategoryId, resetQuiz } = useAppStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    // Seed on first load
    fetch('/api/seed', { method: 'POST' }).catch(() => {})
  }, [fetchCategories])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatar(result)
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleStart = async () => {
    if (!name.trim()) {
      toast({ title: t(lang, 'enterName'), variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar }),
      })
      const participant = await res.json()
      setParticipant(participant)
      setSelectedCategoryId(selectedCat === 'all' ? null : selectedCat)
      resetQuiz()
      setView('quiz')
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-blue-900 to-red-950 relative overflow-hidden">
      <FloatingParticles />

      {/* Language Toggle */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-4"
          onClick={() => setLang(lang === 'badini' ? 'sorani' : 'badini')}
        >
          <Languages className="w-4 h-4 mr-2" />
          {lang === 'badini' ? 'سورانی' : 'بادینی'}
        </Button>
      </div>

      {/* Admin Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-4"
          onClick={() => setView('admin')}
        >
          <Shield className="w-4 h-4 mr-2" />
          {t(lang, 'adminPanel')}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
          {/* Header Gradient Band */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

          <CardHeader className="text-center pb-2 pt-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mx-auto mb-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-black text-white tracking-wider">
              7S SQUAD
            </CardTitle>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              PSYAR
            </CardTitle>
            <p className="text-blue-200/80 mt-2 text-base">{t(lang, 'welcome')}</p>
          </CardHeader>

          <CardContent className="space-y-5 pb-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden group-hover:border-purple-400/60 transition-all duration-300">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-md">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <Label className="text-white/50 text-xs">{t(lang, 'uploadAvatar')}</Label>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">{t(lang, 'enterName')}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-purple-400/60 focus:ring-purple-400/20 rounded-xl h-12 text-base"
                placeholder={t(lang, 'enterName')}
                dir="rtl"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">{t(lang, 'selectCategory')}</Label>
              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger className="bg-white/5 border-white/15 text-white rounded-xl h-12" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t(lang, 'allCategories')}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {lang === 'badini' ? cat.nameBadini : cat.nameSorani}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold text-lg py-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {t(lang, 'startQuiz')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ===================== QUIZ PAGE =====================
function QuizPage() {
  const {
    lang, participant, selectedCategoryId, questions, setQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    addAnsweredQuestionId, correctCount, incrementCorrect,
    wrongCount, incrementWrong, setView, answeredQuestionIds,
  } = useAppStore()

  const [timeLeft, setTimeLeft] = useState(120)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [resultType, setResultType] = useState<'correct' | 'wrong' | 'timeout' | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const fetchQuestions = useCallback(async () => {
    try {
      const url = selectedCategoryId
        ? `/api/questions?categoryId=${selectedCategoryId}`
        : '/api/questions'
      const res = await fetch(url)
      const data = await res.json()
      const unanswered = data.filter(
        (q: QuizQuestion) => !answeredQuestionIds.includes(q.id)
      )
      setQuestions(unanswered)
    } catch {
      // ignore
    }
  }, [selectedCategoryId, answeredQuestionIds, setQuestions])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const currentQuestion = questions[currentQuestionIndex]

  // Timer
  useEffect(() => {
    if (!currentQuestion || isAnswered) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentQuestionIndex, currentQuestion?.id, isAnswered, currentQuestion])

  // Computed timeout
  const isTimedOut = timeLeft === 0 && !isAnswered && !!currentQuestion
  const effectiveResultType = isTimedOut ? 'timeout' : resultType
  const effectiveShowResult = showResult || isTimedOut
  const effectiveIsAnswered = isAnswered || isTimedOut

  const handleSubmitTimeout = useCallback(async () => {
    if (!participant || !currentQuestion) return
    setIsAnswered(true)
    setResultType('timeout')
    setShowResult(true)
    incrementWrong()
    try {
      await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participant.id,
          questionId: currentQuestion.id,
          selectedAnswer: null,
          correctAnswer: currentQuestion.correctAnswer,
        }),
      })
      addAnsweredQuestionId(currentQuestion.id)
    } catch {
      // ignore
    }
  }, [participant, currentQuestion, incrementWrong, addAnsweredQuestionId])

  const handleAnswer = async (answerIndex: number) => {
    if (isAnswered || isTimedOut || !currentQuestion) return
    if (timerRef.current) clearInterval(timerRef.current)

    setIsAnswered(true)
    setSelectedAnswer(answerIndex)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    if (isCorrect) {
      setResultType('correct')
      incrementCorrect()
    } else {
      setResultType('wrong')
      incrementWrong()
    }
    setShowResult(true)

    if (participant) {
      try {
        await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participantId: participant.id,
            questionId: currentQuestion.id,
            selectedAnswer: answerIndex,
            correctAnswer: currentQuestion.correctAnswer,
          }),
        })
        addAnsweredQuestionId(currentQuestion.id)
      } catch {
        // ignore
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setView('results')
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsAnswered(false)
      setResultType(null)
      setTimeLeft(120)
    }
  }

  const getOptionText = (q: QuizQuestion, index: number) => {
    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
    return q[key] as string
  }
  const getQuestionText = (q: QuizQuestion) => lang === 'badini' ? q.textBadini : q.textSorani
  const getCategoryName = (q: QuizQuestion) => lang === 'badini' ? q.category.nameBadini : q.category.nameSorani
  const getCorrectOptionText = (q: QuizQuestion) => getOptionText(q, q.correctAnswer)

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-red-950 relative overflow-hidden">
        <FloatingParticles />
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-center relative z-10">
          <CardContent className="space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-16 h-16 text-white/50 mx-auto" />
            </motion.div>
            <p className="text-white text-xl" dir="rtl">{t(lang, 'noQuestions')}</p>
            <Button
              onClick={() => setView('welcome')}
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              {t(lang, 'backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const questionProgress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-blue-900 to-red-950 relative overflow-hidden">
      <FloatingParticles />

      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/50 hover:text-white hover:bg-white/10 rounded-full"
          onClick={() => setView('welcome')}
        >
          <Home className="w-4 h-4" />
        </Button>

        <h1 className="text-lg font-bold text-white/80 tracking-wider">7S SQUAD PSYAR</h1>

        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-full px-3">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {correctCount}
          </Badge>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 rounded-full px-3">
            <XCircle className="w-3 h-3 mr-1" />
            {wrongCount}
          </Badge>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full max-w-2xl mb-3 relative z-10">
        <Progress value={questionProgress} className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
      </div>

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
          {/* Category Color Band */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

          <CardHeader className="pb-2 pt-4">
            {/* Category & Question Number */}
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 rounded-full px-3 text-xs">
                {getCategoryName(currentQuestion)}
              </Badge>
              <span className="text-white/50 text-sm font-mono" dir="rtl">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Circular Timer */}
            <CircularTimer timeLeft={timeLeft} maxTime={120} />
          </CardHeader>

          <CardContent className="space-y-4 pb-6">
            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10"
            >
              <p className="text-white text-lg leading-relaxed text-center font-medium" dir="rtl">
                {getQuestionText(currentQuestion)}
              </p>
            </motion.div>

            {/* Options */}
            <div className="space-y-2.5" dir="rtl">
              {[1, 2, 3, 4].map((index) => {
                const isSelected = selectedAnswer === index
                const isCorrectOption = currentQuestion.correctAnswer === index

                let optionClass = 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/25 text-white/90'

                if (effectiveShowResult) {
                  if (isCorrectOption) {
                    optionClass = 'bg-green-500/15 border-green-400/60 text-green-300 shadow-lg shadow-green-500/10'
                  } else if (isSelected && !isCorrectOption) {
                    optionClass = 'bg-red-500/15 border-red-400/60 text-red-300 shadow-lg shadow-red-500/10'
                  } else {
                    optionClass = 'bg-white/[0.02] border-white/5 text-white/30'
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={effectiveIsAnswered}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={!effectiveIsAnswered ? { scale: 1.01 } : undefined}
                    whileTap={!effectiveIsAnswered ? { scale: 0.99 } : undefined}
                    className={`w-full p-3.5 rounded-xl border-2 transition-all duration-300 text-right ${optionClass} ${effectiveIsAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                        effectiveShowResult && isCorrectOption ? 'bg-green-500/30 text-green-300' :
                        effectiveShowResult && isSelected && !isCorrectOption ? 'bg-red-500/30 text-red-300' :
                        'bg-white/10 text-white/70'
                      }`}>
                        {effectiveShowResult && isCorrectOption ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : effectiveShowResult && isSelected && !isCorrectOption ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          index
                        )}
                      </span>
                      <span className="text-base flex-1">{getOptionText(currentQuestion, index)}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {effectiveShowResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  dir="rtl"
                >
                  {effectiveResultType === 'correct' && (
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/30 rounded-2xl p-5 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                      >
                        <PartyPopper className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      </motion.div>
                      <p className="text-green-300 text-xl font-bold">{t(lang, 'correct')}</p>
                      <div className="flex justify-center gap-1 mt-2">
                        {[1,2,3].map((s) => (
                          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + s * 0.1 }}>
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {effectiveResultType === 'wrong' && (
                    <div className="bg-gradient-to-br from-red-500/15 to-rose-500/5 border border-red-400/25 rounded-2xl p-5 text-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                      </motion.div>
                      <p className="text-red-300 text-lg font-bold mb-2">{t(lang, 'wrong')}</p>
                      <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-3 inline-block">
                        <p className="text-green-300/80 text-xs mb-0.5">{t(lang, 'wrongCorrectIs')}:</p>
                        <p className="text-green-300 font-bold text-sm">{getCorrectOptionText(currentQuestion)}</p>
                      </div>
                    </div>
                  )}
                  {effectiveResultType === 'timeout' && (
                    <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/5 border border-amber-400/25 rounded-2xl p-5 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Timer className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                      </motion.div>
                      <p className="text-amber-300 text-lg font-bold mb-2">{t(lang, 'timeUp')}</p>
                      <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-3 inline-block">
                        <p className="text-green-300/80 text-xs mb-0.5">{t(lang, 'timeUpCorrectIs')}:</p>
                        <p className="text-green-300 font-bold text-sm">{getCorrectOptionText(currentQuestion)}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            <AnimatePresence>
              {effectiveShowResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={isTimedOut ? handleSubmitTimeout : handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold py-5 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl"
                  >
                    {currentQuestionIndex + 1 >= questions.length ? (
                      <><Trophy className="w-5 h-5 mr-2" />{t(lang, 'viewResults')}</>
                    ) : (
                      <><ArrowRight className="w-5 h-5 mr-2 rotate-180" />{t(lang, 'nextQuestion')}</>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ===================== RESULTS PAGE =====================
function ResultsPage() {
  const { lang, correctCount, wrongCount, questions, setView, resetQuiz } = useAppStore()
  const totalQuestions = questions.length
  const unanswered = totalQuestions - correctCount - wrongCount
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const getScoreGradient = () => {
    if (percentage >= 80) return 'from-green-400 via-emerald-500 to-teal-500'
    if (percentage >= 50) return 'from-amber-400 via-orange-500 to-rose-500'
    return 'from-red-400 via-rose-500 to-pink-500'
  }

  const getScoreIcon = () => {
    if (percentage >= 80) return <PartyPopper className="w-16 h-16 text-white" />
    if (percentage >= 50) return <ThumbsUp className="w-16 h-16 text-white" />
    return <Sparkles className="w-16 h-16 text-white" />
  }

  const getScoreMessage = () => {
    if (percentage >= 80) return t(lang, 'excellent')
    if (percentage >= 50) return t(lang, 'good')
    return t(lang, 'tryAgain')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-blue-900 to-red-950 relative overflow-hidden">
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

          <CardHeader className="text-center pb-2 pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className={`mx-auto mb-4 w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient()} flex items-center justify-center shadow-xl`}
            >
              {getScoreIcon()}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white" dir="rtl">
              {t(lang, 'quizComplete')}
            </CardTitle>
            <p className="text-white/60 text-lg mt-1" dir="rtl">{getScoreMessage()}</p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${getScoreGradient()} flex items-center justify-center shadow-lg`}
              >
                <div className="text-center">
                  <p className="text-4xl font-black text-white">{percentage}%</p>
                  <p className="text-white/80 text-xs">{t(lang, 'score')}</p>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20"
              >
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-300">{correctCount}</p>
                <p className="text-green-300/60 text-[10px]">{t(lang, 'correctAnswers')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20"
              >
                <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-300">{wrongCount}</p>
                <p className="text-red-300/60 text-[10px]">{t(lang, 'wrongAnswers')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 rounded-xl p-3 text-center border border-white/10"
              >
                <Clock className="w-6 h-6 text-white/30 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white/50">{unanswered}</p>
                <p className="text-white/30 text-[10px]">{t(lang, 'unanswered')}</p>
              </motion.div>
            </div>

            <Separator className="bg-white/10" />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => { resetQuiz(); setView('quiz') }}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold py-5 rounded-xl shadow-lg shadow-purple-500/20"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {t(lang, 'retryQuiz')}
              </Button>
              <Button
                onClick={() => { resetQuiz(); setView('welcome') }}
                variant="outline"
                className="w-full border-white/15 text-white/70 hover:bg-white/5 hover:text-white py-5 rounded-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                {t(lang, 'backToHome')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ===================== ADMIN PAGE =====================
function AdminPage() {
  const { lang, isAdminAuth, setIsAdminAuth, setView } = useAppStore()
  const [password, setPassword] = useState('')
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([])
  const [newCatBadini, setNewCatBadini] = useState('')
  const [newCatSorani, setNewCatSorani] = useState('')
  const [qTextBadini, setQTextBadini] = useState('')
  const [qTextSorani, setQTextSorani] = useState('')
  const [qOpt1Badini, setQOpt1Badini] = useState('')
  const [qOpt1Sorani, setQOpt1Sorani] = useState('')
  const [qOpt2Badini, setQOpt2Badini] = useState('')
  const [qOpt2Sorani, setQOpt2Sorani] = useState('')
  const [qOpt3Badini, setQOpt3Badini] = useState('')
  const [qOpt3Sorani, setQOpt3Sorani] = useState('')
  const [qOpt4Badini, setQOpt4Badini] = useState('')
  const [qOpt4Sorani, setQOpt4Sorani] = useState('')
  const [qCorrect, setQCorrect] = useState('1')
  const [qCategory, setQCategory] = useState('')
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      setCategories(await res.json())
    } catch { /* */ }
  }, [])

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch('/api/questions')
      setAllQuestions(await res.json())
    } catch { /* */ }
  }, [])

  const handleAdminLogin = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setIsAdminAuth(true)
        fetchCategories()
        fetchQuestions()
      } else {
        toast({ title: t(lang, 'invalidPassword'), variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleAddCategory = async () => {
    if (!newCatBadini || !newCatSorani) return
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameBadini: newCatBadini, nameSorani: newCatSorani }),
      })
      setNewCatBadini(''); setNewCatSorani('')
      fetchCategories()
      toast({ title: '✓' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      fetchCategories(); fetchQuestions()
      toast({ title: '✓' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const handleAddQuestion = async () => {
    if (!qTextBadini || !qTextSorani || !qCategory) return
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textBadini: qTextBadini, textSorani: qTextSorani,
          option1Badini: qOpt1Badini, option1Sorani: qOpt1Sorani,
          option2Badini: qOpt2Badini, option2Sorani: qOpt2Sorani,
          option3Badini: qOpt3Badini, option3Sorani: qOpt3Sorani,
          option4Badini: qOpt4Badini, option4Sorani: qOpt4Sorani,
          correctAnswer: Number(qCorrect), categoryId: qCategory,
        }),
      })
      setQTextBadini(''); setQTextSorani('')
      setQOpt1Badini(''); setQOpt1Sorani(''); setQOpt2Badini(''); setQOpt2Sorani('')
      setQOpt3Badini(''); setQOpt3Sorani(''); setQOpt4Badini(''); setQOpt4Sorani('')
      setQCorrect('1'); setQCategory('')
      fetchQuestions()
      toast({ title: '✓' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      await fetch(`/api/questions?id=${id}`, { method: 'DELETE' })
      fetchQuestions()
      toast({ title: '✓' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-blue-900 to-red-950 relative overflow-hidden">
        <FloatingParticles />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-500 to-amber-500" />
            <CardHeader className="text-center pt-6">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <CardTitle className="text-xl text-white" dir="rtl">{t(lang, 'adminPanel')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <div className="space-y-2">
                <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'adminPassword')}</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/15 text-white rounded-xl h-12"
                  dir="ltr"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdminLogin} className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl h-12">
                  {t(lang, 'login')}
                </Button>
                <Button onClick={() => setView('welcome')} variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-12">
                  <Home className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-950 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-400" />
          <h1 className="text-xl font-bold text-white" dir="rtl">{t(lang, 'adminPanel')}</h1>
        </div>
        <Button
          onClick={() => { setIsAdminAuth(false); setView('welcome') }}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10 rounded-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t(lang, 'logout')}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="categories" dir="rtl" className="w-full">
          <TabsList className="bg-white/10 border-white/20 w-full mb-4">
            <TabsTrigger value="categories" className="text-white data-[state=active]:bg-white/20 flex-1 rounded-lg">
              {t(lang, 'manageCategories')}
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-white data-[state=active]:bg-white/20 flex-1 rounded-lg">
              {t(lang, 'manageQuestions')}
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">{t(lang, 'addCategory')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'categoryNameBadini')}</Label>
                    <Input value={newCatBadini} onChange={(e) => setNewCatBadini(e.target.value)} className="bg-white/5 border-white/15 text-white rounded-xl" dir="rtl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'categoryNameSorani')}</Label>
                    <Input value={newCatSorani} onChange={(e) => setNewCatSorani(e.target.value)} className="bg-white/5 border-white/15 text-white rounded-xl" dir="rtl" />
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={!newCatBadini || !newCatSorani} className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  {t(lang, 'addCategory')}
                </Button>
                <Separator className="bg-white/10" />
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 text-xs">
                            {cat._count?.questions || 0} {t(lang, 'questions')}
                          </Badge>
                          <span className="text-white text-sm">{cat.nameBadini} / {cat.nameSorani}</span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white" dir="rtl">{t(lang, 'delete')}?</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/60" dir="rtl">
                                {lang === 'badini' ? 'ئەگەر ئەڤ جۆرەیە ژێببیت، تەڤایەتی پرسیارێن وی ژی دژێدبن' : 'ئەگەر ئەم جۆرە سڕدرێتەوە، هەموو پرسیارەکانىشی دەسڕدرێتەوە'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/20 text-white">لا</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)} className="bg-red-600 text-white">{t(lang, 'delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                    {categories.length === 0 && <p className="text-white/40 text-center py-4" dir="rtl">{t(lang, 'noQuestions')}</p>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="space-y-4">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white" dir="rtl">{t(lang, 'addQuestion')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'category')}</Label>
                    <Select value={qCategory} onValueChange={setQCategory}>
                      <SelectTrigger className="bg-white/5 border-white/15 text-white rounded-xl" dir="rtl">
                        <SelectValue placeholder={t(lang, 'selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.nameBadini} / {cat.nameSorani}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'questionTextBadini')}</Label>
                      <Input value={qTextBadini} onChange={(e) => setQTextBadini(e.target.value)} className="bg-white/5 border-white/15 text-white rounded-xl" dir="rtl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'questionTextSorani')}</Label>
                      <Input value={qTextSorani} onChange={(e) => setQTextSorani(e.target.value)} className="bg-white/5 border-white/15 text-white rounded-xl" dir="rtl" />
                    </div>
                  </div>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-white/[0.03] rounded-xl p-3 border border-white/10 space-y-2">
                      <Label className="text-white/60 text-xs" dir="rtl">{t(lang, 'option')} {num}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input placeholder="بادینی" value={num===1?qOpt1Badini:num===2?qOpt2Badini:num===3?qOpt3Badini:qOpt4Badini} onChange={(e)=>{if(num===1)setQOpt1Badini(e.target.value);else if(num===2)setQOpt2Badini(e.target.value);else if(num===3)setQOpt3Badini(e.target.value);else setQOpt4Badini(e.target.value)}} className="bg-white/5 border-white/10 text-white text-sm rounded-xl" dir="rtl" />
                        <Input placeholder="سورانی" value={num===1?qOpt1Sorani:num===2?qOpt2Sorani:num===3?qOpt3Sorani:qOpt4Sorani} onChange={(e)=>{if(num===1)setQOpt1Sorani(e.target.value);else if(num===2)setQOpt2Sorani(e.target.value);else if(num===3)setQOpt3Sorani(e.target.value);else setQOpt4Sorani(e.target.value)}} className="bg-white/5 border-white/10 text-white text-sm rounded-xl" dir="rtl" />
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-white/70 text-sm" dir="rtl">{t(lang, 'correctOption')}</Label>
                    <Select value={qCorrect} onValueChange={setQCorrect}>
                      <SelectTrigger className="bg-white/5 border-white/15 text-white rounded-xl" dir="rtl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddQuestion} disabled={!qTextBadini||!qTextSorani||!qCategory} className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />{t(lang, 'addQuestion')}
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2" dir="rtl">
                    <BookOpen className="w-5 h-5" />{t(lang, 'manageQuestions')} ({allQuestions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="space-y-2">
                      {allQuestions.map((q) => (
                        <div key={q.id} className="flex items-start justify-between bg-white/[0.03] rounded-xl p-3 border border-white/10 gap-2">
                          <div className="flex-1 min-w-0" dir="rtl">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 text-xs">{lang==='badini'?q.category.nameBadini:q.category.nameSorani}</Badge>
                              <Badge className="bg-green-500/15 text-green-300 border-green-500/30 text-xs">{t(lang,'correctOption')}: {q.correctAnswer}</Badge>
                            </div>
                            <p className="text-white text-sm truncate">{lang==='badini'?q.textBadini:q.textSorani}</p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 border-white/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white" dir="rtl">{t(lang,'delete')}?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/60" dir="rtl">{lang==='badini'?'ئەڤ پرسیارەیە ژێدبیت':'ئەم پرسیارە دەسڕدرێتەوە'}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/20 text-white">لا</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>handleDeleteQuestion(q.id)} className="bg-red-600 text-white">{t(lang,'delete')}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                      {allQuestions.length===0 && <p className="text-white/40 text-center py-4" dir="rtl">{t(lang,'noQuestions')}</p>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ===================== MAIN APP =====================
export default function QuizApp() {
  const { view } = useAppStore()

  return (
    <AnimatePresence mode="wait">
      {view === 'welcome' && <WelcomePage key="welcome" />}
      {view === 'quiz' && <QuizPage key="quiz" />}
      {view === 'admin' && <AdminPage key="admin" />}
      {view === 'results' && <ResultsPage key="results" />}
    </AnimatePresence>
  )
}
