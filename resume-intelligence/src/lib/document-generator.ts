// ============================================================
// Document Generator — creates PDF/DOCX from resume content
// ============================================================

import { EnhancedSection } from '@/types/resume';

export function generateResumeText(sections: EnhancedSection[]): string {
  return sections
    .map(section => {
      const content = section.accepted ? section.enhancedContent : section.originalContent;
      return `=== ${section.name.toUpperCase()} ===\n\n${content}`;
    })
    .join('\n\n');
}

export async function generatePDFBlob(sections: EnhancedSection[], fileName: string): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 25;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text(fileName.replace(/\.[^.]+$/, ''), pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  // Separator line
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  for (const section of sections) {
    const content = section.accepted ? section.enhancedContent : section.originalContent;
    if (!content || content === '(No professional summary present in original resume)') {
      if (!section.accepted) continue;
    }

    // Check page break
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    // Section header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.text(section.name.toUpperCase(), margin, yPos);
    yPos += 2;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, margin + 40, yPos);
    yPos += 6;

    // Section content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const displayContent = section.accepted ? section.enhancedContent : section.originalContent;
    const lines = doc.splitTextToSize(displayContent, contentWidth);

    for (const line of lines) {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    }

    yPos += 8;
  }

  return doc.output('blob');
}

export async function generateDOCXBlob(sections: EnhancedSection[]): Promise<Blob> {
  const { Document, Paragraph, TextRun, Packer, BorderStyle } = await import('docx');

  const children: InstanceType<typeof Paragraph>[] = [];

  for (const section of sections) {
    const content = section.accepted ? section.enhancedContent : section.originalContent;

    // Section header
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.name.toUpperCase(),
            bold: true,
            size: 26,
            color: '6366f1',
            font: 'Calibri',
          }),
        ],
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '6366f1' },
        },
      })
    );

    // Section content — split by newlines
    const contentLines = content.split('\n');
    for (const line of contentLines) {
      if (line.trim() === '') continue;

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = line.replace(/^[•\-]\s*/, '').trim();

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cleanLine,
              size: 22,
              font: 'Calibri',
            }),
          ],
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 60 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}

// ============================================================
// Builder Export Helpers
// ============================================================
import { ResumeBuilderData } from '@/types/builder';

const themeHexColors: Record<string, { primary: string; rgb: [number, number, number] }> = {
  indigo: { primary: '6366f1', rgb: [99, 102, 241] },
  purple: { primary: 'a855f7', rgb: [168, 85, 247] },
  emerald: { primary: '10b981', rgb: [16, 185, 129] },
  rose: { primary: 'f43f5e', rgb: [244, 63, 94] },
  slate: { primary: '334155', rgb: [51, 65, 85] },
};

export function formatBuilderResumeToText(data: ResumeBuilderData): string {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;
  const sections: string[] = [];

  // Header
  sections.push(`${personalInfo.fullName || 'Candidate'}\n${personalInfo.jobTitle || ''}\n${[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' | ')}`);

  // Summary
  if (summary.trim()) {
    sections.push(`=== PROFESSIONAL SUMMARY ===\n${summary.trim()}`);
  }

  // Experience
  if (experience.length > 0) {
    const expText = experience
      .filter(exp => exp.title || exp.company)
      .map(exp => {
        const dates = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
        const header = `${exp.title} | ${exp.company} ${exp.location ? `(${exp.location})` : ''} | ${dates}`;
        const bullets = exp.description.filter(b => b.trim()).map(b => `• ${b}`).join('\n');
        return `${header}\n${bullets}`;
      })
      .join('\n\n');
    if (expText.trim()) sections.push(`=== WORK EXPERIENCE ===\n${expText}`);
  }

  // Skills
  const allSkills = [
    skills.technical?.length ? `Technical Skills: ${skills.technical.join(', ')}` : '',
    skills.tools?.length ? `Tools & Technologies: ${skills.tools.join(', ')}` : '',
    skills.soft?.length ? `Soft Skills: ${skills.soft.join(', ')}` : '',
  ].filter(Boolean).join('\n');
  if (allSkills) sections.push(`=== SKILLS ===\n${allSkills}`);

  // Education
  if (education.length > 0) {
    const eduText = education
      .filter(edu => edu.degree || edu.institution)
      .map(edu => `${edu.degree} ${edu.field ? `in ${edu.field}` : ''}\n${edu.institution} | ${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`)
      .join('\n\n');
    if (eduText.trim()) sections.push(`=== EDUCATION ===\n${eduText}`);
  }

  // Projects
  if (projects?.length > 0) {
    const projText = projects
      .filter(p => p.name)
      .map(p => `${p.name} ${p.technologies?.length ? `[${p.technologies.join(', ')}]` : ''}\n${p.description}${p.link ? `\nLink: ${p.link}` : ''}`)
      .join('\n\n');
    if (projText.trim()) sections.push(`=== PROJECTS ===\n${projText}`);
  }

  // Certifications
  if (certifications?.length > 0) {
    const certText = certifications
      .filter(c => c.name)
      .map(c => `${c.name} — ${c.issuer} ${c.year ? `(${c.year})` : ''}`)
      .join('\n');
    if (certText.trim()) sections.push(`=== CERTIFICATIONS ===\n${certText}`);
  }

  return sections.join('\n\n');
}

export async function generateBuilderPDF(data: ResumeBuilderData): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const theme = themeHexColors[data.themeColor] || themeHexColors.indigo;
  const [tr, tg, tb] = theme.rgb;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Header: Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text(data.personalInfo.fullName || 'Your Name', margin, yPos);
  yPos += 7;

  // Job Title
  if (data.personalInfo.jobTitle) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(tr, tg, tb);
    doc.text(data.personalInfo.jobTitle, margin, yPos);
    yPos += 6;
  }

  // Contact Info row
  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ].filter(Boolean);

  if (contacts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const contactLine = contacts.join('  •  ');
    const contactLines = doc.splitTextToSize(contactLine, contentWidth);
    for (const cl of contactLines) {
      doc.text(cl, margin, yPos);
      yPos += 4;
    }
  }

  // Accent horizontal divider
  yPos += 2;
  doc.setDrawColor(tr, tg, tb);
  doc.setLineWidth(0.6);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  const checkPageBreak = (neededSpace: number = 15) => {
    if (yPos + neededSpace > 275) {
      doc.addPage();
      yPos = 20;
    }
  };

  const drawSectionHeading = (title: string) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(tr, tg, tb);
    doc.text(title.toUpperCase(), margin, yPos);
    yPos += 2;
    doc.setDrawColor(tr, tg, tb);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, margin + 28, yPos);
    yPos += 5;
  };

  // Summary
  if (data.summary?.trim()) {
    drawSectionHeading('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);
    const summaryLines = doc.splitTextToSize(data.summary.trim(), contentWidth);
    for (const line of summaryLines) {
      checkPageBreak(5);
      doc.text(line, margin, yPos);
      yPos += 4.5;
    }
    yPos += 4;
  }

  // Experience
  const validExp = data.experience.filter(e => e.title || e.company);
  if (validExp.length > 0) {
    drawSectionHeading('Work Experience');
    for (const exp of validExp) {
      checkPageBreak(15);
      // Title & Company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(exp.title || 'Role', margin, yPos);

      const dateStr = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text(dateStr, pageWidth - margin, yPos, { align: 'right' });
      yPos += 4.5;

      // Company & Location
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(`${exp.company || ''}${exp.location ? ` | ${exp.location}` : ''}`, margin, yPos);
      yPos += 4.5;

      // Bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      for (const bullet of exp.description.filter(b => b.trim())) {
        checkPageBreak(8);
        const bulletLines = doc.splitTextToSize(`•  ${bullet.trim()}`, contentWidth - 4);
        for (const bl of bulletLines) {
          doc.text(bl, margin + 2, yPos);
          yPos += 4.2;
        }
      }
      yPos += 3;
    }
    yPos += 2;
  }

  // Skills
  const hasSkills = data.skills.technical?.length || data.skills.tools?.length || data.skills.soft?.length;
  if (hasSkills) {
    drawSectionHeading('Skills');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);

    if (data.skills.technical?.length) {
      checkPageBreak(6);
      doc.setFont('helvetica', 'bold');
      doc.text('Technical:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(data.skills.technical.join(', '), contentWidth - 22);
      doc.text(lines, margin + 22, yPos);
      yPos += lines.length * 4.5;
    }
    if (data.skills.tools?.length) {
      checkPageBreak(6);
      doc.setFont('helvetica', 'bold');
      doc.text('Tools & Tech:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(data.skills.tools.join(', '), contentWidth - 26);
      doc.text(lines, margin + 26, yPos);
      yPos += lines.length * 4.5;
    }
    if (data.skills.soft?.length) {
      checkPageBreak(6);
      doc.setFont('helvetica', 'bold');
      doc.text('Soft Skills:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(data.skills.soft.join(', '), contentWidth - 22);
      doc.text(lines, margin + 22, yPos);
      yPos += lines.length * 4.5;
    }
    yPos += 3;
  }

  // Education
  const validEdu = data.education.filter(e => e.degree || e.institution);
  if (validEdu.length > 0) {
    drawSectionHeading('Education');
    for (const edu of validEdu) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}`, margin, yPos);

      if (edu.year) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 100, 100);
        doc.text(edu.year, pageWidth - margin, yPos, { align: 'right' });
      }
      yPos += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(`${edu.institution || ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`, margin, yPos);
      yPos += 6;
    }
  }

  // Projects
  const validProj = data.projects?.filter(p => p.name);
  if (validProj?.length > 0) {
    drawSectionHeading('Projects');
    for (const proj of validProj) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      const title = `${proj.name}${proj.technologies?.length ? ` (${proj.technologies.join(', ')})` : ''}`;
      doc.text(title, margin, yPos);
      yPos += 4.5;

      if (proj.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        const descLines = doc.splitTextToSize(proj.description, contentWidth);
        for (const dl of descLines) {
          checkPageBreak(5);
          doc.text(dl, margin, yPos);
          yPos += 4.2;
        }
      }
      yPos += 3;
    }
  }

  // Certifications
  const validCert = data.certifications?.filter(c => c.name);
  if (validCert?.length > 0) {
    drawSectionHeading('Certifications');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    for (const cert of validCert) {
      checkPageBreak(6);
      doc.text(`•  ${cert.name} — ${cert.issuer} ${cert.year ? `(${cert.year})` : ''}`, margin, yPos);
      yPos += 4.5;
    }
  }

  return doc.output('blob');
}

export async function generateBuilderDOCX(data: ResumeBuilderData): Promise<Blob> {
  const { Document, Paragraph, TextRun, Packer, BorderStyle } = await import('docx');
  const theme = themeHexColors[data.themeColor] || themeHexColors.indigo;
  const primaryHex = theme.primary;

  const children: InstanceType<typeof Paragraph>[] = [];

  // Name Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.personalInfo.fullName || 'Candidate',
          bold: true,
          size: 36,
          font: 'Calibri',
          color: '1e293b',
        }),
      ],
      spacing: { after: 60 },
    })
  );

  // Job Title
  if (data.personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.personalInfo.jobTitle,
            bold: true,
            size: 24,
            font: 'Calibri',
            color: primaryHex,
          }),
        ],
        spacing: { after: 100 },
      })
    );
  }

  // Contact info
  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ].filter(Boolean);

  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contacts.join('  |  '),
            size: 19,
            font: 'Calibri',
            color: '64748b',
          }),
        ],
        spacing: { after: 240 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color: primaryHex },
        },
      })
    );
  }

  const addHeading = (text: string) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text.toUpperCase(),
            bold: true,
            size: 24,
            font: 'Calibri',
            color: primaryHex,
          }),
        ],
        spacing: { before: 240, after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: primaryHex },
        },
      })
    );
  };

  // Summary
  if (data.summary?.trim()) {
    addHeading('Professional Summary');
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.summary.trim(),
            size: 21,
            font: 'Calibri',
            color: '334155',
          }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  // Experience
  const validExp = data.experience.filter(e => e.title || e.company);
  if (validExp.length > 0) {
    addHeading('Work Experience');
    for (const exp of validExp) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.title || 'Role',
              bold: true,
              size: 22,
              font: 'Calibri',
              color: '1e293b',
            }),
            new TextRun({
              text: `  |  ${exp.company || ''}${exp.location ? ` (${exp.location})` : ''}`,
              size: 20,
              font: 'Calibri',
              color: '475569',
            }),
            new TextRun({
              text: `  —  ${exp.startDate || ''} to ${exp.current ? 'Present' : exp.endDate || ''}`,
              italics: true,
              size: 19,
              font: 'Calibri',
              color: '64748b',
            }),
          ],
          spacing: { before: 100, after: 40 },
        })
      );

      for (const bullet of exp.description.filter(b => b.trim())) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: bullet.trim(),
                size: 20,
                font: 'Calibri',
                color: '334155',
              }),
            ],
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  // Skills
  const hasSkills = data.skills.technical?.length || data.skills.tools?.length || data.skills.soft?.length;
  if (hasSkills) {
    addHeading('Skills');
    if (data.skills.technical?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Technical: ', bold: true, size: 20, font: 'Calibri', color: '1e293b' }),
            new TextRun({ text: data.skills.technical.join(', '), size: 20, font: 'Calibri', color: '334155' }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    if (data.skills.tools?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Tools & Technologies: ', bold: true, size: 20, font: 'Calibri', color: '1e293b' }),
            new TextRun({ text: data.skills.tools.join(', '), size: 20, font: 'Calibri', color: '334155' }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    if (data.skills.soft?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Soft Skills: ', bold: true, size: 20, font: 'Calibri', color: '1e293b' }),
            new TextRun({ text: data.skills.soft.join(', '), size: 20, font: 'Calibri', color: '334155' }),
          ],
          spacing: { after: 40 },
        })
      );
    }
  }

  // Education
  const validEdu = data.education.filter(e => e.degree || e.institution);
  if (validEdu.length > 0) {
    addHeading('Education');
    for (const edu of validEdu) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}`,
              bold: true,
              size: 21,
              font: 'Calibri',
              color: '1e293b',
            }),
            new TextRun({
              text: `  |  ${edu.institution || ''}  (${edu.year || ''})`,
              size: 20,
              font: 'Calibri',
              color: '475569',
            }),
            edu.gpa
              ? new TextRun({
                  text: `  |  GPA: ${edu.gpa}`,
                  size: 19,
                  font: 'Calibri',
                  color: '64748b',
                })
              : new TextRun({ text: '' }),
          ],
          spacing: { before: 60, after: 60 },
        })
      );
    }
  }

  // Projects
  const validProj = data.projects?.filter(p => p.name);
  if (validProj?.length > 0) {
    addHeading('Projects');
    for (const proj of validProj) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 21,
              font: 'Calibri',
              color: '1e293b',
            }),
            proj.technologies?.length
              ? new TextRun({
                  text: `  [${proj.technologies.join(', ')}]`,
                  size: 19,
                  italics: true,
                  font: 'Calibri',
                  color: primaryHex,
                })
              : new TextRun({ text: '' }),
          ],
          spacing: { before: 60, after: 20 },
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.description,
                size: 20,
                font: 'Calibri',
                color: '334155',
              }),
            ],
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}


