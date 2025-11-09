import express from 'express';
import upload from '../middleware/upload.js';
import { processResume, downloadResume } from '../controllers/resumeController.js';

const router = express.Router();

// POST /api/resume/process - Upload and process resume
router.post('/process', upload.single('resume'), processResume);

// GET /api/download/:filename - Download generated resume
router.get('/download/:filename', downloadResume);

export default router;
