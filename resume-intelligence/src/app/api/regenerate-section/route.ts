import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { sectionId, originalContent, jobDescription, context } = await request.json();

    if (!sectionId || !originalContent || !jobDescription) {
      return NextResponse.json(
        { error: 'Section ID, original content, and job description are required' },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const result = await aiService.regenerateSection(
      sectionId,
      originalContent,
      jobDescription,
      context || ''
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Regenerate section error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate section. Please try again.' },
      { status: 500 }
    );
  }
}
