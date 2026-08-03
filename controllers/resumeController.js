const Resume = require('../models/Resume');
const Contact = require('../models/Contact');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Education = require('../models/Education');
const Service = require('../models/Service');
const PDFDocument = require('pdfkit');

// Helper function to draw ATS section headers
const drawSectionHeader = (doc, title, margin, contentWidth) => {
  if (doc.y > doc.page.height - 100) {
    doc.addPage();
  } else {
    doc.moveDown(0.6);
  }

  const startY = doc.y;
  doc.font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#111111')
    .text(title.toUpperCase(), margin, startY);

  doc.moveDown(0.2);
  doc.moveTo(margin, doc.y)
    .lineTo(margin + contentWidth, doc.y)
    .lineWidth(0.75)
    .strokeColor('#444444')
    .stroke();

  doc.moveDown(0.4);
};

// @desc    Generate ATS-Friendly PDF Resume
// @route   GET /api/resumes/generate-ats
const generateATSResume = async (req, res) => {
  try {
    // const [contact, experiences, skills, projects, educations, services] = await Promise.all([
    //   Contact.findOne(),
    //   Experience.find().sort({ createdAt: -1 }),
    //   Skill.find(),
    //   Project.find().sort({ completedYear: -1, createdAt: -1 }),
    //   Education.find().sort({ createdAt: -1 }),
    //   Service.find()
    // ]);

    const [contact, experiences, skills, projects, educations, services] = await Promise.all([
      Contact.findOne(),
      Experience.find(),
      Skill.find(),
      Project.find(),
      Education.find(),
      Service.find()
    ]);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 36, // 0.5 inch margin
      info: {
        Title: contact ? `${contact.firstName}_${contact.lastName}_Resume_Angular.pdf` : 'ATS_Resume.pdf',
        Author: contact ? `${contact.firstName} ${contact.lastName}` : 'Portfolio Owner',
        Subject: 'ATS Friendly Resume',
        Keywords: 'Resume, ATS, Software Engineer, Portfolio'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${contact ? contact.firstName + '_' + contact.lastName : 'Resume'}_Resume_Angular.pdf"`
    );

    doc.pipe(res);

    const margin = 36;
    const contentWidth = doc.page.width - margin * 2;

    // --- HEADER / CONTACT INFO ---
    if (contact) {
      const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim().toUpperCase();
      doc.font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#000000')
        .text(fullName || 'RESUME', { align: 'center' });

      doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#000000')
        .text('Senior Software Engineer | Angular Developer', { align: 'center' });
      doc.moveDown(0.3);

      const contactDetails = [
        contact.email,
        contact.phone,
        contact.address
      ].filter(Boolean).join('  |  ');

      if (contactDetails) {
        doc.font('Helvetica')
          .fontSize(9.5)
          .fillColor('#333333')
          .text(contactDetails, { align: 'center' });
      }

      const links = [
        contact.linkedin ? `LinkedIn: ${contact.linkedin}` : '',
        contact.github ? `GitHub: ${contact.github}` : ''
      ].filter(Boolean).join('  |  ');

      if (links) {
        doc.moveDown(0.15);
        doc.font('Helvetica')
          .fontSize(9)
          .fillColor('#0056b3')
          .text(links, { align: 'center' });
      }
      doc.moveDown(0.4);
    } else {
      doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#000000')
        .text('RESUME', { align: 'center' });
      doc.moveDown(0.4);
    }

    // --- 1. PROFILE SUMMARY ---
    drawSectionHeader(doc, 'Professional Summary', margin, contentWidth);
    doc.font('Helvetica').fontSize(9.5).fillColor('#222222');

    let summaryText = 'Results-driven technical professional with comprehensive experience in designing, building, and maintaining scalable web applications and software solutions. Demonstrated expertise in front-end and back-end architectures, database design, API integrations, and delivering high-impact technical services.';

    if (services && services.length > 0) {
      const serviceTitles = services.map(s => s.title).filter(Boolean).join(', ');
      if (serviceTitles) {
        summaryText += ` Core competencies include: ${serviceTitles}.`;
      }
    }

    doc.text(summaryText, margin, doc.y, { align: 'justify', width: contentWidth, lineGap: 2 });
    doc.moveDown(0.4);

    // --- 2. EXPERIENCE ---
    drawSectionHeader(doc, 'Professional Experience', margin, contentWidth);
    if (experiences && experiences.length > 0) {
      experiences.forEach((exp) => {
        if (doc.y > doc.page.height - 80) doc.addPage();

        const currentY = doc.y;
        const titleText = `${exp.title || ''}${exp.company ? ' - ' + exp.company : ''}`;
        const durationText = exp.duration || '';

        doc.font('Helvetica-Bold').fontSize(10);
        const titleHeight = doc.heightOfString(titleText, { width: contentWidth - 120 });
        doc.font('Helvetica-Oblique').fontSize(9);
        const durationHeight = doc.heightOfString(durationText, { width: 120 });

        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#000000')
          .text(titleText, margin, currentY, { width: contentWidth - 120 });

        doc.font('Helvetica-Oblique')
          .fontSize(9)
          .fillColor('#555555')
          .text(durationText, margin, currentY, { width: contentWidth, align: 'right' });

        doc.y = currentY + Math.max(titleHeight, durationHeight);
        doc.moveDown(0.25);

        if (exp.description) {
          doc.font('Helvetica').fontSize(9.5).fillColor('#222222');
          const lines = exp.description.split('\n').filter(line => line.trim().length > 0);
          lines.forEach(line => {
            const cleanLine = line.replace(/^[-•*]\s*/, '');
            doc.text(`•  ${cleanLine}`, { indent: 8, width: contentWidth, lineGap: 1.5 });
          });
        }
        doc.moveDown(0.4);
      });
    } else {
      doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#555555').text('No experience entries available.');
    }

    // --- 3. TECHNOLOGY STACK ---
    drawSectionHeader(doc, 'Technology Stack', margin, contentWidth);
    if (skills && skills.length > 0) {
      const skillGroups = {};
      skills.forEach(sk => {
        const cat = sk.category || 'General';
        if (!skillGroups[cat]) skillGroups[cat] = [];
        if (sk.name) skillGroups[cat].push(sk.name);
      });

      doc.font('Helvetica').fontSize(9.5).fillColor('#222222');
      Object.keys(skillGroups).forEach(category => {
        if (doc.y > doc.page.height - 60) doc.addPage();

        doc.font('Helvetica-Bold').text(`${category}: `, { continued: true })
          .font('Helvetica').text(skillGroups[category].join(', '));
        doc.moveDown(0.2);
      });
    } else {
      doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#555555').text('No skills listed.');
    }

    // --- 4. PROJECT ---
    drawSectionHeader(doc, 'Key Projects', margin, contentWidth);
    if (projects && projects.length > 0) {
      projects.forEach((proj) => {
        if (doc.y > doc.page.height - 80) doc.addPage();

        const currentY = doc.y;
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#000000')
          .text(`${proj.title || ''}${proj.completedYear ? ' (' + proj.completedYear + ')' : ''}`, margin, currentY);

        if (proj.category || proj.clientName) {
          const metaInfo = [
            proj.category ? `Category: ${proj.category}` : '',
            proj.clientName ? `Client: ${proj.clientName}` : '',
            proj.teamSize ? `Team Size: ${proj.teamSize}` : ''
          ].filter(Boolean).join(' | ');

          doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#444444').text(metaInfo);
        }

        if (proj.tools && (Array.isArray(proj.tools) ? proj.tools.length > 0 : proj.tools)) {
          const toolsStr = Array.isArray(proj.tools) ? proj.tools.join(', ') : proj.tools;
          doc.font('Helvetica-Bold').fontSize(9).fillColor('#222222').text('Technologies: ', { continued: true })
            .font('Helvetica').text(toolsStr);
        }

        if (proj.link) {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0056b3').text(`Link: ${proj.link}`);
        }

        if (proj.desc) {
          doc.font('Helvetica').fontSize(9.5).fillColor('#222222');
          const descList = Array.isArray(proj.desc) ? proj.desc : String(proj.desc).split('\n');
          descList.forEach(d => {
            if (d && d.trim()) {
              const cleanD = d.replace(/^[-•*]\s*/, '');
              doc.text(`•  ${cleanD}`, { indent: 8, width: contentWidth, lineGap: 1.5 });
            }
          });
        }
        doc.moveDown(0.4);
      });
    } else {
      doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#555555').text('No projects listed.');
    }

    // --- 5. EDUCATIONS ---
    drawSectionHeader(doc, 'Educations', margin, contentWidth);
    if (educations && educations.length > 0) {
      educations.forEach((edu) => {
        if (doc.y > doc.page.height - 60) doc.addPage();

        const currentY = doc.y;
        const eduText = `• ${edu.title || ''}${edu.institution ? ' - ' + edu.institution : ''}`;
        const durationText = edu.duration || '';

        doc.font('Helvetica').fontSize(10);
        const eduHeight = doc.heightOfString(eduText, { width: contentWidth - 120 });
        doc.font('Helvetica-Oblique').fontSize(9);
        const durationHeight = doc.heightOfString(durationText, { width: 120 });

        doc.font('Helvetica')
          .fontSize(10)
          .fillColor('#000000')
          .text(eduText, margin, currentY, { width: contentWidth - 120 });

        doc.font('Helvetica-Oblique')
          .fontSize(9)
          .fillColor('#555555')
          .text(durationText, margin, currentY, { width: contentWidth, align: 'right' });

        doc.y = currentY + Math.max(eduHeight, durationHeight);
        doc.moveDown(0.3);
      });
    } else {
      doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#555555').text('No education records available.');
    }

    // --- 6. LANGUAGES ---
    drawSectionHeader(doc, 'Languages', margin, contentWidth);
    doc.font('Helvetica').fontSize(9.5).fillColor('#222222')
      .text('•  English (Professional Working Proficiency)', { indent: 8 })
      .text('•  Hindi (Full Professional Proficiency)', { indent: 8 })
      .text('•  Marathi (Native / Bilingual Proficiency)', { indent: 8 });

    // End PDF creation and send response stream
    doc.end();

  } catch (error) {
    console.error('Error generating ATS PDF resume:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error generating resume', error: error.message });
    }
  }
};

// @desc    Get all resumes list (Excludes heavy Base64 string for performance)
// @route   GET /api/resumes
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({}).sort({ createdAt: -1 });
    if (!resumes.length) {
      return res.status(200).json({ success: false, message: 'No resumes found' });
    }
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Upload a new resume
// @route   POST /api/resumes
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    // Convert file buffer to Base64 string
    const base64Str = req.file.buffer.toString('base64');

    const newResume = new Resume({
      title: req.body.title || 'Untitled Resume',
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      pdfData: base64Str,
    });

    await newResume.save();
    emit('refresh-data', { resource: 'resume', action: 'create', resumeId: newResume._id });
    res.status(201).json({ success: true, message: 'Resume uploaded successfully', resumeId: newResume._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update/Edit an existing resume (Metadata or File)
// @route   PUT /api/resumes/:id
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { title: req.body.title };

    // If a new file is uploaded, convert it to Base64 and update fields
    if (req.file) {
      updateData.pdfData = req.file.buffer.toString('base64');
      updateData.fileName = req.file.originalname;
      updateData.contentType = req.file.mimetype;
    }

    const updatedResume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    emit('refresh-data', { resource: 'resume', action: 'update', resumeId: updatedResume._id });
    res.status(200).json({ success: true, message: 'Resume updated successfully', resumeId: updatedResume._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResume = await Resume.findByIdAndDelete(id);

    if (!deletedResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    emit('refresh-data', { resource: 'resume', action: 'delete', resumeId: deletedResume._id });
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get a resume by ID (Optional: Useful for viewing/downloading)
// @route   GET /api/resumes/:id
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    res.status(200).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateATSResume,
  uploadResume,
  updateResume,
  deleteResume,
  getResume,
  getAllResumes
};
