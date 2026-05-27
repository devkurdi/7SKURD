import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const participants = await db.participant.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        scores: {
          select: {
            points: true,
            correctCount: true,
            totalAnswered: true,
          },
        },
      },
    })

    const leaderboard = participants
      .map((p) => {
        const totalPoints = p.scores.reduce((sum, s) => sum + s.points, 0)
        const totalCorrect = p.scores.reduce((sum, s) => sum + s.correctCount, 0)
        const totalAnswered = p.scores.reduce((sum, s) => sum + s.totalAnswered, 0)
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          score: totalPoints,
          correctCount: totalCorrect,
          totalAnswered: totalAnswered,
        }
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score || b.correctCount - a.correctCount)
      .slice(0, 100)

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json([])
  }
}
