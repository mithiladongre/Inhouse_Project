const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateQuestionPaper = async (paperData) => {
  return new Promise((resolve, reject) => {
    try {
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        bufferPages: true
      });

      // Set up the file path
      const filePath = path.join(tempDir, `question-paper-${Date.now()}.pdf`);
      const stream = fs.createWriteStream(filePath);

      // Handle stream errors
      stream.on('error', err => {
        console.error('Stream error:', err);
        reject(err);
      });

      // Pipe the PDF document to the write stream
      doc.pipe(stream);

      // Add title
      doc.fontSize(20)
         .text('Question Paper', { align: 'center' })
         .moveDown(2);

      // Add paper type
      doc.fontSize(16)
         .text(`Type: ${paperData.type.charAt(0).toUpperCase() + paperData.type.slice(1)}`)
         .moveDown();

      // Add questions
      doc.fontSize(12);

      if (paperData.type === 'subjective' || paperData.type === 'both') {
        const questions = paperData.type === 'both' ? paperData.subjective : paperData.questions;
        doc.text('Subjective Questions:')
           .moveDown();

        questions.forEach((q, index) => {
          doc.text(`Q${index + 1}. ${q.question} (${q.marks} marks)`)
             .moveDown();
        });
      }

      if (paperData.type === 'objective' || paperData.type === 'both') {
        const questions = paperData.type === 'both' ? paperData.objective : paperData.questions;
        doc.text('Objective Questions:')
           .moveDown();

        questions.forEach((q, index) => {
          doc.text(`Q${index + 1}. ${q.question}`)
             .moveDown(0.5);
          
          q.options.forEach((option, optIndex) => {
            doc.text(`${String.fromCharCode(97 + optIndex)}. ${option}`)
               .moveDown(0.2);
          });
          
          doc.text(`Correct Answer: ${q.correctAnswer}`)
             .moveDown();
        });
      }

      // Finalize the PDF
      doc.end();

      // Wait for the stream to finish before resolving
      stream.on('finish', () => {
        resolve(filePath);
      });

    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
};

module.exports = { generateQuestionPaper }; 