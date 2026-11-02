import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, previousJDs } = await request.json();

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const aiService = getAIService();
    const result = await aiService.matchJob(resumeText, jobDescription, previousJDs);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Match job error:', error);
    return NextResponse.json(
      { error: 'Failed to match job. Please try again.' },
      { status: 500 }
    );
  }
}
