// const Resume = require('../models/Resume');
// const Contact = require('../models/Contact');
// const Experience = require('../models/Experience');
// const Skill = require('../models/Skill');
// const Project = require('../models/Project');
// const Education = require('../models/Education');
// const Service = require('../models/Service');
// const PDFDocument = require('pdfkit');
// const path = require('path');

// const drawSectionHeader = (doc, title, margin, contentWidth) => {
//   // Add a new page if there is not enough space
//   if (doc.y > doc.page.height - 70) {
//     doc.addPage();
//   }

//   doc.moveDown(0.25);

//   doc.font('Calibri-Bold')
//     .fontSize(10.5)
//     .fillColor('#000000')
//     .text(title.toUpperCase(), margin, doc.y);

//   doc.moveDown(0.12);

//   const lineY = doc.y;

//   doc.strokeColor('#000000')
//     .lineWidth(0.6)
//     .moveTo(margin, lineY)
//     .lineTo(margin + contentWidth, lineY)
//     .stroke();

//   doc.moveDown(0.35);
// };


// // ============================================
// // @desc    Generate ATS-Friendly PDF Resume
// // @route   GET /api/resumes/generate-ats
// // ============================================
// const generateATSResume = async (req, res) => {
//   try {

//     // ============================================
//     // FETCH ALL RESUME DATA
//     // ============================================
//     const [
//       contact, experiences, skills, projects, educations, services
//     ] = await Promise.all([
//       Contact.findOne(), Experience.find(), Skill.find(), Project.find(), Education.find(), Service.find()
//     ]);

//     // ============================================
//     // CREATE PDF DOCUMENT
//     // ============================================
//     const doc = new PDFDocument({
//       size: 'A4',
//       margin: 36,
//       info: {
//         Title: contact
//           ? `${contact.firstName}_${contact.lastName}_Resume_Angular.pdf`
//           : 'ATS_Resume.pdf',

//         Author: contact
//           ? `${contact.firstName} ${contact.lastName}`
//           : 'Portfolio Owner',

//         Subject: 'ATS Friendly Resume',

//         Keywords: 'Resume, Software Engineer, Angular Developer, Portfolio'
//       }
//     });

//     // ============================================
//     // REGISTER CALIBRI FONTS
//     // ============================================
//     const fontPath = path.join(__dirname, '../assets/fonts');

//     doc.registerFont('Calibri', path.join(fontPath, 'Calibri-regular.ttf'));

//     doc.registerFont('Calibri-Bold', path.join(fontPath, 'Calibri-bold.ttf'));

//     doc.registerFont('Calibri-Italic', path.join(fontPath, 'Calibri-italic.ttf'));

//     doc.registerFont('Calibri-BoldItalic', path.join(fontPath, 'Calibri-bold-italic.ttf'));

//     // ============================================
//     // RESPONSE HEADERS
//     // ============================================
//     res.setHeader(
//       'Content-Type',
//       'application/pdf'
//     );

//     res.setHeader(
//       'Content-Disposition',
//       `inline; filename="${contact
//         ? `${contact.firstName}_${contact.lastName}`
//         : 'Resume'
//       }_Resume_Angular.pdf"`
//     );

//     // ============================================
//     // PIPE PDF TO RESPONSE
//     // ============================================
//     doc.pipe(res);

//     // ============================================
//     // PAGE SETTINGS
//     // ============================================
//     const margin = 36;

//     const contentWidth =
//       doc.page.width - (margin * 2);

//     // ============================================
//     // HEADER / CONTACT INFORMATION
//     // ============================================
//     if (contact) {

//       const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim().toUpperCase();

//       // NAME
//       doc.font('Calibri-Bold')
//         .fontSize(18)
//         .fillColor('#000000')
//         .text(
//           fullName || 'RESUME',
//           {
//             align: 'center'
//           }
//         );

//       // JOB TITLE
//       doc.font('Calibri')
//         .fontSize(10.5)
//         .fillColor('#222222')
//         .text(
//           'Senior Software Engineer | Angular Developer',
//           {
//             align: 'center'
//           }
//         );

//       doc.moveDown(0.3);

//       // CONTACT DETAILS
//       const contactDetails = [
//         contact.email,
//         contact.phone,
//         contact.address
//       ]
//         .filter(Boolean)
//         .join('  |  ');

//       if (contactDetails) {
//         doc.font('Calibri')
//           .fontSize(9.5)
//           .fillColor('#333333')
//           .text(
//             contactDetails,
//             { align: 'center' }
//           );
//       }

//       // LINKEDIN AND GITHUB
//       const links = [
//         contact.linkedin ? `LinkedIn: ${contact.linkedin}` : '',
//         contact.github ? `GitHub: ${contact.github}` : ''
//       ].filter(Boolean).join('  |  ');

//       if (links) {
//         doc.moveDown(0.15);
//         doc.font('Calibri')
//           .fontSize(9)
//           .fillColor('#0056b3')
//           .text(
//             links,
//             { align: 'center' }
//           );
//       }
//       doc.moveDown(0.4);
//     } else {
//       doc.font('Calibri-Bold')
//         .fontSize(18)
//         .fillColor('#000000')
//         .text(
//           'RESUME',
//           {
//             align: 'center'
//           }
//         );

//       doc.moveDown(0.4);
//     }

//     // ============================================
//     // 1. PROFESSIONAL SUMMARY
//     // ============================================
//     drawSectionHeader(
//       doc,
//       '1. Professional Summary',
//       margin,
//       contentWidth
//     );

//     doc.font('Calibri')
//       .fontSize(9.5)
//       .fillColor('#222222');

//     let summaryText =
//       'Results-driven technical professional with comprehensive experience in designing, building, and maintaining scalable web applications and software solutions. Demonstrated expertise in front-end and back-end architectures, database design, API integrations, and delivering high-impact technical services.';

//     if (services && services.length > 0) {

//       const serviceTitles =
//         services
//           .map(service => service.title)
//           .filter(Boolean)
//           .join(', ');

//       if (serviceTitles) {
//         summaryText += ` Core competencies include: ${serviceTitles}.`;
//       }
//     }

//     doc.text(
//       summaryText,
//       margin,
//       doc.y,
//       {
//         align: 'justify',
//         width: contentWidth,
//         lineGap: 2
//       }
//     );
//     doc.moveDown(0.4);

//     // ============================================
//     // 2. PROFESSIONAL EXPERIENCE
//     // ============================================
//     drawSectionHeader(
//       doc,
//       '2. Professional Experience',
//       margin,
//       contentWidth
//     );

//     if (
//       experiences &&
//       experiences.length > 0
//     ) {
//       experiences.forEach((exp) => {
//         if (doc.y > doc.page.height - 80) {
//           doc.addPage();
//         }

//         const currentY = doc.y;

//         const titleText =
//           `${exp.title || ''}${exp.company
//             ? ` - ${exp.company}`
//             : ''
//           }`;

//         const durationText = exp.duration || '';

//         // Calculate title height
//         doc.font('Calibri-Bold').fontSize(10);

//         const titleHeight =
//           doc.heightOfString(
//             titleText, { width: contentWidth - 120 }
//           );

//         // Calculate duration height
//         doc.font('Calibri-Italic')
//           .fontSize(9);

//         const durationHeight =
//           doc.heightOfString(
//             durationText,
//             {
//               width: 120
//             }
//           );

//         // EXPERIENCE TITLE
//         doc.font('Calibri-Bold')
//           .fontSize(10)
//           .fillColor('#000000')
//           .text(
//             titleText,
//             margin,
//             currentY,
//             {
//               width: contentWidth - 120
//             }
//           );

//         // EXPERIENCE DURATION
//         doc.font('Calibri-Italic')
//           .fontSize(9)
//           .fillColor('#555555')
//           .text(
//             durationText,
//             margin,
//             currentY,
//             {
//               width: contentWidth,
//               align: 'right'
//             }
//           );

//         // Update Y position
//         doc.y =
//           currentY +
//           Math.max(
//             titleHeight,
//             durationHeight
//           );

//         doc.moveDown(0.25);

//         // EXPERIENCE DESCRIPTION
//         if (exp.description) {

//           doc.font('Calibri')
//             .fontSize(9.5)
//             .fillColor('#222222');

//           const lines =
//             exp.description
//               .split('\n')
//               .filter(
//                 line =>
//                   line.trim().length > 0
//               );

//           lines.forEach((line) => {
//             const cleanLine = line.replace(/^[-•*]\s*/, '');
//             doc.text(
//               `• ${cleanLine}`,
//               {
//                 indent: 4,
//                 width: contentWidth,
//                 lineGap: 1.5
//               }
//             );
//           });
//         }
//         doc.moveDown(0.4);
//       });

//     } else {
//       doc.font('Calibri-Italic')
//         .fontSize(9.5)
//         .fillColor('#555555')
//         .text('No experience entries available.');
//     }

//     // ============================================
//     // 3. TECHNOLOGY STACK
//     // ============================================
//     drawSectionHeader(
//       doc,
//       '3. Technology Stack',
//       margin,
//       contentWidth
//     );

//     if (
//       skills &&
//       skills.length > 0
//     ) {
//       const skillGroups = {};

//       skills.forEach((skill) => {
//         const category = skill.category || 'General';

//         if (!skillGroups[category]) {
//           skillGroups[category] = [];
//         }

//         if (skill.name) {
//           skillGroups[category].push(skill.name);
//         }
//       });

//       Object.keys(skillGroups).forEach((category) => {
//         if (doc.y > doc.page.height - 60) {
//           doc.addPage();
//         }

//         // CATEGORY
//         doc.font('Calibri-Bold')
//           .fontSize(9.5)
//           .fillColor('#222222')
//           .text(
//             `${category}: `,
//             {
//               continued: true
//             }
//           );

//         // SKILLS
//         doc.font('Calibri')
//           .fontSize(9.5)
//           .fillColor('#222222')
//           .text(
//             skillGroups[category]
//               .join(', ')
//           );
//         doc.moveDown(0.2);
//       });
//     } else {
//       doc.font('Calibri-Italic')
//         .fontSize(9.5)
//         .fillColor('#555555')
//         .text(
//           'No skills listed.'
//         );
//     }


//     // ============================================
//     // 4. KEY PROJECTS
//     // ============================================
//     drawSectionHeader(
//       doc,
//       '4. Key Projects',
//       margin,
//       contentWidth
//     );

//     const onResumeProjects =
//       projects.filter(
//         project =>
//           project.showOnResume
//       );

//     if (onResumeProjects && onResumeProjects.length > 0) {
//       onResumeProjects.forEach(
//         (project) => {
//           if (
//             doc.y >
//             doc.page.height - 80
//           ) { doc.addPage(); }

//           const currentY = doc.y;

//           // PROJECT TITLE
//           doc.font('Calibri-Bold')
//             .fontSize(10)
//             .fillColor('#000000')
//             .text(
//               `${project.title || ''}`,
//               margin,
//               currentY
//             );
//           doc.moveDown(0.2);

//           // PROJECT META INFO
//           if (project.category || project.clientName) {
//             const metaInfo = [
//               project.category ? `Category: ${project.category}` : '',
//               project.clientName ? `Client: ${project.clientName}` : '',
//               project.teamSize ? `Team Size: ${project.teamSize}` : ''
//             ].filter(Boolean).join(' | ');
//             doc.font('Calibri-Italic')
//               .fontSize(8.5)
//               .fillColor('#444444')
//               .text(metaInfo);
//             doc.moveDown(0.3);
//           }

//           // PROJECT TECHNOLOGIES
//           if (project.tools &&
//             (
//               Array.isArray(project.tools)
//                 ? project.tools.length > 0
//                 : project.tools
//             )
//           ) {
//             const toolsString =
//               Array.isArray(project.tools)
//                 ? project.tools.join(', ')
//                 : project.tools;

//             doc.font('Calibri-Bold')
//               .fontSize(9)
//               .fillColor('#222222')
//               .text(
//                 'Technologies: ',
//                 {
//                   continued: true
//                 }
//               )
//               .font('Calibri')
//               .text(
//                 toolsString
//               );
//           }

//           // PROJECT LINK
//           if (project.link) {
//             doc.font('Calibri-Bold')
//               .fontSize(8.5)
//               .fillColor('#0056b3')
//               .text(
//                 `Link: ${project.link}`
//               );
//           }

//           // PROJECT DESCRIPTION
//           if (project.desc) {
//             doc.font('Calibri')
//               .fontSize(9.5)
//               .fillColor('#222222');

//             const descList =
//               Array.isArray(
//                 project.desc
//               )
//                 ? project.desc
//                 : String(
//                   project.desc
//                 ).split('\n');

//             descList.forEach((description) => {
//               if (description && description.trim()) {
//                 const cleanDescription = description.replace(/^[-•*]\s*/, '');

//                 doc.text(
//                   `• ${cleanDescription}`,
//                   {
//                     indent: 4,
//                     width: contentWidth,
//                     lineGap: 1.5
//                   }
//                 );
//               }
//             });
//           }
//           doc.moveDown(0.5);
//         }
//       );

//     } else {
//       doc.font('Calibri-Italic')
//         .fontSize(9.5)
//         .fillColor('#555555')
//         .text(
//           'No projects listed.'
//         );
//     }

//     // ============================================
//     // 5. EDUCATION
//     // ============================================
//     drawSectionHeader(
//       doc,
//       '5. Education',
//       margin,
//       contentWidth
//     );

//     if (educations && educations.length > 0) {
//       educations.forEach((edu) => {
//         if (doc.y > doc.page.height - 60) {
//           doc.addPage();
//         }

//         const currentY = doc.y;

//         const educationText = `${edu.title || ''}${edu.institution ? ` - ${edu.institution}` : ''}`;

//         const durationText = edu.duration || '';

//         // Calculate education height
//         doc.font('Calibri-Bold').fontSize(10);

//         const educationHeight =
//           doc.heightOfString(
//             educationText,
//             { width: contentWidth - 120 }
//           );

//         // Calculate duration height
//         doc.font('Calibri-Italic').fontSize(9);

//         const durationHeight =
//           doc.heightOfString(
//             durationText,
//             { width: 120 }
//           );

//         // EDUCATION TITLE
//         doc.font('Calibri-Bold')
//           .fontSize(10)
//           .fillColor('#000000')
//           .text(
//             educationText,
//             margin,
//             currentY,
//             { width: contentWidth - 120 }
//           );

//         // EDUCATION DURATION
//         doc.font('Calibri-Italic')
//           .fontSize(9)
//           .fillColor('#555555')
//           .text(
//             durationText,
//             margin,
//             currentY,
//             {
//               width: contentWidth,
//               align: 'right'
//             }
//           );

//         doc.y =
//           currentY +
//           Math.max(
//             educationHeight,
//             durationHeight
//           );

//         doc.moveDown(0.3);
//       });
//     } else {
//       doc.font('Calibri-Italic')
//         .fontSize(9.5)
//         .fillColor('#555555')
//         .text(
//           'No education records available.'
//         );
//     }

//     // ============================================
//     // 6. LANGUAGES
//     // ============================================
//     drawSectionHeader(
//       doc,
//       '6. Languages',
//       margin,
//       contentWidth
//     );


//     doc.font('Calibri')
//       .fontSize(9.5)
//       .fillColor('#222222')
//       .text(
//         '• English (Professional Working Proficiency)   • Hindi (Full Professional Proficiency)   • Marathi (Native / Bilingual Proficiency)',
//         {
//           width: contentWidth,
//           lineGap: 1.5
//         }
//       );

//     // ============================================
//     // FINISH PDF
//     // ============================================
//     doc.end();

//   } catch (error) {

//     console.error(
//       'Error generating ATS PDF resume:',
//       error
//     );

//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         message:
//           'Server error generating resume',
//         error:
//           error.message
//       });
//     }
//   }
// };

// // @desc    Get all resumes list (Excludes heavy Base64 string for performance)
// // @route   GET /api/resumes
// const getAllResumes = async (req, res) => {
//   try {
//     const resumes = await Resume.find({}).sort({ createdAt: -1 });
//     if (!resumes.length) {
//       return res.status(200).json({ success: false, message: 'No resumes found' });
//     }
//     res.status(200).json({ success: true, resumes });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// // @desc    Upload a new resume
// // @route   POST /api/resumes
// const uploadResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
//     }

//     // Convert file buffer to Base64 string
//     const base64Str = req.file.buffer.toString('base64');

//     const newResume = new Resume({
//       title: req.body.title || 'Untitled Resume',
//       fileName: req.file.originalname,
//       contentType: req.file.mimetype,
//       pdfData: base64Str,
//     });

//     await newResume.save();
//     emit('refresh-data', { resource: 'resume', action: 'create', resumeId: newResume._id });
//     res.status(201).json({ success: true, message: 'Resume uploaded successfully', resumeId: newResume._id });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// // @desc    Update/Edit an existing resume (Metadata or File)
// // @route   PUT /api/resumes/:id
// const updateResume = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let updateData = { title: req.body.title };

//     // If a new file is uploaded, convert it to Base64 and update fields
//     if (req.file) {
//       updateData.pdfData = req.file.buffer.toString('base64');
//       updateData.fileName = req.file.originalname;
//       updateData.contentType = req.file.mimetype;
//     }

//     const updatedResume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedResume) {
//       return res.status(404).json({ success: false, message: 'Resume not found' });
//     }

//     emit('refresh-data', { resource: 'resume', action: 'update', resumeId: updatedResume._id });
//     res.status(200).json({ success: true, message: 'Resume updated successfully', resumeId: updatedResume._id });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// // @desc    Delete a resume
// // @route   DELETE /api/resumes/:id
// const deleteResume = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedResume = await Resume.findByIdAndDelete(id);

//     if (!deletedResume) {
//       return res.status(404).json({ success: false, message: 'Resume not found' });
//     }

//     emit('refresh-data', { resource: 'resume', action: 'delete', resumeId: deletedResume._id });
//     res.status(200).json({ success: true, message: 'Resume deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// // @desc    Get a resume by ID (Optional: Useful for viewing/downloading)
// // @route   GET /api/resumes/:id
// const getResume = async (req, res) => {
//   try {
//     const resume = await Resume.findById(req.params.id);
//     if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

//     res.status(200).json({ success: true, resume });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// module.exports = {
//   generateATSResume,
//   uploadResume,
//   updateResume,
//   deleteResume,
//   getResume,
//   getAllResumes
// };






















































































const Resume = require('../models/Resume');
const Contact = require('../models/Contact');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Education = require('../models/Education');
const Service = require('../models/Service');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const drawSectionHeader = (doc, title, margin, contentWidth) => {
  // Add a new page if there is not enough space
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

    // ============================================
    // REGISTER CALIBRI FONTS USING ABSOLUTE BUFFERS
    // (Ensures compatibility with Vercel & Render)
    // ============================================
    const fontDir = path.resolve(__dirname, '../assets/fonts');

    try {
      doc.registerFont('Calibri', fs.readFileSync(path.join(fontDir, 'Calibri-regular.ttf')));
      doc.registerFont('Calibri-Bold', fs.readFileSync(path.join(fontDir, 'Calibri-bold.ttf')));
      doc.registerFont('Calibri-Italic', fs.readFileSync(path.join(fontDir, 'Calibri-italic.ttf')));
      doc.registerFont('Calibri-BoldItalic', fs.readFileSync(path.join(fontDir, 'Calibri-bold-italic.ttf')));
    } catch (fontError) {
      console.warn('Custom font loading failed from disk, falling back to standard Helvetica fonts:', fontError.message);
      // Fallback mapping if custom files cannot be read from container
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
      `inline; filename="${contact
        ? `${contact.firstName}_${contact.lastName}`
        : 'Resume'
      }_Resume_Angular.pdf"`
    );

    // ============================================
    // PIPE PDF TO RESPONSE
    // ============================================
    doc.pipe(res);

    // ============================================
    // PAGE SETTINGS
    // ============================================
    const margin = 36;

    const contentWidth =
      doc.page.width - (margin * 2);

    // ============================================
    // HEADER / CONTACT INFORMATION
    // ============================================
    if (contact) {

      const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim().toUpperCase();

      // NAME
      doc.font('Calibri-Bold')
        .fontSize(18)
        .fillColor('#000000')
        .text(
          fullName || 'RESUME',
          {
            align: 'center'
          }
        );

      // JOB TITLE
      doc.font('Calibri')
        .fontSize(10.5)
        .fillColor('#222222')
        .text(
          'Senior Software Engineer | Angular Developer',
          {
            align: 'center'
          }
        );

      doc.moveDown(0.3);

      // CONTACT DETAILS
      const contactDetails = [
        contact.email,
        contact.phone,
        contact.address
      ]
        .filter(Boolean)
        .join('  |  ');

      if (contactDetails) {
        doc.font('Calibri')
          .fontSize(9.5)
          .fillColor('#333333')
          .text(
            contactDetails,
            { align: 'center' }
          );
      }

      // LINKEDIN AND GITHUB
      const links = [
        contact.linkedin ? `LinkedIn: ${contact.linkedin}` : '',
        contact.github ? `GitHub: ${contact.github}` : ''
      ].filter(Boolean).join('  |  ');

      if (links) {
        doc.moveDown(0.15);
        doc.font('Calibri')
          .fontSize(9)
          .fillColor('#0056b3')
          .text(
            links,
            { align: 'center' }
          );
      }
      doc.moveDown(0.4);
    } else {
      doc.font('Calibri-Bold')
        .fontSize(18)
        .fillColor('#000000')
        .text(
          'RESUME',
          {
            align: 'center'
          }
        );

      doc.moveDown(0.4);
    }

    // ============================================
    // 1. PROFESSIONAL SUMMARY
    // ============================================
    drawSectionHeader(
      doc,
      '1. Professional Summary',
      margin,
      contentWidth
    );

    doc.font('Calibri')
      .fontSize(9.5)
      .fillColor('#222222');

    let summaryText =
      'Results-driven technical professional with comprehensive experience in designing, building, and maintaining scalable web applications and software solutions. Demonstrated expertise in front-end and back-end architectures, database design, API integrations, and delivering high-impact technical services.';

    if (services && services.length > 0) {

      const serviceTitles =
        services
          .map(service => service.title)
          .filter(Boolean)
          .join(', ');

      if (serviceTitles) {
        summaryText += ` Core competencies include: ${serviceTitles}.`;
      }
    }

    doc.text(
      summaryText,
      margin,
      doc.y,
      {
        align: 'justify',
        width: contentWidth,
        lineGap: 2
      }
    );
    doc.moveDown(0.4);

    // ============================================
    // 2. PROFESSIONAL EXPERIENCE
    // ============================================
    drawSectionHeader(
      doc,
      '2. Professional Experience',
      margin,
      contentWidth
    );

    if (
      experiences &&
      experiences.length > 0
    ) {
      experiences.forEach((exp) => {
        if (
          doc.y >
          doc.page.height - 80
        ) { doc.addPage(); }

        const currentY = doc.y;

        const titleText =
          `${exp.title || ''}${exp.company
            ? ` - ${exp.company}`
            : ''
          }`;

        const durationText = exp.duration || '';

        // Calculate title height
        doc.font('Calibri-Bold').fontSize(10);

        const titleHeight =
          doc.heightOfString(
            titleText, { width: contentWidth - 120 }
          );

        // Calculate duration height
        doc.font('Calibri-Italic')
          .fontSize(9);

        const durationHeight =
          doc.heightOfString(
            durationText,
            {
              width: 120
            }
          );

        // EXPERIENCE TITLE
        doc.font('Calibri-Bold')
          .fontSize(10)
          .fillColor('#000000')
          .text(
            titleText,
            margin,
            currentY,
            {
              width: contentWidth - 120
            }
          );

        // EXPERIENCE DURATION
        doc.font('Calibri-Italic')
          .fontSize(9)
          .fillColor('#555555')
          .text(
            durationText,
            margin,
            currentY,
            {
              width: contentWidth,
              align: 'right'
            }
          );

        // Update Y position
        doc.y =
          currentY +
          Math.max(
            titleHeight,
            durationHeight
          );

        doc.moveDown(0.25);

        // EXPERIENCE DESCRIPTION
        if (exp.description) {

          doc.font('Calibri')
            .fontSize(9.5)
            .fillColor('#222222');

          const lines =
            exp.description
              .split('\n')
              .filter(
                line =>
                  line.trim().length > 0
              );

          lines.forEach((line) => {
            const cleanLine = line.replace(/^[-•*]\s*/, '');
            doc.text(
              `• ${cleanLine}`,
              {
                indent: 4,
                width: contentWidth,
                lineGap: 1.5
              }
            );
          });
        }
        doc.moveDown(0.4);
      });

    } else {
      doc.font('Calibri-Italic')
        .fontSize(9.5)
        .fillColor('#555555')
        .text('No experience entries available.');
    }

    // ============================================
    // 3. TECHNOLOGY STACK
    // ============================================
    drawSectionHeader(
      doc,
      '3. Technology Stack',
      margin,
      contentWidth
    );

    if (
      skills &&
      skills.length > 0
    ) {
      const skillGroups = {};

      skills.forEach((skill) => {
        const category = skill.category || 'General';

        if (!skillGroups[category]) {
          skillGroups[category] = [];
        }

        if (skill.name) {
          skillGroups[category].push(skill.name);
        }
      });

      Object.keys(skillGroups).forEach((category) => {
        if (doc.y > doc.page.height - 60) {
          doc.addPage();
        }

        // CATEGORY
        doc.font('Calibri-Bold')
          .fontSize(9.5)
          .fillColor('#222222')
          .text(
            `${category}: `,
            {
              continued: true
            }
          );

        // SKILLS
        doc.font('Calibri')
          .fontSize(9.5)
          .fillColor('#222222')
          .text(
            skillGroups[category]
              .join(', ')
          );
        doc.moveDown(0.2);
      });
    } else {

      doc.font('Calibri-Italic')
        .fontSize(9.5)
        .fillColor('#555555')
        .text(
          'No skills listed.'
        );
    }

    // ============================================
    // 4. KEY PROJECTS
    // ============================================
    drawSectionHeader(
      doc,
      '4. Key Projects',
      margin,
      contentWidth
    );

    const onResumeProjects =
      projects.filter(
        project =>
          project.showOnResume
      );

    if (onResumeProjects && onResumeProjects.length > 0) {
      onResumeProjects.forEach(
        (project) => {
          if (
            doc.y >
            doc.page.height - 80
          ) { doc.addPage(); }

          const currentY = doc.y;

          // PROJECT TITLE
          doc.font('Calibri-Bold')
            .fontSize(10)
            .fillColor('#000000')
            .text(
              `${project.title || ''}`,
              margin,
              currentY
            );
          doc.moveDown(0.2);

          // PROJECT META INFO
          if (project.category || project.clientName) {
            const metaInfo = [
              project.category ? `Category: ${project.category}` : '',
              project.clientName ? `Client: ${project.clientName}` : '',
              project.teamSize ? `Team Size: ${project.teamSize}` : ''
            ].filter(Boolean).join(' | ');
            doc.font('Calibri-Italic')
              .fontSize(8.5)
              .fillColor('#444444')
              .text(metaInfo);
            doc.moveDown(0.2);
          }

          // PROJECT TECHNOLOGIES
          if (project.tools &&
            (
              Array.isArray(project.tools)
                ? project.tools.length > 0
                : project.tools
            )
          ) {
            const toolsString =
              Array.isArray(project.tools)
                ? project.tools.join(', ')
                : project.tools;

            doc.font('Calibri-Bold')
              .fontSize(9)
              .fillColor('#222222')
              .text(
                'Technologies: ',
                {
                  continued: true
                }
              )
              .font('Calibri')
              .text(
                toolsString
              );
          }

          // PROJECT LINK
          if (project.link) {
            doc.font('Calibri-Bold')
              .fontSize(8.5)
              .fillColor('#0056b3')
              .text(
                `Link: ${project.link}`
              );
          }

          // PROJECT DESCRIPTION
          if (project.desc) {
            doc.font('Calibri')
              .fontSize(9.5)
              .fillColor('#222222');

            const descList =
              Array.isArray(
                project.desc
              )
                ? project.desc
                : String(
                  project.desc
                ).split('\n');

            descList.forEach((description) => {
              if (description && description.trim()) {
                const cleanDescription = description.replace(/^[-•*]\s*/, '');

                doc.text(
                  `• ${cleanDescription}`,
                  {
                    indent: 4,
                    width: contentWidth,
                    lineGap: 1.5
                  }
                );
              }
            });
          }
          doc.moveDown(0.5);
        }
      );

    } else {
      doc.font('Calibri-Italic')
        .fontSize(9.5)
        .fillColor('#555555')
        .text(
          'No projects listed.'
        );
    }

    // ============================================
    // 5. EDUCATION
    // ============================================
    drawSectionHeader(
      doc,
      '5. Education',
      margin,
      contentWidth
    );

    if (educations && educations.length > 0) {
      educations.forEach((edu) => {
        if (doc.y > doc.page.height - 60) {
          doc.addPage();
        }

        const currentY = doc.y;

        const educationText = `${edu.title || ''}${edu.institution ? ` - ${edu.institution}` : ''}`;

        const durationText = edu.duration || '';

        // Calculate education height
        doc.font('Calibri-Bold').fontSize(10);

        const educationHeight =
          doc.heightOfString(
            educationText,
            { width: contentWidth - 120 }
          );

        // Calculate duration height
        doc.font('Calibri-Italic').fontSize(9);

        const durationHeight =
          doc.heightOfString(
            durationText,
            { width: 120 }
          );

        // EDUCATION TITLE
        doc.font('Calibri-Bold')
          .fontSize(10)
          .fillColor('#000000')
          .text(
            educationText,
            margin,
            currentY,
            { width: contentWidth - 120 }
          );

        // EDUCATION DURATION
        doc.font('Calibri-Italic')
          .fontSize(9)
          .fillColor('#555555')
          .text(
            durationText,
            margin,
            currentY,
            {
              width: contentWidth,
              align: 'right'
            }
          );

        doc.y =
          currentY +
          Math.max(
            educationHeight,
            durationHeight
          );

        doc.moveDown(0.3);
      });
    } else {
      doc.font('Calibri-Italic')
        .fontSize(9.5)
        .fillColor('#555555')
        .text(
          'No education records available.'
        );
    }

    // ============================================
    // 6. LANGUAGES
    // ============================================
    drawSectionHeader(
      doc,
      '6. Languages',
      margin,
      contentWidth
    );


    doc.font('Calibri')
      .fontSize(9.5)
      .fillColor('#222222')
      .text(
        '• English (Professional Working Proficiency)   • Hindi (Full Professional Proficiency)   • Marathi (Native / Bilingual Proficiency)',
        {
          width: contentWidth,
          lineGap: 1.5
        }
      );

    // ============================================
    // FINISH PDF
    // ============================================
    doc.end();

  } catch (error) {

    console.error(
      'Error generating ATS PDF resume:',
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          'Server error generating resume',
        error:
          error.message
      });
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