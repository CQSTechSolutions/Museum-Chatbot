const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateTicketPDF = async (ticketDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Format the visit date
      const visitDate = new Date(ticketDetails.visitDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generate QR code with proper data
      const qrCodeData = JSON.stringify({
        ticketType: ticketDetails.type,
        orderId: ticketDetails.orderId,
        email: ticketDetails.email,
        ageRange: ticketDetails.ageRange,
        visitDate: visitDate,
        numberOfTickets: ticketDetails.numberOfTickets,
        status: ticketDetails.status
      });

      // Generate QR code as data URL
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 150
      });

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
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
      doc.rect(40, 40, doc.page.width - 80, 80)
         .fill('#3B82F6');

      // Add museum logo or header
      doc.fillColor('white')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('National Museum of Art & History', 40, 60, {
           align: 'center',
           width: doc.page.width - 80
         });

      // Add ticket title
      doc.fontSize(18)
         .text('Entry Ticket', 40, 90, {
           align: 'center',
           width: doc.page.width - 80
         });

      // Add white background for ticket details
      doc.rect(40, 140, doc.page.width - 80, 400)
         .fill('white')
         .stroke('#e5e7eb');

      let yPos = 160;

      // Add ticket details
      const sections = [
        {
          title: 'Visitor Information',
          items: [
            { label: 'Email:', value: ticketDetails.email }
          ]
        },
        {
          title: 'Ticket Details',
          items: [
            { label: 'Ticket Type:', value: ticketDetails.type },
            { label: 'Number of Tickets:', value: ticketDetails.numberOfTickets },
            { label: 'Price:', value: `₹${ticketDetails.price}` },
            { 
              label: 'Age Category:', 
              value: ticketDetails.ageRange,
              description: ticketDetails.ageDescription 
            },
            { label: 'Visit Date:', value: visitDate }
          ]
        },
        {
          title: 'Payment Information',
          items: [
            { label: 'Order ID:', value: ticketDetails.orderId },
            { label: 'Payment ID:', value: ticketDetails.paymentId },
            { 
              label: 'Purchase Date:', 
              value: new Date(ticketDetails.purchaseDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }
          ]
        }
      ];

      // Render sections
      sections.forEach(section => {
        doc.font('Helvetica-Bold')
           .fontSize(14)
           .fillColor('#1f2937')
           .text(section.title, 60, yPos);
        
        yPos += 20;

        section.items.forEach(item => {
          doc.font('Helvetica-Bold')
             .fontSize(11)
             .text(item.label, 60, yPos)
             .font('Helvetica')
             .text(item.value, 180, yPos);

          if (item.description) {
            yPos += 15;
            doc.fontSize(10)
               .fillColor('#666666')
               .text(item.description, 180, yPos);
            yPos += 5;
          }

          yPos += 20;
        });

        yPos += 10;
      });

      // Add QR code section
      doc.image(qrCodeImage, 60, yPos, {
        width: 80,
        height: 80
      });

      doc.fontSize(11)
         .fillColor('#1f2937')
         .text('Scan this QR Code at Entry', 150, yPos + 20)
         .fontSize(10)
         .fillColor('#666666')
         .text('This QR code contains your ticket information', 150, yPos + 35);

      // Add important notes
      yPos += 100;
      doc.fontSize(12)
         .fillColor('#1f2937')
         .text('Important Notes:', 60, yPos);

      const notes = [
        '• Please arrive 15 minutes before your scheduled time',
        '• This ticket is non-transferable',
        '• Photography is allowed in designated areas only',
        '• Please follow museum guidelines and staff instructions'
      ];

      yPos += 20;
      notes.forEach(note => {
        doc.fontSize(10)
           .text(note, 60, yPos);
        yPos += 15;
      });

      // Add footer
      doc.moveTo(40, doc.page.height - 60)
         .lineTo(doc.page.width - 40, doc.page.height - 60)
         .stroke('#e5e7eb');

      doc.fontSize(9)
         .fillColor('#4b5563')
         .text('National Museum of Art & History', 40, doc.page.height - 40, {
           align: 'center',
           width: doc.page.width - 80
         })
         .text('123 Museum Avenue, Art District • +1 (555) 123-4567 • info@museum.com', {
           align: 'center',
           width: doc.page.width - 80
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF }; 