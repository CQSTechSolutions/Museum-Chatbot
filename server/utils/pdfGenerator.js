const PDFDocument = require('pdfkit');

const generateTicketPDF = (ticketDetails) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: 'Museum Entry Ticket',
          Author: 'National Museum of Art & History'
        }
      });

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add background color
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fill('#f8f9fa');

      // Add header with gradient
      doc.rect(50, 50, doc.page.width - 100, 100)
         .fill('#3B82F6');

      // Add museum logo or header
      doc.fillColor('white')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('National Museum of Art & History', 50, 80, {
           align: 'center',
           width: doc.page.width - 100
         });

      // Add ticket title
      doc.fontSize(20)
         .text('Entry Ticket', 50, 120, {
           align: 'center',
           width: doc.page.width - 100
         });

      // Add white background for ticket details
      doc.rect(50, 180, doc.page.width - 100, 300)
         .fill('white')
         .stroke('#e5e7eb');

      // Add ticket details
      doc.fillColor('#1f2937')
         .fontSize(14)
         .font('Helvetica')
         .text('Ticket Details:', 70, 200);

      const details = [
        { label: 'Ticket Type:', value: ticketDetails.type },
        { label: 'Price:', value: `₹${ticketDetails.price}` },
        { label: 'Valid for:', value: ticketDetails.ageRange },
        { label: 'Order ID:', value: ticketDetails.orderId },
        { label: 'Purchase Date:', value: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      ];

      let yPos = 230;
      details.forEach(detail => {
        doc.font('Helvetica-Bold')
           .text(detail.label, 70, yPos)
           .font('Helvetica')
           .text(detail.value, 200, yPos);
        yPos += 30;
      });

      // Add QR code placeholder
      doc.rect(70, yPos + 20, 100, 100)
         .stroke('#e5e7eb');
      doc.fontSize(12)
         .text('Scan QR Code at Entry', 70, yPos + 130);

      // Add important notes
      doc.fontSize(12)
         .fillColor('#4b5563')
         .text('Important Notes:', 70, yPos + 160);

      const notes = [
        '• Please arrive 15 minutes before your scheduled time',
        '• This ticket is non-transferable',
        '• Photography is allowed in designated areas only',
        '• Please follow museum guidelines and staff instructions'
      ];

      notes.forEach((note, index) => {
        doc.text(note, 70, yPos + 180 + (index * 20));
      });

      // Add footer
      doc.fontSize(10)
         .text('National Museum of Art & History', 50, doc.page.height - 50, {
           align: 'center',
           width: doc.page.width - 100
         })
         .text('123 Museum Avenue, Art District • +1 (555) 123-4567 • info@museum.com', {
           align: 'center',
           width: doc.page.width - 100
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF }; 