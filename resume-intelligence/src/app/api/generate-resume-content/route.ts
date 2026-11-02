import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, role, currentContent, skills, level } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Small delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    if (action === 'summary') {
      const targetRole = role || 'Software Professional';
      const expLevel = level || 'Experienced';
      const skillText = Array.isArray(skills) && skills.length > 0 ? skills.slice(0, 5).join(', ') : 'modern tech stacks and cross-functional leadership';

      const summaries: Record<string, string[]> = {
        default: [
          `Results-driven and innovative ${targetRole} with extensive expertise in ${skillText}. Proven history of delivering high-impact solutions, optimizing architectural workflows, and elevating team velocity in fast-paced production environments.`,
          `Detail-oriented ${targetRole} committed to building resilient, scalable systems with expertise in ${skillText}. Adept at bridging technical specifications with strategic business objectives to deliver exceptional user value.`,
          `Dynamic ${targetRole} offering a strong background in ${skillText}. Recognized for rigorous problem-solving, rapid prototyping, and collaborating across cross-functional teams to exceed benchmark performance goals.`,
        ],
      };

      const options = summaries.default;
      const generatedSummary = options[Math.floor(Math.random() * options.length)];

      return NextResponse.json({
        summary: generatedSummary,
        alternatives: options,
      });
    }

    if (action === 'bullet') {
      const original = (currentContent || '').trim();
      let enhanced = '';

      if (!original) {
        enhanced = `Spearheaded end-to-end development of key features, improving overall system performance by 25% and reducing customer-reported bugs by 30%.`;
      } else if (/worked on|helped with|responsible for|handled|did/i.test(original)) {
        enhanced = original
          .replace(/worked on/gi, 'Architected and deployed')
          .replace(/helped with/gi, 'Spearheaded initiatives for')
          .replace(/responsible for/gi, 'Orchestrated and scaled')
          .replace(/handled/gi, 'Streamlined and resolved')
          .replace(/did/gi, 'Executed comprehensive development of');
        enhanced += `, resulting in a 25% improvement in operational efficiency and zero critical regressions.`;
      } else {
        enhanced = `Accelerated performance by 30% through: ${original}, driving measurable adoption across cross-functional stakeholders.`;
      }

      return NextResponse.json({
        original,
        enhanced,
      });
    }

    if (action === 'skills') {
      const targetRole = (role || '').toLowerCase();
      let suggested: { technical: string[]; soft: string[]; tools: string[] };

      if (targetRole.includes('product') || targetRole.includes('manager')) {
        suggested = {
          technical: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Data Analytics', 'Market Analysis'],
          soft: ['Cross-Functional Leadership', 'Stakeholder Management', 'Strategic Communication', 'Negotiation'],
          tools: ['Jira', 'Figma', 'Amplitude', 'Mixpanel', 'Notion', 'Tableau'],
        };
      } else if (targetRole.includes('data') || targetRole.includes('ai') || targetRole.includes('machine')) {
        suggested = {
          technical: ['Python', 'SQL', 'Machine Learning', 'Data Modeling', 'Deep Learning', 'PyTorch', 'Statistical Analysis'],
          soft: ['Analytical Thinking', 'Data Storytelling', 'Collaborative Problem Solving'],
          tools: ['Jupyter', 'Pandas', 'PostgreSQL', 'Docker', 'Snowflake', 'dbt', 'AWS SageMaker'],
        };
      } else if (targetRole.includes('design') || targetRole.includes('ux') || targetRole.includes('ui')) {
        suggested = {
          technical: ['UI/UX Design', 'Design Systems', 'Wireframing', 'Interactive Prototyping', 'User Testing', 'Information Architecture'],
          soft: ['Empathy', 'Visual Communication', 'Creative Problem Solving', 'Critique Facilitation'],
          tools: ['Figma', 'Adobe Creative Suite', 'Framer', 'Sketch', 'Miro'],
        };
      } else {
        // Engineering / Tech default
        suggested = {
          technical: ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Microservices'],
          soft: ['Code Review & Mentorship', 'Agile/Scrum', 'Critical Thinking', 'Clear Documentation'],
          tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'VS Code', 'Redis'],
        };
      }

      return NextResponse.json({ suggested });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Generate resume content error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
