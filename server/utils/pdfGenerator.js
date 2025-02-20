const PDFDocument = require('pdfkit');

const generateTicketPDF = (ticketDetails) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add museum logo or header
      doc.fontSize(25)
         .text('National Museum of Art & History', { align: 'center' });

      doc.moveDown();
      doc.fontSize(20)
         .text('Entry Ticket', { align: 'center' });

      doc.moveDown();
      doc.fontSize(12);

      // Add ticket details
      doc.text(`Ticket Type: ${ticketDetails.type}`);
      doc.text(`Price: ₹${ticketDetails.price}`);
      doc.text(`Valid for: ${ticketDetails.ageRange}`);
      doc.text(`Purchase Date: ${new Date().toLocaleDateString()}`);

      // Add QR code or barcode here if needed
      
      doc.moveDown();
      doc.fontSize(10)
         .text('This ticket is non-transferable and must be presented at entry', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF }; 