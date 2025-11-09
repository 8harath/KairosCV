import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a professionally formatted PDF resume
 * @param {Object} resumeData - Enhanced resume data
 * @param {string} outputPath - Path where PDF should be saved
 * @returns {Promise<string>} Path to generated PDF
 */
export async function generatePDF(resumeData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Colors
      const primaryColor = '#1e40af'; // Blue
      const textColor = '#1f2937'; // Dark gray
      const lightGray = '#6b7280';

      // Helper functions
      const addSectionTitle = (title) => {
        doc.fontSize(14)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(title.toUpperCase(), { continued: false });
        doc.moveDown(0.3);
        doc.strokeColor(primaryColor)
           .lineWidth(2)
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke();
        doc.moveDown(0.5);
        doc.fillColor(textColor);
      };

      // Header with name and contact info
      doc.fontSize(24)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text(resumeData.personalInfo.name, { align: 'center' });

      doc.moveDown(0.3);

      // Contact information
      const contactInfo = [];
      if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
      if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo.location) contactInfo.push(resumeData.personalInfo.location);

      doc.fontSize(10)
         .fillColor(lightGray)
         .font('Helvetica')
         .text(contactInfo.join(' | '), { align: 'center' });

      // Links
      const links = [];
      if (resumeData.personalInfo.linkedin) links.push(resumeData.personalInfo.linkedin);
      if (resumeData.personalInfo.github) links.push(resumeData.personalInfo.github);

      if (links.length > 0) {
        doc.fontSize(9)
           .fillColor('#2563eb')
           .text(links.join(' | '), { align: 'center' });
      }

      doc.moveDown(1.5);

      // Professional Summary
      if (resumeData.summary) {
        addSectionTitle('Professional Summary');
        doc.fontSize(10)
           .fillColor(textColor)
           .font('Helvetica')
           .text(resumeData.summary, { align: 'justify' });
        doc.moveDown(1);
      }

      // Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        addSectionTitle('Professional Experience');

        resumeData.experience.forEach((exp, index) => {
          doc.fontSize(11)
             .fillColor(textColor)
             .font('Helvetica-Bold')
             .text(exp.title, { continued: true })
             .font('Helvetica')
             .text(` - ${exp.company}`);

          doc.fontSize(9)
             .fillColor(lightGray)
             .text(exp.duration);

          doc.moveDown(0.3);

          if (exp.description) {
            doc.fontSize(10)
               .fillColor(textColor)
               .font('Helvetica')
               .text(exp.description);
            doc.moveDown(0.2);
          }

          if (exp.bullets && exp.bullets.length > 0) {
            exp.bullets.forEach(bullet => {
              doc.fontSize(10)
                 .fillColor(textColor)
                 .font('Helvetica')
                 .list([bullet], { bulletRadius: 1.5, indent: 20 });
            });
          }

          if (index < resumeData.experience.length - 1) {
            doc.moveDown(0.8);
          }
        });
        doc.moveDown(1);
      }

      // Education
      if (resumeData.education && resumeData.education.length > 0) {
        addSectionTitle('Education');

        resumeData.education.forEach((edu, index) => {
          doc.fontSize(11)
             .fillColor(textColor)
             .font('Helvetica-Bold')
             .text(edu.degree, { continued: true })
             .font('Helvetica')
             .text(` - ${edu.institution}`);

          const eduDetails = [];
          if (edu.year) eduDetails.push(edu.year);
          if (edu.gpa) eduDetails.push(`GPA: ${edu.gpa}`);

          if (eduDetails.length > 0) {
            doc.fontSize(9)
               .fillColor(lightGray)
               .text(eduDetails.join(' | '));
          }

          if (index < resumeData.education.length - 1) {
            doc.moveDown(0.5);
          }
        });
        doc.moveDown(1);
      }

      // Skills
      if (resumeData.skills) {
        addSectionTitle('Skills');

        if (resumeData.skills.technical && resumeData.skills.technical.length > 0) {
          doc.fontSize(10)
             .fillColor(textColor)
             .font('Helvetica-Bold')
             .text('Technical: ', { continued: true })
             .font('Helvetica')
             .text(resumeData.skills.technical.join(', '));
          doc.moveDown(0.3);
        }

        if (resumeData.skills.tools && resumeData.skills.tools.length > 0) {
          doc.fontSize(10)
             .fillColor(textColor)
             .font('Helvetica-Bold')
             .text('Tools & Technologies: ', { continued: true })
             .font('Helvetica')
             .text(resumeData.skills.tools.join(', '));
          doc.moveDown(0.3);
        }

        if (resumeData.skills.soft && resumeData.skills.soft.length > 0) {
          doc.fontSize(10)
             .fillColor(textColor)
             .font('Helvetica-Bold')
             .text('Soft Skills: ', { continued: true })
             .font('Helvetica')
             .text(resumeData.skills.soft.join(', '));
        }
        doc.moveDown(1);
      }

      // Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        addSectionTitle('Projects');

        resumeData.projects.forEach((project, index) => {
          doc.fontSize(11)
             .fillColor(textColor)
             .font('Helvetica-Bold')
             .text(project.name);

          doc.fontSize(10)
             .font('Helvetica')
             .text(project.description);

          if (project.technologies && project.technologies.length > 0) {
            doc.fontSize(9)
               .fillColor(lightGray)
               .text('Technologies: ' + project.technologies.join(', '));
          }

          if (project.link) {
            doc.fontSize(9)
               .fillColor('#2563eb')
               .text(project.link);
          }

          if (index < resumeData.projects.length - 1) {
            doc.moveDown(0.8);
          }
        });
      }

      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
}
