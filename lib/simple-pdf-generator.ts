import { ProcessedResume } from './types';

// Alternative PDF generation using HTML-to-PDF conversion
// This is a fallback method that works better on Vercel
export const generateSimplePDF = async (resume: ProcessedResume): Promise<string> => {
  const htmlContent = generateResumeHTML(resume);
  
  // Return HTML content that can be converted to PDF client-side
  // or use a service like HTML/CSS to PDF API
  return htmlContent;
};

// Generate a simple text-based resume for download
export const generateTextResume = (resume: ProcessedResume): string => {
  const sections = resume.sections
    .filter(section => section.relevance > 0.3)
    .map(section => `${section.title}\n${'='.repeat(section.title.length)}\n${section.content}`)
    .join('\n\n');

  return `PROFESSIONAL RESUME\n${'='.repeat(20)}\n\n${resume.summary}\n\n${sections}`;
};

const generateResumeHTML = (resume: ProcessedResume): string => {
  const sectionsHTML = resume.sections
    .filter(section => section.relevance > 0.3)
    .map(section => `
      <div class="section">
        <h2 class="section-title">${section.title}</h2>
        <div class="section-content">${formatContent(section.content)}</div>
      </div>
    `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #121212;
          background: #F5F4ED;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #C6613F;
          padding-bottom: 20px;
        }
        
        .header h1 {
          font-size: 2.5em;
          color: #C6613F;
          margin-bottom: 10px;
        }
        
        .summary {
          background: #FEF3C7;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border-left: 4px solid #C6613F;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 1.4em;
          color: #C6613F;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(18, 18, 18, 0.1);
          padding-bottom: 5px;
        }
        
        .section-content {
          line-height: 1.8;
        }
        
        .section-content p {
          margin-bottom: 10px;
        }
        
        .section-content ul {
          margin-left: 20px;
          margin-bottom: 10px;
        }
        
        .section-content li {
          margin-bottom: 5px;
        }
        
        @media print {
          body {
            font-size: 12px;
          }
          
          .container {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Professional Resume</h1>
        </div>
        
        ${resume.summary ? `
          <div class="summary">
            <h3>Professional Summary</h3>
            <p>${resume.summary}</p>
          </div>
        ` : ''}
        
        ${sectionsHTML}
      </div>
    </body>
    </html>
  `;
};

const formatContent = (content: string): string => {
  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p>${line.trim()}</p>`)
    .join('');
};
