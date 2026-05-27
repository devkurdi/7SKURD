import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantId, points, correctCount, totalAnswered, categoryId } = body

    if (!participantId || points === undefined || correctCount === undefined || totalAnswered === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const score = await db.score.create({
      data: {
        participantId,
        points: Number(points),
        correctCount: Number(correctCount),
        totalAnswered: Number(totalAnswered),
        categoryId: categoryId || null,
      },
    })

    return NextResponse.json(score, { status: 201 })
  } catch (error) {
    console.error('Create score error:', error)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}
