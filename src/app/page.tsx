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
  Eye,
  EyeOff,
  ListChecks,
  Hash,
  Gamepad2,
  Crown,
  Target,
  Flame,
  CircleDot,
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
    timeRemaining: 'چرکە',
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
    availableQuestions: 'پرسیارێن بەردەست',
    chooseAndStart: 'جۆرێ هەڵبژێرە و دەستپێبکە',
    seconds: 'چرکە',
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
    timeRemaining: 'چرکە',
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
    availableQuestions: 'پرسیارە بەردەستەکان',
    chooseAndStart: 'جۆرێک هەڵبژێرە و دەستپێبکە',
    seconds: 'چرکە',
  },
}

function t(lang: Lang, key: keyof typeof translations.badini) {
  return translations[lang][key]
}

// ===================== ANIMATED BACKGROUND =====================
function AnimatedBackground() {
  return (
    <>
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'rgba(59,130,246,0.3)' : i % 3 === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(168,85,247,0.3)',
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </>
  )
}

// ===================== CIRCULAR TIMER (SECONDS ONLY) =====================
function CircularTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const percentage = (timeLeft / maxTime) * 100
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const isLow = timeLeft <= 30
  const isCritical = timeLeft <= 10

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        {/* Track circle */}
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="none" />
        {/* Progress circle */}
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#3b82f6'}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
          filter={isLow ? 'url(#glow)' : undefined}
          style={{ filter: isLow ? `drop-shadow(0 0 8px ${isCritical ? '#ef4444' : '#f59e0b'})` : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className={`text-3xl font-black font-mono tracking-tight ${isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white'}`}
        >
          {timeLeft}
        </motion.span>
        <span className="text-white/30 text-[9px] font-medium mt-0.5">
          {t(useAppStore.getState().lang, 'seconds')}
        </span>
      </div>
    </div>
  )
}

// ===================== WELCOME PAGE (HOME) =====================
function WelcomePage() {
  const { setView, setParticipant, lang, setLang, setSelectedCategoryId, resetQuiz } = useAppStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>([])
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

  const fetchQuestions = useCallback(async () => {
    try {
      const url = selectedCat && selectedCat !== 'all' ? `/api/questions?categoryId=${selectedCat}` : '/api/questions'
      const res = await fetch(url)
      const data = await res.json()
      setQuestionsList(data)
    } catch {
      // ignore
    }
  }, [selectedCat])

  useEffect(() => {
    fetchCategories()
    fetchQuestions()
    // Seed on first load
    fetch('/api/seed', { method: 'POST' }).catch(() => {})
  }, [fetchCategories, fetchQuestions])

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

  const getOptionText = (q: QuizQuestion, index: number) => {
    const key = `option${index}${lang === 'badini' ? 'Badini' : 'Sorani'}` as keyof QuizQuestion
    return q[key] as string
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-orange-500',
      'from-green-500 to-emerald-500',
      'from-amber-500 to-yellow-500',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />

      {/* Top Navigation */}
      <div className="relative z-10 flex items-center justify-between p-4 max-w-5xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-5 h-9 text-sm font-medium"
          onClick={() => setLang(lang === 'badini' ? 'sorani' : 'badini')}
        >
          <Languages className="w-4 h-4 mr-2" />
          {lang === 'badini' ? 'سورانی' : 'بادینی'}
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-white/80 font-bold text-sm tracking-wider">7S SQUAD</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-5 h-9 text-sm font-medium"
          onClick={() => setView('admin')}
        >
          <Shield className="w-4 h-4 mr-2" />
          {t(lang, 'adminPanel')}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
          >
            <Gamepad2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider">
            7S SQUAD
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mt-1">
            PSYAR
          </h2>
          <p className="text-blue-200/60 mt-3 text-base" dir="rtl">{t(lang, 'chooseAndStart')}</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Profile & Start */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden h-full">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
              <CardHeader className="text-center pb-2 pt-5">
                <CardTitle className="text-lg font-bold text-white/90 flex items-center justify-center gap-2" dir="rtl">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  {t(lang, 'ready')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-purple-400/50 transition-all duration-300">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserPlus className="w-7 h-7 text-white/30 group-hover:text-white/50 transition-colors" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shadow-md">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <Label className="text-white/40 text-[10px]">{t(lang, 'uploadAvatar')}</Label>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs" dir="rtl">{t(lang, 'enterName')}</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-400/50 focus:ring-purple-400/10 rounded-xl h-11 text-sm"
                    placeholder={t(lang, 'enterName')}
                    dir="rtl"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs" dir="rtl">{t(lang, 'selectCategory')}</Label>
                  <Select value={selectedCat} onValueChange={setSelectedCat}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11 text-sm" dir="rtl">
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

                {/* Start */}
                <Button
                  onClick={handleStart}
                  disabled={isLoading || !name.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold text-base py-5 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
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

          {/* Right Column - Categories & Questions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Categories Grid */}
            <div>
              <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" dir="rtl">
                <Target className="w-3.5 h-3.5" />
                {t(lang, 'selectCategory')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCat('all')}
                  className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 text-center ${
                    selectedCat === 'all'
                      ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className={`mx-auto mb-2 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center`}>
                    <ListChecks className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white text-sm font-bold" dir="rtl">{t(lang, 'allCategories')}</p>
                  <p className="text-white/30 text-xs mt-0.5">{questionsList.length} {t(lang, 'questions')}</p>
                </motion.button>
                {categories.map((cat, i) => {
                  const catQCount = questionsList.filter(q => q.categoryId === cat.id).length
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCat(cat.id)}
                      className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 text-center ${
                        selectedCat === cat.id
                          ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className={`mx-auto mb-2 w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(i)} flex items-center justify-center`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white text-sm font-bold" dir="rtl">{lang === 'badini' ? cat.nameBadini : cat.nameSorani}</p>
                      <p className="text-white/30 text-xs mt-0.5">{catQCount} {t(lang, 'questions')}</p>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Questions Preview */}
            <div>
              <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" dir="rtl">
                <CircleDot className="w-3.5 h-3.5" />
                {t(lang, 'availableQuestions')} ({questionsList.length})
              </h3>
              <ScrollArea className="max-h-[420px]">
                <div className="space-y-2.5 pr-1">
                  {questionsList.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200"
                    >
                      <div className="flex items-start gap-3" dir="rtl">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge className="bg-blue-500/10 text-blue-300/70 border-blue-500/15 text-[9px] px-2 py-0">
                              {lang === 'badini' ? q.category.nameBadini : q.category.nameSorani}
                            </Badge>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                            {lang === 'badini' ? q.textBadini : q.textSorani}
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            {[1, 2, 3, 4].map((optIdx) => (
                              <div
                                key={optIdx}
                                className={`text-[11px] px-2 py-1 rounded-md truncate ${
                                  q.correctAnswer === optIdx
                                    ? 'bg-green-500/10 text-green-300/70 border border-green-500/15'
                                    : 'bg-white/[0.03] text-white/30 border border-white/5'
                                }`}
                              >
                                <span className="font-bold ml-1">{optIdx}.</span>
                                {getOptionText(q, optIdx)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {questionsList.length === 0 && (
                    <div className="text-center py-10">
                      <BookOpen className="w-12 h-12 text-white/15 mx-auto mb-3" />
                      <p className="text-white/30 text-sm" dir="rtl">{t(lang, 'noQuestions')}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
        <AnimatedBackground />
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 p-8 text-center relative z-10">
          <CardContent className="space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-16 h-16 text-white/30 mx-auto" />
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

  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />

      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-white/40 hover:text-white hover:bg-white/5 rounded-full"
          onClick={() => setView('welcome')}
        >
          <Home className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-bold text-white/60 tracking-wider">7S SQUAD PSYAR</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            <span className="text-green-300 text-xs font-bold">{correctCount}</span>
          </div>
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span className="text-red-300 text-xs font-bold">{wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-4 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <Badge className="bg-blue-500/10 text-blue-300/70 border-blue-500/15 rounded-full px-2.5 text-[10px]">
            {getCategoryName(currentQuestion)}
          </Badge>
          <span className="text-white/30 text-xs font-mono" dir="rtl">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <Progress value={questionProgress} className="h-1 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:via-purple-500 [&>div]:to-red-500" />
      </div>

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

          <CardHeader className="pb-2 pt-5">
            {/* Timer */}
            <CircularTimer timeLeft={timeLeft} maxTime={120} />
          </CardHeader>

          <CardContent className="space-y-5 pb-6">
            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-5 border border-white/[0.08]"
            >
              <p className="text-white text-lg leading-relaxed text-center font-medium" dir="rtl">
                {getQuestionText(currentQuestion)}
              </p>
            </motion.div>

            {/* Options */}
            <div className="space-y-3" dir="rtl">
              {[1, 2, 3, 4].map((index) => {
                const isSelected = selectedAnswer === index
                const isCorrectOption = currentQuestion.correctAnswer === index

                let optionClass = 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 text-white/90'
                let labelClass = 'bg-white/10 text-white/60'

                if (effectiveShowResult) {
                  if (isCorrectOption) {
                    optionClass = 'bg-green-500/10 border-green-400/50 text-green-200 shadow-lg shadow-green-500/5'
                    labelClass = 'bg-green-500/30 text-green-300'
                  } else if (isSelected && !isCorrectOption) {
                    optionClass = 'bg-red-500/10 border-red-400/50 text-red-200 shadow-lg shadow-red-500/5'
                    labelClass = 'bg-red-500/30 text-red-300'
                  } else {
                    optionClass = 'bg-white/[0.01] border-white/[0.04] text-white/20'
                    labelClass = 'bg-white/5 text-white/20'
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={effectiveIsAnswered}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index }}
                    whileHover={!effectiveIsAnswered ? { scale: 1.01, y: -1 } : undefined}
                    whileTap={!effectiveIsAnswered ? { scale: 0.99 } : undefined}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-right ${optionClass} ${effectiveIsAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${labelClass}`}>
                        {effectiveShowResult && isCorrectOption ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : effectiveShowResult && isSelected && !isCorrectOption ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          optionLabels[index - 1]
                        )}
                      </span>
                      <span className="text-base flex-1 leading-relaxed">{getOptionText(currentQuestion, index)}</span>
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
                    <div className="bg-gradient-to-br from-green-500/15 to-emerald-500/5 border border-green-400/30 rounded-2xl p-5 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                        className="flex justify-center gap-2"
                      >
                        <PartyPopper className="w-10 h-10 text-green-400" />
                      </motion.div>
                      <p className="text-green-300 text-xl font-bold mt-2">{t(lang, 'correct')}</p>
                      <div className="flex justify-center gap-1 mt-2">
                        {[1,2,3].map((s) => (
                          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + s * 0.1 }}>
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {effectiveResultType === 'wrong' && (
                    <div className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-400/25 rounded-2xl p-5 text-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <XCircle className="w-10 h-10 text-red-400 mx-auto" />
                      </motion.div>
                      <p className="text-red-300 text-lg font-bold mt-2 mb-3">{t(lang, 'wrong')}</p>
                      <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-3 mx-auto max-w-xs">
                        <p className="text-green-300/60 text-xs mb-1">{t(lang, 'wrongCorrectIs')}:</p>
                        <p className="text-green-300 font-bold text-sm">{getCorrectOptionText(currentQuestion)}</p>
                      </div>
                    </div>
                  )}
                  {effectiveResultType === 'timeout' && (
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-400/25 rounded-2xl p-5 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Timer className="w-10 h-10 text-amber-400 mx-auto" />
                      </motion.div>
                      <p className="text-amber-300 text-lg font-bold mt-2 mb-3">{t(lang, 'timeUp')}</p>
                      <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-3 mx-auto max-w-xs">
                        <p className="text-green-300/60 text-xs mb-1">{t(lang, 'timeUpCorrectIs')}:</p>
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
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={isTimedOut ? handleSubmitTimeout : handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 hover:from-blue-700 hover:via-purple-700 hover:to-red-700 text-white font-bold py-5 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35"
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
    if (percentage >= 80) return <Crown className="w-14 h-14 text-white" />
    if (percentage >= 50) return <ThumbsUp className="w-14 h-14 text-white" />
    return <Flame className="w-14 h-14 text-white" />
  }

  const getScoreMessage = () => {
    if (percentage >= 80) return t(lang, 'excellent')
    if (percentage >= 50) return t(lang, 'good')
    return t(lang, 'tryAgain')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

          <CardHeader className="text-center pb-2 pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className={`mx-auto mb-4 w-28 h-28 rounded-full bg-gradient-to-br ${getScoreGradient()} flex items-center justify-center shadow-xl`}
            >
              {getScoreIcon()}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white" dir="rtl">
              {t(lang, 'quizComplete')}
            </CardTitle>
            <p className="text-white/40 text-base mt-1" dir="rtl">{getScoreMessage()}</p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${getScoreGradient()} flex items-center justify-center shadow-lg`}
              >
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{percentage}%</p>
                  <p className="text-white/70 text-[10px]">{t(lang, 'score')}</p>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5" dir="rtl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-green-500/[0.08] rounded-xl p-3 text-center border border-green-500/15"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-green-300">{correctCount}</p>
                <p className="text-green-300/40 text-[9px]">{t(lang, 'correctAnswers')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-red-500/[0.08] rounded-xl p-3 text-center border border-red-500/15"
              >
                <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-300">{wrongCount}</p>
                <p className="text-red-300/40 text-[9px]">{t(lang, 'wrongAnswers')}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.08]"
              >
                <Clock className="w-5 h-5 text-white/20 mx-auto mb-1" />
                <p className="text-xl font-bold text-white/40">{unanswered}</p>
                <p className="text-white/20 text-[9px]">{t(lang, 'unanswered')}</p>
              </motion.div>
            </div>

            <Separator className="bg-white/8" />

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
                className="w-full border-white/10 text-white/50 hover:bg-white/5 hover:text-white py-5 rounded-xl"
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
  const [showPassword, setShowPassword] = useState(false)
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
      toast({ title: 'OK' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      fetchCategories(); fetchQuestions()
      toast({ title: 'OK' })
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
      toast({ title: 'OK' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      await fetch(`/api/questions?id=${id}`, { method: 'DELETE' })
      fetchQuestions()
      toast({ title: 'OK' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }

  // Admin Login Screen
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] relative overflow-hidden">
        <AnimatedBackground />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
            <CardHeader className="text-center pt-6 pb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-xl text-white" dir="rtl">{t(lang, 'adminPanel')}</CardTitle>
              <p className="text-white/30 text-xs mt-1" dir="rtl">
                {lang === 'badini' ? 'پەیڤا نهێنی بنڤیسە بۆ چوونەژوورێ' : 'وشەى نهێنى بنووسە بۆ چوونەژوورەوە'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <div className="space-y-2">
                <Label className="text-white/60 text-xs font-medium" dir="rtl">{t(lang, 'adminPassword')}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl h-12 pr-12 text-base tracking-wider"
                    dir="ltr"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdminLogin} className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-500/20">
                  <Shield className="w-4 h-4 mr-2" />
                  {t(lang, 'login')}
                </Button>
                <Button onClick={() => setView('welcome')} variant="outline" className="border-white/10 text-white/50 hover:bg-white/5 hover:text-white rounded-xl h-12 px-4">
                  <Home className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1442] to-[#1a0a2e] p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white" dir="rtl">{t(lang, 'adminPanel')}</h1>
        </div>
        <Button
          onClick={() => { setIsAdminAuth(false); setView('welcome') }}
          variant="outline"
          size="sm"
          className="border-white/10 text-white/50 hover:bg-white/5 hover:text-white rounded-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t(lang, 'logout')}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="categories" dir="rtl" className="w-full">
          <TabsList className="bg-white/[0.04] border-white/10 w-full mb-4">
            <TabsTrigger value="categories" className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white flex-1 rounded-lg">
              {t(lang, 'manageCategories')}
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white flex-1 rounded-lg">
              {t(lang, 'manageQuestions')}
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base" dir="rtl">{t(lang, 'addCategory')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'categoryNameBadini')}</Label>
                    <Input value={newCatBadini} onChange={(e) => setNewCatBadini(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl" dir="rtl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'categoryNameSorani')}</Label>
                    <Input value={newCatSorani} onChange={(e) => setNewCatSorani(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl" dir="rtl" />
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={!newCatBadini || !newCatSorani} className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  {t(lang, 'addCategory')}
                </Button>
                <Separator className="bg-white/8" />
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3 border border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-500/10 text-blue-300/60 border-blue-500/15 text-xs">
                            {cat._count?.questions || 0} {t(lang, 'questions')}
                          </Badge>
                          <span className="text-white/70 text-sm">{cat.nameBadini} / {cat.nameSorani}</span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-400/60 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white" dir="rtl">{t(lang, 'delete')}?</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/50" dir="rtl">
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
                    {categories.length === 0 && <p className="text-white/30 text-center py-4 text-sm" dir="rtl">{t(lang, 'noQuestions')}</p>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="space-y-4">
              <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base" dir="rtl">{t(lang, 'addQuestion')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'category')}</Label>
                    <Select value={qCategory} onValueChange={setQCategory}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl" dir="rtl">
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
                      <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'questionTextBadini')}</Label>
                      <Input value={qTextBadini} onChange={(e) => setQTextBadini(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl" dir="rtl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'questionTextSorani')}</Label>
                      <Input value={qTextSorani} onChange={(e) => setQTextSorani(e.target.value)} className="bg-white/5 border-white/10 text-white rounded-xl" dir="rtl" />
                    </div>
                  </div>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.08] space-y-2">
                      <Label className="text-white/40 text-[10px] uppercase tracking-wider" dir="rtl">{t(lang, 'option')} {num}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input placeholder="بادینی" value={num===1?qOpt1Badini:num===2?qOpt2Badini:num===3?qOpt3Badini:qOpt4Badini} onChange={(e)=>{if(num===1)setQOpt1Badini(e.target.value);else if(num===2)setQOpt2Badini(e.target.value);else if(num===3)setQOpt3Badini(e.target.value);else setQOpt4Badini(e.target.value)}} className="bg-white/5 border-white/[0.08] text-white text-sm rounded-xl" dir="rtl" />
                        <Input placeholder="سورانی" value={num===1?qOpt1Sorani:num===2?qOpt2Sorani:num===3?qOpt3Sorani:qOpt4Sorani} onChange={(e)=>{if(num===1)setQOpt1Sorani(e.target.value);else if(num===2)setQOpt2Sorani(e.target.value);else if(num===3)setQOpt3Sorani(e.target.value);else setQOpt4Sorani(e.target.value)}} className="bg-white/5 border-white/[0.08] text-white text-sm rounded-xl" dir="rtl" />
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-white/50 text-xs" dir="rtl">{t(lang, 'correctOption')}</Label>
                    <Select value={qCorrect} onValueChange={setQCorrect}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl" dir="rtl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddQuestion} disabled={!qTextBadini||!qTextSorani||!qCategory} className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" />{t(lang, 'addQuestion')}
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2" dir="rtl">
                    <BookOpen className="w-4 h-4" />{t(lang, 'manageQuestions')} ({allQuestions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="space-y-2">
                      {allQuestions.map((q) => (
                        <div key={q.id} className="flex items-start justify-between bg-white/[0.02] rounded-xl p-3 border border-white/[0.08] gap-2">
                          <div className="flex-1 min-w-0" dir="rtl">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-blue-500/10 text-blue-300/60 border-blue-500/15 text-[9px]">{lang==='badini'?q.category.nameBadini:q.category.nameSorani}</Badge>
                              <Badge className="bg-green-500/10 text-green-300/60 border-green-500/15 text-[9px]">{t(lang,'correctOption')}: {q.correctAnswer}</Badge>
                            </div>
                            <p className="text-white/60 text-sm truncate">{lang==='badini'?q.textBadini:q.textSorani}</p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-400/50 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 border-white/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white" dir="rtl">{t(lang,'delete')}?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/50" dir="rtl">{lang==='badini'?'ئەڤ پرسیارەیە ژێدبیت':'ئەم پرسیارە دەسڕدرێتەوە'}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/20 text-white">لا</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>handleDeleteQuestion(q.id)} className="bg-red-600 text-white">{t(lang,'delete')}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                      {allQuestions.length===0 && <p className="text-white/30 text-center py-4 text-sm" dir="rtl">{t(lang,'noQuestions')}</p>}
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
