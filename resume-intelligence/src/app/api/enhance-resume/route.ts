import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, matchResult } = await request.json();

    if (!resumeText || !jobDescription || !matchResult) {
      return NextResponse.json(
        { error: 'Resume text, job description, and match result are all required' },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const result = await aiService.enhanceResume(resumeText, jobDescription, matchResult);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Enhance resume error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance resume. Please try again.' },
      { status: 500 }
    );
  }
}
