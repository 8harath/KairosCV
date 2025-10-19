import puppeteer from 'puppeteer-core';
import { ProcessedResume } from './types';

export const generatePDFFromResume = async (resume: ProcessedResume): Promise<Buffer> => {
  // Vercel-compatible Puppeteer configuration
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  try {
    const page = await browser.newPage();
    
    // Generate HTML content
    const htmlContent = generateResumeHTML(resume);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

const generateResumeHTML = (resume: ProcessedResume): string => {
  const sectionsHTML = resume.sections
    .filter(section => section.relevance > 0.3) // Only include relevant sections
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
          color: #333;
          background: white;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        
        .header h1 {
          font-size: 2.5em;
          color: #2563eb;
          margin-bottom: 10px;
        }
        
        .summary {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border-left: 4px solid #2563eb;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 1.4em;
          color: #2563eb;
          margin-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
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
  // Convert line breaks to HTML paragraphs
  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p>${line.trim()}</p>`)
    .join('');
};
