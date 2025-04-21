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
        bufferPages: true // Enable page buffering
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

      // Header
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .text('PUNE INSTITUTE OF COMPUTER TECHNOLOGY, PUNE - 411043', {
           align: 'center'
         });

      doc.moveDown(0.5);
      doc.fontSize(12)
         .text('Department of Electronics & Telecommunication Engineering', {
           align: 'center'
         });

      // Roll No Box (top right)
      doc.rect(430, 50, 100, 25).stroke();
      doc.fontSize(10)
         .text('Roll No.', 430, 40);
      doc.text('ABC ID', 430, 65);

      // Paper Details (two columns)
      doc.moveDown(2);
      
      // Left Column
      doc.font('Helvetica-Bold')
         .fontSize(11);
      
      doc.text('Class    : TE (E&TE)', 50, 120);
      doc.text(`Date     : ${new Date().toLocaleDateString()}`, 50, 140);
      doc.text(`Day      : ${new Date().toLocaleString('en-us', {weekday:'long'})}`, 50, 160);

      // Right Column
      doc.text('UNIT TEST - II', 300, 120);
      doc.text('Subject      : Cellular Network', 300, 140);
      doc.text('Time         : 11:45am-12:45pm', 300, 160);
      doc.text('Max. Marks : 30', 300, 180);

      // Instructions
      doc.moveDown(4);
      doc.font('Helvetica')
         .fontSize(10);

      const instructions = [
        'All questions are compulsory.',
        'Neat diagrams must be drawn wherever necessary.',
        'Figures to the right indicate full mark, Course outcomes, Blooms Taxonomy Levels',
        'Assume suitable data if necessary.'
      ];

      instructions.forEach(instruction => {
        doc.text('• ' + instruction);
        doc.moveDown(0.5);
      });

      // Course Outcomes Table
      doc.moveDown();
      doc.font('Helvetica-Bold')
         .fontSize(11);

      // Draw table
      const tableTop = doc.y;
      const tableLeft = 50;
      const tableRight = 550;
      const rowHeight = 20;

      // Table header
      doc.rect(tableLeft, tableTop, tableRight - tableLeft, rowHeight).stroke();
      doc.text('COs', tableLeft + 5, tableTop + 5);
      doc.text('Course Outcomes', tableLeft + 70, tableTop + 5);

      // Table content
      const contentStart = tableTop + rowHeight;
      doc.font('Helvetica')
         .fontSize(10);
      
      doc.rect(tableLeft, contentStart, tableRight - tableLeft, rowHeight * 2).stroke();
      doc.text('CO3', tableLeft + 5, contentStart + 5);
      doc.text('Investigate cell geometry of cellular mobile communication system; explain cell', 
               tableLeft + 70, contentStart + 5, {
                 width: 400,
                 align: 'left'
               });
      doc.text('structure, cellular network, frequency reuse, handoffs techniques, cluster, cell splitting.',
               tableLeft + 70, contentStart + 20, {
                 width: 400,
                 align: 'left'
               });

      // Questions
      doc.moveDown(2);
      doc.font('Helvetica-Bold')
         .fontSize(11);

      // Questions table header
      const qTableTop = doc.y;
      doc.rect(tableLeft, qTableTop, tableRight - tableLeft, rowHeight).stroke();
      doc.text('Q.No.', tableLeft + 5, qTableTop + 5);
      doc.text('Question', tableLeft + 70, qTableTop + 5);
      doc.text('Marks', tableRight - 100, qTableTop + 5);
      doc.text('CO', tableRight - 40, qTableTop + 5);

      // Add questions
      let currentY = qTableTop + rowHeight;
      doc.font('Helvetica')
         .fontSize(10);

      if (paperData.questions) {
        paperData.questions.forEach((q, index) => {
          const qHeight = 40;
          doc.rect(tableLeft, currentY, tableRight - tableLeft, qHeight).stroke();
          doc.text(`Q.${index + 1}`, tableLeft + 5, currentY + 5);
          doc.text(q.question, tableLeft + 70, currentY + 5, {
            width: 300,
            align: 'left'
          });
          doc.text(q.marks.toString(), tableRight - 100, currentY + 5);
          doc.text('CO3', tableRight - 40, currentY + 5);
          currentY += qHeight;
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

module.exports = {
  generateQuestionPaper
}; 