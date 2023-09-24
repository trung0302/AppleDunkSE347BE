import HoaDon from "../models/hoadon.js";
import PDFDocument from 'pdfkit'
export const ExportHoaDon = (req, res) => {
    const doc = new PDFDocument();

    
    res.setHeader('Content-Disposition', 'attachment; filename="exported.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    
    doc.pipe(res);

    
    doc.font('Helvetica-Bold').fontSize(24).text('Hello, World!', 100, 100);

    
    doc.end();

}