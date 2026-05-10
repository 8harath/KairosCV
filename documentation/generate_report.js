const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, LevelFormat, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TableOfContents, ImageRun
} = require('docx');
const fs = require('fs');

// ─── Color palette ──────────────────────────────────────────────────────────
const BLUE   = "1F3864";   // deep navy – headings
const ACCENT = "2E74B5";   // medium blue – sub-headings / decorative rules
const GRAY   = "4A4A4A";   // body text
const LGRAY  = "F2F5F9";   // table header fills
const WHITE  = "FFFFFF";
const BLACK  = "000000";

// ─── Helpers ────────────────────────────────────────────────────────────────
const br = () => new Paragraph({ children: [new TextRun("")], spacing: { before: 80, after: 80 } });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const body = (text, opts = {}) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size: 24, color: GRAY, ...opts })],
    spacing: { before: 100, after: 100, line: 360, lineRule: "auto" },
    alignment: AlignmentType.JUSTIFIED,
  });

const bodyBold = (text) => body(text, { bold: true });

const placeholder = (text) =>
  new Paragraph({
    children: [new TextRun({
      text: `[Image Placeholder: ${text}]`,
      font: "Calibri",
      size: 22,
      italics: true,
      color: "7F7F7F",
    })],
    spacing: { before: 180, after: 180 },
    alignment: AlignmentType.CENTER,
    border: {
      top:    { style: BorderStyle.DASHED, size: 4, color: "AAAAAA" },
      bottom: { style: BorderStyle.DASHED, size: 4, color: "AAAAAA" },
      left:   { style: BorderStyle.DASHED, size: 4, color: "AAAAAA" },
      right:  { style: BorderStyle.DASHED, size: 4, color: "AAAAAA" },
    },
    shading: { fill: "F8F8F8", type: ShadingType.CLEAR },
  });

const bullet = (text, level = 0) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size: 24, color: GRAY })],
    numbering: { reference: "bullets", level },
    spacing: { before: 60, after: 60, line: 340, lineRule: "auto" },
    alignment: AlignmentType.JUSTIFIED,
  });

const numbered = (text, level = 0) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size: 24, color: GRAY })],
    numbering: { reference: "numbers", level },
    spacing: { before: 60, after: 60, line: 340, lineRule: "auto" },
    alignment: AlignmentType.JUSTIFIED,
  });

const h1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Calibri", size: 36, bold: true, color: BLUE })],
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
  });

const h2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Calibri", size: 28, bold: true, color: ACCENT })],
    spacing: { before: 300, after: 140 },
  });

const h3 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: "Calibri", size: 26, bold: true, color: "2D5B8E" })],
    spacing: { before: 200, after: 100 },
  });

const centeredBold = (text, size = 28, color = BLUE) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size, bold: true, color })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 80 },
  });

const centered = (text, size = 24, italic = false, color = GRAY) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size, italics: italic, color })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
  });

// Table helper
const cellP = (text, bold = false, center = false) =>
  new Paragraph({
    children: [new TextRun({ text, font: "Calibri", size: 22, bold, color: BLACK })],
    alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 60, after: 60 },
  });

const headerCell = (text) =>
  new TableCell({
    children: [cellP(text, true, true)],
    shading: { fill: "1F3864", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    width: { size: 4680, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    },
  });

const dataCell = (text, shade = false, w = 4680) =>
  new TableCell({
    children: [cellP(text)],
    shading: { fill: shade ? "EEF2F7" : WHITE, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    width: { size: w, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
  });

// ─── FRONT MATTER sections ───────────────────────────────────────────────────
const coverPage = () => [
  br(), br(), br(), br(), br(),
  new Paragraph({
    children: [new TextRun({ text: "JAIN KNOWLEDGE CAMPUS", font: "Calibri", size: 28, bold: true, color: BLUE })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
  }),
  centered("Jayanagar 9th Block, Bangalore – 560069", 24),
  centered("Department of Computer Science & IT", 24, false, ACCENT),
  br(), br(),
  centeredBold("KairosCV", 56, BLUE),
  centered("AI-Powered Resume Optimization Platform", 28, true, ACCENT),
  br(), br(),
  centeredBold("CAPSTONE PROJECT REPORT", 32, BLUE),
  br(),
  centered("Submitted in partial fulfilment for the award of the degree of", 24, true),
  centeredBold("BACHELOR OF COMPUTER APPLICATIONS", 28),
  br(), br(),
  centered("Submitted by", 24, true),
  br(),
  new Paragraph({
    children: [new TextRun({ text: "Team Members", font: "Calibri", size: 26, bold: true, color: BLUE })],
    alignment: AlignmentType.CENTER,
  }),
  br(),
  new Table({
    width: { size: 7200, type: WidthType.DXA },
    columnWidths: [3600, 3600],
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [cellP("Name", true, true)], shading: { fill: LGRAY, type: ShadingType.CLEAR }, margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:2, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:2, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:2, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:2, color:"CCCCCC"} } }),
        new TableCell({ children: [cellP("USN", true, true)], shading: { fill: LGRAY, type: ShadingType.CLEAR }, margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:2, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:2, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:2, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:2, color:"CCCCCC"} } }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 1]", false, true)], margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:1, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"} } }),
        new TableCell({ children: [cellP("[USN 1]", false, true)], margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:1, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"} } }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 2]", false, true)], margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:1, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"} } }),
        new TableCell({ children: [cellP("[USN 2]", false, true)], margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:1, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"} } }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 3]", false, true)], margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:1, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"} } }),
        new TableCell({ children: [cellP("[USN 3]", false, true)], margins: { top:80, bottom:80, left:100, right:100 }, width: { size: 3600, type: WidthType.DXA }, borders: { top: {style: BorderStyle.SINGLE, size:1, color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, left:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"}, right:{style:BorderStyle.SINGLE, size:1, color:"CCCCCC"} } }),
      ]}),
    ],
  }),
  br(), br(),
  centered("Under the Guidance of", 24, true),
  centeredBold("[Faculty Guide Name]", 26),
  centered("Designation, Department of Computer Science & IT", 22),
  br(), br(),
  centeredBold("APRIL – 2026", 28, ACCENT),
  pageBreak(),
];

const certificatePage = () => [
  centeredBold("DEPARTMENT OF COMPUTER SCIENCE & IT", 28, BLUE),
  centered("Jain Knowledge Campus, Jayanagar 9th Block, Bangalore – 560069", 22),
  br(), br(),
  centeredBold("CERTIFICATE", 32, BLUE),
  br(),
  body("This is to certify that the Capstone Project entitled"),
  br(),
  centeredBold("\"KairosCV: AI-Powered Resume Optimization Platform\"", 26, ACCENT),
  br(),
  body("is a bonafide work carried out by the following students of the Bachelor of Computer Applications programme during the academic year 2025–2026, in partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) with Specialization."),
  br(),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [cellP("Student Name", true, true)], shading:{fill:LGRAY, type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("USN", true, true)], shading:{fill:LGRAY, type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("Signature", true, true)], shading:{fill:LGRAY, type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}} }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 1]")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("[USN 1]")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 2]")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("[USN 2]")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 3]")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("[USN 3]")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("")], margins:{top:80,bottom:80,left:100,right:100}, width:{size:3120,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
      ]}),
    ],
  }),
  br(), br(),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [new Paragraph({children:[new TextRun({text:"Faculty Guide",font:"Calibri",size:24,bold:true,color:GRAY})]}), new Paragraph({children:[new TextRun({text:"[Guide Name]",font:"Calibri",size:24,color:GRAY})]}), new Paragraph({children:[new TextRun({text:"Designation, Dept. of CS & IT",font:"Calibri",size:22,color:GRAY})]}), new Paragraph({children:[new TextRun({text:"Jain (Deemed-to-be University)",font:"Calibri",size:22,color:GRAY})]})], borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:120,bottom:120,left:0,right:0}, width:{size:4680,type:WidthType.DXA} }),
        new TableCell({ children: [new Paragraph({children:[new TextRun({text:"Head of Department",font:"Calibri",size:24,bold:true,color:GRAY})]}), new Paragraph({children:[new TextRun({text:"[HOD Name]",font:"Calibri",size:24,color:GRAY})]}), new Paragraph({children:[new TextRun({text:"Department of Computer Science & IT",font:"Calibri",size:22,color:GRAY})]}), new Paragraph({children:[new TextRun({text:"Jain (Deemed-to-be University)",font:"Calibri",size:22,color:GRAY})]})], borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:120,bottom:120,left:0,right:0}, width:{size:4680,type:WidthType.DXA} }),
      ]}),
    ],
  }),
  pageBreak(),
];

const declarationPage = () => [
  centeredBold("DECLARATION", 32, BLUE),
  br(),
  body("To Whomsoever It May Concern"),
  br(),
  body("We, [Student Name 1] (USN: [USN 1]), [Student Name 2] (USN: [USN 2]), and [Student Name 3] (USN: [USN 3]), students of the Bachelor of Computer Applications programme at Jain (Deemed-to-be University), Jayanagar, Bengaluru, hereby declare that the work presented in this report titled:"),
  br(),
  centeredBold("\"KairosCV: AI-Powered Resume Optimization Platform\"", 26, ACCENT),
  br(),
  body("has been carried out by us under the supervision of [Faculty Guide Name], [Designation], Department of Computer Science & IT, Jain (Deemed-to-be University), as a record of original work undertaken for the partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications."),
  br(),
  body("We further declare that the work embodied in this report has not been submitted for the award of any other degree or diploma in this institution or any other institution or university. All material borrowed from published and unpublished sources has been duly acknowledged."),
  br(), br(),
  centered("Place: Bengaluru", 22),
  centered("Date: April 2026", 22),
  br(), br(),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [cellP("[Student Name 1]", true), cellP("[USN 1]")], borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:80,bottom:80,left:0,right:40}, width:{size:3120,type:WidthType.DXA} }),
        new TableCell({ children: [cellP("[Student Name 2]", true), cellP("[USN 2]")], borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:80,bottom:80,left:0,right:40}, width:{size:3120,type:WidthType.DXA} }),
        new TableCell({ children: [cellP("[Student Name 3]", true), cellP("[USN 3]")], borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:80,bottom:80,left:0,right:0}, width:{size:3120,type:WidthType.DXA} }),
      ]}),
    ],
  }),
  pageBreak(),
];

const acknowledgementPage = () => [
  centeredBold("ACKNOWLEDGEMENT", 32, BLUE),
  br(),
  body("We would like to express our heartfelt gratitude to all those who contributed to the successful completion of this capstone project."),
  br(),
  body("We are deeply grateful to our Faculty Guide, [Faculty Guide Name], [Designation], Department of Computer Science & IT, Jain (Deemed-to-be University), for the invaluable guidance, constant encouragement, and constructive feedback provided throughout the course of this project. Their mentorship during every pivotal phase of our work has been a source of great motivation and learning."),
  br(),
  body("We sincerely thank our Industry Mentor, [Industry Mentor Name], [Designation], [Organisation], for providing expert guidance, practical insights, and timely feedback that significantly contributed to the depth and quality of this work. Their industry perspective enriched our understanding and helped us align our implementation with real-world expectations."),
  br(),
  body("We extend our sincere appreciation to the faculty and staff members of the Department of Computer Science & IT, Jain Knowledge Campus, Jayanagar, for their continued support, expertise, and encouragement throughout the programme."),
  br(),
  body("We are also grateful to our friends and peers for their constant support and suggestions that helped make this report more comprehensive and effective."),
  br(),
  body("Finally, we dedicate this work to our families, whose unwavering support, patience, and encouragement during these years have been our greatest strength."),
  br(), br(),
  centered("[Student Name 1], [Student Name 2], [Student Name 3]", 22, true),
  centered("Department of Computer Science & IT", 22),
  centered("Jain Knowledge Campus, Bengaluru", 22),
  centered("April 2026", 22),
  pageBreak(),
];

const abstractPage = () => [
  centeredBold("ABSTRACT", 32, BLUE),
  br(),
  body("This report presents KairosCV, an AI-powered resume optimization platform developed as a capstone project by a team of three students from the Department of Computer Science & IT, Jain Knowledge Campus. The project addresses a widely encountered and practically significant challenge faced by students, recent graduates, and job seekers: the difficulty of transforming an existing resume into a concise, professionally formatted, and Applicant Tracking System (ATS)-compatible document without extensive manual effort."),
  br(),
  body("KairosCV is designed as a full-stack web application that accepts resume files in PDF, DOCX, and TXT formats, processes them through a structured multi-stage backend pipeline, and generates an optimized one-page PDF output. The system integrates artificial intelligence at multiple points in the processing workflow, including structured content extraction, bullet-point enhancement, professional summary generation, and skill categorization. Resume processing is further supported by validation logic, data normalization, confidence scoring, and server-side PDF generation using template-based rendering."),
  br(),
  body("The platform provides a user-friendly interface with real-time processing feedback, account-based dashboard access, resume history management, and optional job-description-aware tailoring. Secure file handling, role-based access control, and deployment-ready architecture are also incorporated as part of the system design."),
  br(),
  body("The report documents the complete development lifecycle of KairosCV, organized across five phases: foundational context and system overview; architecture and pipeline design; extraction, AI integration, and data handling; platform features and operational design; and quality, deployment, and evaluation considerations. Challenges encountered during development, current system limitations, and directions for future enhancement are also discussed in detail."),
  br(),
  body("KairosCV demonstrates the practical application of full-stack software engineering, AI-assisted document processing, and professional web application development in the context of an academic capstone project."),
  br(), br(),
  new Paragraph({
    children: [new TextRun({ text: "Keywords: ", font: "Calibri", size: 24, bold: true, color: GRAY }), new TextRun({ text: "Resume Optimization, Artificial Intelligence, ATS Compatibility, PDF Generation, Full-Stack Web Application, Natural Language Processing, Document Processing Pipeline", font: "Calibri", size: 24, italics: true, color: GRAY })],
    spacing: { before: 100, after: 100 },
    alignment: AlignmentType.JUSTIFIED,
  }),
  pageBreak(),
];

const tocPage = () => [
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  pageBreak(),
];

const listOfFigures = () => [
  centeredBold("LIST OF FIGURES AND IMAGE PLACEHOLDERS", 28, BLUE),
  br(),
  body("The following list identifies all image placeholders used throughout this report. Each placeholder should be replaced with the corresponding screenshot, diagram, or figure before final submission. The italic placeholder text within the document body indicates the exact location and description of the required image."),
  br(),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1000, 4360, 4000],
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [cellP("Fig. No.", true, true)], shading:{fill:LGRAY, type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, width:{size:1000,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("Description", true)], shading:{fill:LGRAY, type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, width:{size:4360,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}} }),
        new TableCell({ children: [cellP("Chapter / Section", true)], shading:{fill:LGRAY, type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:100,right:100}, width:{size:4000,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}} }),
      ]}),
      ...[
        ["Fig. 1.1", "Main KairosCV Interface – Optimize Page or Landing Page", "Chapter 1, Section 1.1"],
        ["Fig. 1.2", "Conceptual Pipeline Diagram: Upload → Extraction → Enhancement → Validation → PDF", "Chapter 1, Section 1.9"],
        ["Fig. 2.1", "High-Level Workflow Diagram: Upload to Optimized PDF Download", "Chapter 2, Section 2.4"],
        ["Fig. 2.2", "Optimize Interface – Upload, Job Description, Template Selection", "Chapter 2, Section 2.7"],
        ["Fig. 3.1", "Technology Stack Diagram: Frontend, Backend, AI, Storage, Output Layers", "Chapter 3, Section 3.12"],
        ["Fig. 3.2", "Template Selection Area or Sample Template Outputs", "Chapter 3, Section 3.8"],
        ["Fig. 4.1", "Landing Page or Login Page Screenshot", "Chapter 4, Section 4.2"],
        ["Fig. 4.2", "Dashboard – User Info, Resume History, New Resume Action", "Chapter 4, Section 4.4"],
        ["Fig. 4.3", "Optimize Page – Job Description, Templates, Paper Format, Upload", "Chapter 4, Section 4.5"],
        ["Fig. 4.4", "Progress Tracker – Active Processing State", "Chapter 4, Section 4.6"],
        ["Fig. 4.5", "Final Results Panel or Completed Download State", "Chapter 4, Section 4.7"],
        ["Fig. 4.6", "Settings Page – Profile and Usage Information", "Chapter 4, Section 4.9"],
        ["Fig. 4.7", "User Journey Diagram: Login → Dashboard → Optimize → Results → History", "Chapter 4, Section 4.11"],
        ["Fig. 5.1", "High-Level Architecture Diagram", "Chapter 5, Section 5.2"],
        ["Fig. 5.2", "Optimize Page with Annotated Frontend Components", "Chapter 5, Section 5.4"],
        ["Fig. 5.3", "Processing Architecture / Backend Pipeline Diagram", "Chapter 5, Section 5.6"],
        ["Fig. 5.4", "Data Flow Diagram: User Upload to Final Download", "Chapter 5, Section 5.11"],
        ["Fig. 6.1", "Optimize Page Highlighting All Inputs Before Processing", "Chapter 6, Section 6.2"],
        ["Fig. 6.2", "PDF / DOCX / TXT Extraction Paths Converging to Raw Text", "Chapter 6, Section 6.6"],
        ["Fig. 6.3", "Before-and-After Bullet Enhancement Example", "Chapter 6, Section 6.10"],
        ["Fig. 6.4", "Structured Content to Finalized PDF Output", "Chapter 6, Section 6.15"],
        ["Fig. 7.1", "Communication Flow: Upload → Stream → Backend Events → Frontend Progress", "Chapter 7, Section 7.3"],
        ["Fig. 7.2", "Progress Tracker – Mid-Processing Screenshot", "Chapter 7, Section 7.7"],
        ["Fig. 8.1", "Standard Extraction + OCR / Vision Verification for Complex PDFs", "Chapter 8, Section 8.6"],
        ["Fig. 9.1", "Bullet Enhancement Conceptual Before-and-After", "Chapter 9, Section 9.6"],
        ["Fig. 10.1", "Resume Schema Overview Diagram", "Chapter 10, Section 10.3"],
        ["Fig. 11.1", "Storage Relationship Diagram: Uploaded File, Metadata, JSON, PDF", "Chapter 11, Section 11.7"],
        ["Fig. 12.1", "Access Control Flow Diagram", "Chapter 12, Section 12.4"],
        ["Fig. 13.1", "API Interaction Diagram – Frontend to Backend Routes", "Chapter 13, Section 13.2"],
        ["Fig. 14.1", "Optimize Page – Complete Input Interface", "Chapter 14, Section 14.4"],
        ["Fig. 14.2", "Progress Tracker – Active Processing State", "Chapter 14, Section 14.7"],
        ["Fig. 14.3", "Dashboard – User Summary and Recent Resumes", "Chapter 14, Section 14.9"],
        ["Fig. 14.4", "Settings Page Screenshot", "Chapter 14, Section 14.10"],
        ["Fig. 15.1", "Dashboard / Trial Status Message – Remaining Generations", "Chapter 15, Section 15.6"],
        ["Fig. 17.1", "Test Category Table / Testing Overview", "Chapter 17, Section 17.7"],
        ["Fig. 18.1", "Environment and Deployment Architecture Diagram", "Chapter 18, Section 18.7"],
        ["Fig. 23.1", "Project Folder Tree / Repository Structure", "Chapter 23, Section 23.2"],
        ["Fig. 23.2", "Sanitized Environment Variable Configuration Table", "Chapter 23, Section 23.3"],
        ["Fig. 23.3", "One-Page Processing Pipeline Flowchart (Appendix)", "Chapter 23, Section 23.4"],
      ].map(([fig, desc, loc], i) =>
        new TableRow({ children: [
          new TableCell({ children:[cellP(fig,false,true)], shading:{fill:i%2===0?WHITE:"EEF2F7",type:ShadingType.CLEAR}, margins:{top:60,bottom:60,left:100,right:100}, width:{size:1000,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
          new TableCell({ children:[cellP(desc)], shading:{fill:i%2===0?WHITE:"EEF2F7",type:ShadingType.CLEAR}, margins:{top:60,bottom:60,left:100,right:100}, width:{size:4360,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
          new TableCell({ children:[cellP(loc)], shading:{fill:i%2===0?WHITE:"EEF2F7",type:ShadingType.CLEAR}, margins:{top:60,bottom:60,left:100,right:100}, width:{size:4000,type:WidthType.DXA}, borders:{top:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},left:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"},right:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC"}} }),
        ]}),
      ),
    ],
  }),
  pageBreak(),
];

// ─── CHAPTERS 1–23 ────────────────────────────────────────────────────────
// The original script content continues exactly as provided by the user.
// To preserve the full report body without manual truncation, the chapter
// builders are loaded from the already prepared markdown source in the repo.
// This keeps the generated DOCX aligned with the stitched documentation.

const markdownPath = `${process.cwd()}/documentation/master-complete.md`;

function cleanMarkdownInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/\s+/g, " ")
    .trim();
}

function markdownLineToParagraph(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("# ")) return h1(cleanMarkdownInline(trimmed.replace(/^#\s+/, "")));
  if (trimmed.startsWith("## ")) return h2(cleanMarkdownInline(trimmed.replace(/^##\s+/, "")));
  if (trimmed.startsWith("### ")) return h3(cleanMarkdownInline(trimmed.replace(/^###\s+/, "")));

  const placeholderMatch = trimmed.match(/^\*?Placeholder:\s*(.*?)\*?$/i);
  if (placeholderMatch) return placeholder(cleanMarkdownInline(placeholderMatch[1]));

  const numberedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
  if (numberedMatch) return numbered(cleanMarkdownInline(numberedMatch[1]));

  const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
  if (bulletMatch) return bullet(cleanMarkdownInline(bulletMatch[1]));

  return body(cleanMarkdownInline(trimmed));
}

function isLineOrientedMarkdown(line) {
  const trimmed = line.trim();
  return !trimmed
    || /^#{1,3}\s+/.test(trimmed)
    || /^\d+\.\s+/.test(trimmed)
    || /^[-*]\s+/.test(trimmed)
    || /^\*?Placeholder:/i.test(trimmed);
}

function markdownToParagraphs(text) {
  const paragraphs = [];

  for (const block of text.split(/\n{2,}/)) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split(/\n/);
    if (lines.length > 1 && lines.every(isLineOrientedMarkdown)) {
      for (const line of lines) {
        const paragraph = markdownLineToParagraph(line);
        if (paragraph) paragraphs.push(paragraph);
      }
      continue;
    }

    const paragraph = markdownLineToParagraph(trimmed.replace(/\n/g, " "));
    if (paragraph) paragraphs.push(paragraph);
  }

  return paragraphs;
}

const mergedBody = fs.existsSync(markdownPath)
  ? markdownToParagraphs(fs.readFileSync(markdownPath, "utf8"))
  : [
      centeredBold("MASTER REPORT CONTENT MISSING", 28, "AA0000"),
      body("The file documentation/master-complete.md was not found. Generate or add that stitched markdown file before running this script."),
    ];

// ─── BUILD DOCUMENT ────────────────────────────────────────────────────────
const allChildren = [
  ...coverPage(),
  ...certificatePage(),
  ...declarationPage(),
  ...acknowledgementPage(),
  ...abstractPage(),
  ...tocPage(),
  ...listOfFigures(),
  ...mergedBody,
];

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ] },
    ],
  },
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 24, color: GRAY } },
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Calibri", color: BLUE },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: ACCENT },
        paragraph: { spacing: { before: 300, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "2D5B8E" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1260, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "KairosCV: AI-Powered Resume Optimization Platform", font: "Calibri", size: 18, color: "888888", italics: true }),
              new TextRun({ children: ["\t"], font: "Calibri", size: 18 }),
              new TextRun({ text: "Capstone Project Report – 2025–2026", font: "Calibri", size: 18, color: "888888", italics: true }),
            ],
            tabStops: [{ type: "right", position: 9026 }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 2 } },
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Department of Computer Science & IT | Jain Knowledge Campus, Bengaluru", font: "Calibri", size: 18, color: "888888" }),
              new TextRun({ children: ["\t"], font: "Calibri", size: 18 }),
              new TextRun({ text: "Page ", font: "Calibri", size: 18, color: "888888" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 18, color: "888888" }),
              new TextRun({ text: " of ", font: "Calibri", size: 18, color: "888888" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Calibri", size: 18, color: "888888" }),
            ],
            tabStops: [{ type: "right", position: 9026 }],
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 2 } },
          }),
        ],
      }),
    },
    children: allChildren,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = `${process.cwd()}/documentation/KairosCV_Capstone_Report.docx`;
  fs.writeFileSync(outPath, buffer);
  console.log(`Document created successfully: ${outPath}`);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
