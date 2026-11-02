import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const result = await aiService.analyzeResume(resumeText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze resume error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}
