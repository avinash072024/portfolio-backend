const Contact = require('../models/Contact');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Education = require('../models/Education');
const Service = require('../models/Service');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const CALIBRI_FONT_FILES = {
  regular: 'calibri-regular.ttf',
  bold: 'calibri-bold.ttf',
  italic: 'calibri-italic.ttf',
  boldItalic: 'calibri-bold-italic.ttf',
};

const CALIBRI_FONT_DIRS = [
  path.join(__dirname, '../assets/fonts'),
  path.join(process.cwd(), 'assets', 'fonts'),
  path.join(process.cwd(), 'src', 'assets', 'fonts'),
];

const resolveFontPath = (fontDir, filename) => {
  const exactPath = path.join(fontDir, filename);
  if (fs.existsSync(exactPath)) {
    return exactPath;
  }

  const matchedFile = fs.readdirSync(fontDir).find((file) => file.toLowerCase() === filename.toLowerCase());

  return matchedFile ? path.join(fontDir, matchedFile) : null;
};

const registerCalibriFonts = (doc) => {
  const fontDir = CALIBRI_FONT_DIRS.find((dir) => fs.existsSync(dir));

  if (!fontDir) {
    console.warn('Calibri font directory not found. Falling back to Helvetica.');
    return false;
  }

  const regularPath = resolveFontPath(fontDir, CALIBRI_FONT_FILES.regular);
  const boldPath = resolveFontPath(fontDir, CALIBRI_FONT_FILES.bold);
  const italicPath = resolveFontPath(fontDir, CALIBRI_FONT_FILES.italic);
  const boldItalicPath = resolveFontPath(fontDir, CALIBRI_FONT_FILES.boldItalic);

  if (!regularPath || !boldPath) {
    console.warn('Required Calibri font files not found in:', fontDir);
    return false;
  }

  doc.registerFont('Calibri', regularPath);
  doc.registerFont('Calibri-Bold', boldPath);
  doc.registerFont('Calibri-Italic', italicPath || regularPath);
  doc.registerFont('Calibri-BoldItalic', boldItalicPath || boldPath);

  console.log('Calibri fonts loaded from:', fontDir);
  return true;
};

const drawSectionHeader = (doc, title, margin, contentWidth) => {
  if (doc.y > doc.page.height - 70) {
    doc.addPage();
  }

  doc.moveDown(0.25);

  doc.font('Calibri-Bold')
    .fontSize(10.5)
    .fillColor('#000000')
    .text(title.toUpperCase(), margin, doc.y);

  doc.moveDown(0.12);

  const lineY = doc.y;

  doc.strokeColor('#000000')
    .lineWidth(0.6)
    .moveTo(margin, lineY)
    .lineTo(margin + contentWidth, lineY)
    .stroke();

  doc.moveDown(0.35);
};

// ============================================
// @desc    Generate ATS-Friendly PDF Resume
// @route   GET /api/resumes/generate-ats
// ============================================
const generateATSResume = async (req, res) => {
  try {

    // ============================================
    // FETCH ALL RESUME DATA
    // ============================================
    const [
      contact, experiences, skills, projects, educations, services
    ] = await Promise.all([
      Contact.findOne(), Experience.find(), Skill.find(), Project.find(), Education.find(), Service.find()
    ]);

    // ============================================
    // CREATE PDF DOCUMENT
    // ============================================
    const doc = new PDFDocument({
      size: 'A4',
      margin: 36,
      info: {
        Title: contact
          ? `${contact.firstName}_${contact.lastName}_Resume_Angular.pdf`
          : 'ATS_Resume.pdf',

        Author: contact
          ? `${contact.firstName} ${contact.lastName}`
          : 'Portfolio Owner',

        Subject: 'ATS Friendly Resume',

        Keywords: 'Resume, Software Engineer, Angular Developer, Portfolio'
      }
    });

    // Stream error handling to catch runtime pipe crashes safely
    doc.on('error', (err) => {
      console.error('PDFKit Stream Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Error generating PDF stream', error: err.message });
      }
    });

    // Load bundled Calibri TTF files (Linux production is case-sensitive).
    if (!registerCalibriFonts(doc)) {
      doc.registerFont('Calibri', 'Helvetica');
      doc.registerFont('Calibri-Bold', 'Helvetica-Bold');
      doc.registerFont('Calibri-Italic', 'Helvetica-Oblique');
      doc.registerFont('Calibri-BoldItalic', 'Helvetica-BoldOblique');
    }

    // ============================================
    // RESPONSE HEADERS
    // ============================================
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${contact ? `${contact.firstName}_${contact.lastName}` : 'Resume'}_Resume_Angular.pdf"`
    );

    // ============================================
    // PIPE PDF TO RESPONSE
    // ============================================
    doc.pipe(res);

    // ============================================
    // PAGE SETTINGS & CONTENT GENERATION
    // ============================================
    const margin = 36;
    const contentWidth = doc.page.width - (margin * 2);

    // HEADER / CONTACT INFORMATION
    if (contact) {
      const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim().toUpperCase();

      doc.font('Calibri-Bold')
        .fontSize(18)
        .fillColor('#000000')
        .text(fullName || 'RESUME', { align: 'center' });

      doc.font('Calibri')
        .fontSize(10.5)
        .fillColor('#222222')
        .text('Senior Software Engineer | Angular Developer', { align: 'center' });

      doc.moveDown(0.3);

      const contactDetails = [contact.email, contact.phone, contact.address].filter(Boolean).join('  |  ');
      if (contactDetails) {
        doc.font('Calibri')
          .fontSize(9.5)
          .fillColor('#333333')
          .text(contactDetails, { align: 'center' });
      }

      const links = [
        contact.linkedin ? `LinkedIn: ${contact.linkedin}` : '',
        // contact.github ? `GitHub: ${contact.github}` : ''
        `Website: https://avinash-modern-portfolio.netlify.app`
      ].filter(Boolean).join('  |  ');

      if (links) {
        doc.moveDown(0.15);
        doc.font('Calibri')
          .fontSize(9)
          .fillColor('#0056b3')
          .text(links, { align: 'center' });
      }
      doc.moveDown(0.4);
    } else {
      doc.font('Calibri-Bold')
        .fontSize(18)
        .fillColor('#000000')
        .text('RESUME', { align: 'center' });
      doc.moveDown(0.4);
    }

    // 1. PROFESSIONAL SUMMARY
    drawSectionHeader(doc, '1. Professional Summary', margin, contentWidth);
    doc.font('Calibri').fontSize(9.5).fillColor('#222222');

    let summaryText = 'Results-driven technical professional with comprehensive experience in designing, building, and maintaining scalable web applications and software solutions. Demonstrated expertise in front-end and back-end architectures, database design, API integrations, and delivering high-impact technical services.';

    if (services && services.length > 0) {
      const serviceTitles = services.map(service => service.title).filter(Boolean).join(', ');
      if (serviceTitles) {
        summaryText += ` Core competencies include: ${serviceTitles}.`;
      }
    }

    doc.text(summaryText, margin, doc.y, { align: 'justify', width: contentWidth, lineGap: 2 });
    doc.moveDown(0.4);

    // 2. PROFESSIONAL EXPERIENCE
    drawSectionHeader(doc, '2. Work Experience', margin, contentWidth);
    if (experiences && experiences.length > 0) {
      experiences.forEach((exp) => {
        if (doc.y > doc.page.height - 80) { doc.addPage(); }
        const currentY = doc.y;
        const titleText = `${exp.title || ''}${exp.company ? ` - ${exp.company}` : ''}`;
        const durationText = exp.duration || '';

        doc.font('Calibri-Bold').fontSize(10);
        const titleHeight = doc.heightOfString(titleText, { width: contentWidth - 120 });
        doc.font('Calibri-Italic').fontSize(9);
        const durationHeight = doc.heightOfString(durationText, { width: 120 });

        doc.font('Calibri-Bold').fontSize(10).fillColor('#000000').text(titleText, margin, currentY, { width: contentWidth - 120 });
        doc.font('Calibri-Italic').fontSize(9).fillColor('#555555').text(durationText, margin, currentY, { width: contentWidth, align: 'right' });

        doc.y = currentY + Math.max(titleHeight, durationHeight);
        doc.moveDown(0.25);

        if (exp.description) {
          doc.font('Calibri').fontSize(9.5).fillColor('#222222');
          const lines = exp.description.split('\n').filter(line => line.trim().length > 0);
          lines.forEach((line) => {
            const cleanLine = line.replace(/^[-•*]\s*/, '');
            doc.text(`• ${cleanLine}`, { indent: 4, width: contentWidth, lineGap: 1.5 });
          });
        }
        doc.moveDown(0.4);
      });
    } else {
      doc.font('Calibri-Italic').fontSize(9.5).fillColor('#555555').text('No experience entries available.');
    }

    // 3. TECHNOLOGY STACK
    drawSectionHeader(doc, '3. Technology Stack', margin, contentWidth);
    if (skills && skills.length > 0) {
      const skillGroups = {};
      skills.forEach((skill) => {
        const category = skill.category || 'General';
        if (!skillGroups[category]) { skillGroups[category] = []; }
        if (skill.name) { skillGroups[category].push(skill.name); }
      });

      Object.keys(skillGroups).forEach((category) => {
        if (doc.y > doc.page.height - 60) { doc.addPage(); }
        doc.font('Calibri-Bold').fontSize(9).fillColor('#222222').text(`• ${category}: `, { continued: true, indent: 4 });
        doc.font('Calibri').fontSize(9).fillColor('#222222').text(skillGroups[category].join(', '));
        doc.moveDown(0.2);
      });
    } else {
      doc.font('Calibri-Italic').fontSize(9.5).fillColor('#555555').text('No skills listed.');
    }

    // 4. KEY PROJECTS
    doc.moveDown(0.5);
    drawSectionHeader(doc, '4. Key Projects', margin, contentWidth);
    const onResumeProjects = projects.filter(project => project.showOnResume);

    if (onResumeProjects && onResumeProjects.length > 0) {
      onResumeProjects.forEach((project) => {
        if (doc.y > doc.page.height - 80) { doc.addPage(); }
        const currentY = doc.y;

        doc.font('Calibri-Bold').fontSize(10).fillColor('#000000').text(`${project.title || ''}`, margin, currentY);
        doc.moveDown(0.2);

        if (project.category || project.clientName) {
          const metaInfo = [
            project.category ? `Category: ${project.category}` : '',
            project.clientName ? `Client: ${project.clientName}` : '',
            project.teamSize ? `Team Size: ${project.teamSize}` : ''
          ].filter(Boolean).join(' | ');
          doc.font('Calibri-Italic').fontSize(8.5).fillColor('#444444').text(metaInfo);
          doc.moveDown(0.2);
        }

        if (project.tools && (Array.isArray(project.tools) ? project.tools.length > 0 : project.tools)) {
          const toolsString = Array.isArray(project.tools) ? project.tools.join(', ') : project.tools;
          doc.font('Calibri-Bold').fontSize(9).fillColor('#222222').text('Technologies: ', { continued: true })
            .font('Calibri').text(toolsString);
        }

        if (project.link) {
          doc.font('Calibri-Bold').fontSize(8.5).fillColor('#0056b3').text(`Link: ${project.link}`);
        }

        if (project.desc) {
          doc.font('Calibri').fontSize(9.5).fillColor('#222222');
          const descList = Array.isArray(project.desc) ? project.desc : String(project.desc).split('\n');
          descList.forEach((description) => {
            if (description && description.trim()) {
              const cleanDescription = description.replace(/^[-•*]\s*/, '');
              doc.text(`• ${cleanDescription}`, { indent: 4, width: contentWidth, lineGap: 1.5 });
            }
          });
        }
        doc.moveDown(0.5);
      });
    } else {
      doc.font('Calibri-Italic').fontSize(9.5).fillColor('#555555').text('No projects listed.');
    }

    // 5. EDUCATION
    drawSectionHeader(doc, '5. Education', margin, contentWidth);

    if (educations && educations.length > 0) {
      educations.forEach((edu) => {
        if (doc.y > doc.page.height - 60) {
          doc.addPage();
        }

        const currentY = doc.y;

        const titleText = edu.title || '';
        const institutionText = edu.institution ? ` - ${edu.institution}` : '';
        const durationText = edu.duration || '';

        const leftWidth = contentWidth - 120;

        // Calculate heights
        doc.font('Calibri-Bold').fontSize(10);

        const titleWidth = doc.widthOfString(titleText);

        doc.font('Calibri').fontSize(10);

        const institutionWidth = doc.widthOfString(institutionText);

        // Calculate total education text height
        const educationHeight = doc.heightOfString(
          `${titleText}${institutionText}`, { width: leftWidth, }
        );

        doc.font('Calibri-Italic').fontSize(9);

        const durationHeight = doc.heightOfString(durationText, { width: 120, });

        // Title - Bold
        doc.font('Calibri-Bold')
          .fontSize(9)
          .fillColor('#000000')
          .text(titleText, margin, currentY, { continued: true, });

        // Institution - Regular
        doc.font('Calibri')
          .fontSize(9)
          .fillColor('#000000')
          .text(institutionText, { width: leftWidth, continued: false, });

        // Duration - Italic and right aligned
        doc.font('Calibri-Italic')
          .fontSize(9)
          .fillColor('#555555')
          .text(durationText, margin, currentY, { width: contentWidth, align: 'right', });

        // Set correct Y position
        doc.y = currentY + Math.max(educationHeight, durationHeight);

        doc.moveDown(0.2);
      });
    } else {
      doc.font('Calibri-Italic').fontSize(9.5).fillColor('#555555').text('No education records available.');
    }

    // 6. LANGUAGES
    doc.moveDown(0.3);
    drawSectionHeader(doc, '6. Languages', margin, contentWidth);
    doc.font('Calibri').fontSize(9.5).fillColor('#222222').text(
      '• English (Professional Working Proficiency)   • Hindi (Full Professional Proficiency)   • Marathi (Native / Bilingual Proficiency)',
      { width: contentWidth, lineGap: 1.5 }
    );

    // FINISH PDF
    doc.end();

  } catch (error) {
    console.error('Error generating ATS PDF resume:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error generating resume', error: error.message });
    }
  }
};

module.exports = {
  generateATSResume
};