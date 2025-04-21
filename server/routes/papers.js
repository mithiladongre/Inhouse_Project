const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { generateQuestionPaper } = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Save paper
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, type, questions } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert paper
      const [paperResult] = await connection.execute(
        'INSERT INTO papers (user_id, title, type) VALUES (?, ?, ?)',
        [req.userId, title, type]
      );
      const paperId = paperResult.insertId;

      if (type === 'subjective' || type === 'both') {
        // Insert subjective questions
        for (const question of questions.subjective || []) {
          await connection.execute(
            'INSERT INTO subjective_questions (paper_id, question, marks) VALUES (?, ?, ?)',
            [paperId, question.question, question.marks]
          );
        }
      }

      if (type === 'objective' || type === 'both') {
        // Insert objective questions
        for (const question of questions.objective || []) {
          const [questionResult] = await connection.execute(
            'INSERT INTO objective_questions (paper_id, question, correct_answer) VALUES (?, ?, ?)',
            [paperId, question.question, question.correctAnswer]
          );
          const questionId = questionResult.insertId;

          // Insert options
          for (const option of question.options) {
            await connection.execute(
              'INSERT INTO options (question_id, option_text) VALUES (?, ?)',
              [questionId, option]
            );
          }
        }
      }

      await connection.commit();
      res.status(201).json({ message: 'Paper saved successfully', paperId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving paper' });
  }
});

// Get user's papers
router.get('/', verifyToken, async (req, res) => {
  try {
    const [papers] = await pool.execute(
      'SELECT * FROM papers WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching papers' });
  }
});

// Get paper details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const paperId = req.params.id;
    const [papers] = await pool.execute(
      'SELECT * FROM papers WHERE id = ? AND user_id = ?',
      [paperId, req.userId]
    );

    if (papers.length === 0) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    const paper = papers[0];
    let result = { ...paper };

    if (paper.type === 'subjective' || paper.type === 'both') {
      const [subjectiveQuestions] = await pool.execute(
        'SELECT * FROM subjective_questions WHERE paper_id = ?',
        [paperId]
      );
      result.subjective = subjectiveQuestions;
    }

    if (paper.type === 'objective' || paper.type === 'both') {
      const [objectiveQuestions] = await pool.execute(
        'SELECT * FROM objective_questions WHERE paper_id = ?',
        [paperId]
      );
      
      for (let question of objectiveQuestions) {
        const [options] = await pool.execute(
          'SELECT * FROM options WHERE question_id = ?',
          [question.id]
        );
        question.options = options.map(opt => opt.option_text);
      }
      
      result.objective = objectiveQuestions;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching paper details' });
  }
});

// Delete paper
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const paperId = req.params.id;
    await pool.execute(
      'DELETE FROM papers WHERE id = ? AND user_id = ?',
      [paperId, req.userId]
    );
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting paper' });
  }
});

// Download paper as PDF
router.get('/:id/download', async (req, res) => {
  let pdfPath = null;
  
  try {
    const paperId = req.params.id;
    
    // Get paper data
    let paperData = {
      type: 'subjective',
      questions: [
        {
          question: "Draw and explain GSM architecture and explain function of each block.",
          marks: 5
        },
        {
          question: "What is handoff? What are different types of handoff? Explain any one.",
          marks: 5
        },
        {
          question: "Write a brief note on Cell geometry in mobile communication.",
          marks: 5
        }
      ]
    };

    // Generate PDF
    pdfPath = await generateQuestionPaper(paperData);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file not found after generation');
    }

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=question_paper.pdf`);

    // Send file
    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);

    // Clean up after sending
    stream.on('end', () => {
      fs.unlink(pdfPath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });

  } catch (error) {
    console.error('Error in download route:', error);
    
    // Clean up if file exists
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.error('Error cleaning up:', err);
      }
    }

    res.status(500).json({ 
      message: 'Failed to generate PDF',
      error: error.message 
    });
  }
});

// Preview paper as PDF
router.get('/:id/preview', async (req, res) => {
  let pdfPath = null;
  
  try {
    const paperId = req.params.id;
    
    // Get paper data (using sample data for now)
    let paperData = {
      type: 'subjective',
      questions: [
        {
          question: "Draw and explain GSM architecture and explain function of each block.",
          marks: 5
        },
        {
          question: "What is handoff? What are different types of handoff? Explain any one.",
          marks: 5
        },
        {
          question: "Write a brief note on Cell geometry in mobile communication.",
          marks: 5
        }
      ]
    };

    // Generate PDF
    pdfPath = await generateQuestionPaper(paperData);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file not found after generation');
    }

    // Get file stats
    const stat = fs.statSync(pdfPath);

    // Set headers for inline display (preview)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', 'inline; filename=preview.pdf');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create read stream with proper error handling
    const stream = fs.createReadStream(pdfPath);
    
    // Handle stream errors
    stream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          message: 'Failed to stream PDF',
          error: err.message 
        });
      }
      
      // Clean up
      if (pdfPath && fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      stream.destroy();
      if (pdfPath && fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });

    // Pipe the stream to response with proper error handling
    stream.pipe(res).on('error', (err) => {
      console.error('Pipe error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          message: 'Failed to stream PDF',
          error: err.message 
        });
      }
    });

    // Clean up after sending
    stream.on('end', () => {
      if (pdfPath && fs.existsSync(pdfPath)) {
        fs.unlink(pdfPath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      }
    });

  } catch (error) {
    console.error('Error in preview route:', error);
    
    // Clean up if file exists
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.error('Error cleaning up:', err);
      }
    }

    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Failed to generate PDF preview',
        error: error.message 
      });
    }
  }
});

module.exports = router; 