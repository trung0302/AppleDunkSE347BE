import Products from "../models/product.js";
import multer from "multer";
import ExcelJS from 'exceljs';
import XLSX from 'xlsx';
import fs from 'fs';
import HoaDon from "../models/hoadon.js";
// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

export const ImportProductExcel = async (req, res) => {
	try {
		await upload.single('file')(req, res, async (error) => {
			if (error) {
				throw new Error('Error occurred while uploading the file');
			}
			const products = [];
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.readFile(req.file.path);
			const worksheet = workbook.getWorksheet(1);
			const rowCount = worksheet.rowCount;
			console.log("Successful");
			console.log(rowCount);
			for(let i = 1; i <= rowCount; i++) {
				var rowProduct = new Products();
				rowProduct.tensanpham = worksheet.getRow(i).getCell(1).value
				rowProduct.loaisanpham = worksheet.getRow(i).getCell(2).value;
				rowProduct.masp = worksheet.getRow(i).getCell(3).value;
				rowProduct.hinh = worksheet.getRow(i).getCell(4).value;
				rowProduct.gia = worksheet.getRow(i).getCell(5).value;
				rowProduct.rom = worksheet.getRow(i).getCell(6).value;
				rowProduct.mausac = worksheet.getRow(i).getCell(7).value;
				rowProduct.ram = worksheet.getRow(i).getCell(8).value;
				rowProduct.chip = worksheet.getRow(i).getCell(9).value;
				rowProduct.baomat = worksheet.getRow(i).getCell(10).value;
				rowProduct.chongnuoc = worksheet.getRow(i).getCell(11).value;
				rowProduct.sac = worksheet.getRow(i).getCell(12).value;
				rowProduct.dophangiai = worksheet.getRow(i).getCell(13).value;
				rowProduct.kichthuoc = worksheet.getRow(i).getCell(14).value;
				rowProduct.camera = worksheet.getRow(i).getCell(15).value;
				rowProduct.khoiluong = worksheet.getRow(i).getCell(16).value;
				rowProduct.hedieuhanh = worksheet.getRow(i).getCell(17).value;
				rowProduct.nguongoc = worksheet.getRow(i).getCell(18).value;
				rowProduct.chatlieu = worksheet.getRow(i).getCell(19).value;
				rowProduct.kichthuocmanhinh = worksheet.getRow(i).getCell(20).value;
				rowProduct.loaiphukien = worksheet.getRow(i).getCell(21).value;
				rowProduct.congnghe = worksheet.getRow(i).getCell(22).value;
				rowProduct.congsuat = worksheet.getRow(i).getCell(23).value;
				rowProduct.baohanh = worksheet.getRow(i).getCell(24).value;
				products.push(rowProduct);
				console.log(rowProduct);
				await rowProduct.save();
			}
			res.status(201).send(products)   			
		});
	}
	catch (error) {
		res.status(400).send(error)
	}
}
export const ExportProductExcel = async(req,res) => {
	try {
		const listProducts = await Products.find();
		
		
		const workbook = new ExcelJS.Workbook();
    	const worksheet = workbook.addWorksheet('Products');
		worksheet.columns = [
			{ header: 'ID', key: 'id', width: 10 },
			{ header: 'Ten San Pham', key: 'tensanpham', width: 20 },
			{ header: 'Loai San Pham', key: 'loaisanpham', width: 15 },
			{ header: 'Ma San Pham', key: 'masp', width: 15 },
			{ header: 'Hinh', key: 'hinh', width: 15 },
			{ header: 'Gia', key: 'gia', width: 15 },
			{ header: 'Rom', key: 'rom', width: 15 },
			{ header: 'Mau Sac', key: 'mausac', width: 15 },
			{ header: 'Ram', key: 'ram', width: 15 },
			{ header: 'Chip', key: 'chip', width: 15 },
			{ header: 'Bao Mat', key: 'baomat', width: 15 },
			{ header: 'Chong nuoc', key: 'chongnuoc', width: 15 },
			{ header: 'Sac', key: 'sac', width: 15 },
			{ header: 'Do Phan Giai', key: 'dophangiai', width: 15 },
			{ header: 'Kich Thuoc', key: 'kichthuoc', width: 15 },
			{ header: 'Camera', key: 'camera', width: 15 },
			{ header: 'Khoi Luong', key: 'khoiluong', width: 15 },
			{ header: 'He Dieu Hanh', key: 'hedieuhanh', width: 15 },
			{ header: 'Nguon Goc', key: 'nguongoc', width: 15 },
			{ header: 'Chat Lieu', key: 'chatlieu', width: 15 },
			{ header: 'Kich Thuoc Man Hinh', key: 'kichthuocmanhinh', width: 15 },
			{ header: 'Loai Phu Kien', key: 'loaiphukien', width: 15 },
			{ header: 'Cong Nghe', key: 'congnghe', width: 15 },
			{ header: 'Cong Suat', key: 'congsuat', width: 15 },
			{ header: 'Bao Hanh', key: 'baohanh', width: 15 },

			// Add more columns as needed
		];
		listProducts.forEach((product) => {
			worksheet.addRow({
				id: product._id,
				tensanpham: product.tensanpham,
				loaisanpham: product.loaisanpham,
				masp: product.masp,
				hinh: product.hinh,
				gia: product.gia,
				rom: product.rom,
				mausac: product.mausac,
				ram: product.ram,
				chip: product.chip,
				baomat: product.baomat,
				chongnuoc: product.chongnuoc,
				sac: product.sac,
				dophangiai: product.dophangiai,
				kichthuoc: product.kichthuoc,
				camera: product.camera,
				khoiluong: product.khoiluong,
				hedieuhanh: product.hedieuhanh,
				nguongoc: product.nguongoc,
				chatlieu: product.chatlieu,
				kichthuocmanhinh: product.kichthuocmanhinh,
				loaiphukien: product.loaiphukien,
				congnghe: product.congnghe,
				congsuat: product.congsuat,
				baohanh: product.baohanh,

			})
		});

			// Add more fields as needed;
		const filePath = 'products.xlsx';
		await workbook.xlsx.writeFile(filePath);


		const fileStream = fs.createReadStream(filePath);
    	fileStream.pipe(res);

   		fileStream.on('end', () => {
      	fs.unlinkSync(filePath);
    });
		
	}
	catch(error) {
		res.status(400).send(error);
	}
}
export const ExportInvoiceExcel = async(req,res) => {
	try {
		const listInvoices = await HoaDon.find();
		
		
		const workbook = new ExcelJS.Workbook();
    	const worksheet = workbook.addWorksheet('Invoices');
		worksheet.columns = [
			{ header: 'ID', key: 'id', width: 10 },
			{ header: 'Ma Hoa Don', key: 'mahd', width: 20 },
			{ header: 'Ma Khach Hang', key: 'makh', width: 15 },
			{ header: 'Ma Nhan Vien', key: 'manv', width: 15 },
			{ header: 'Ngay Xuat Hoa Don', key: 'ngayxuathd', width: 15 },
			{ header: 'Tinh Trang', key: 'tinhtrang', width: 15 },
			{ header: 'Tri Gia', key: 'trigia', width: 15 },
			{ header: 'Dia Chi Giao Hang', key: 'diachigiaohang', width: 15 },
			{ header: 'Phuong Thuc Thanh Toan', key: 'phuongthucthanhtoan', width: 15 },
			
			// Add more columns as needed
		];
		listInvoices.forEach((invoice) => {
			worksheet.addRow({
				id: invoice._id,
				mahd: invoice.mahd,
				makh: invoice.makh,
				ngayxuathd: invoice.ngayxuathd,
				tinhtrang: invoice.tinhtrang,
				trigia: invoice.trigia,
				diachigiaohang: invoice.diachigiaohang,
				phuongthucthanhtoan: invoice.phuongthucthanhtoan,

			})
		});

			// Add more fields as needed;
		const filePath = 'invoices.xlsx';
		await workbook.xlsx.writeFile(filePath);


		const fileStream = fs.createReadStream(filePath);
    	fileStream.pipe(res);

   		fileStream.on('end', () => {
      	fs.unlinkSync(filePath);
    });
		
	}
	catch(error) {
		res.status(400).send(error);
	}
}
export const ExportPromotionExcel = async(req,res) => {
	try {
		const listInvoices = await HoaDon.find();
		
		
		const workbook = new ExcelJS.Workbook();
    	const worksheet = workbook.addWorksheet('Invoices');
		worksheet.columns = [
			{ header: 'ID', key: 'id', width: 10 },
			{ header: 'Ap Dung', key: 'apdung', width: 20 },
			{ header: 'Phan Tram Khuyen Mai', key: 'phantramkm', width: 15 },
			{ header: 'Bat Dau', key: 'batdau', width: 15 },
			{ header: 'Ket Thuc', key: 'ketthuc', width: 15 },
			{ header: 'Title', key: 'title', width: 15 },
			{ header: 'Mo Ta', key: 'description', width: 15 },
			{ header: 'Loai', key: 'category', width: 15 },
			
			// Add more columns as needed
		];
		listInvoices.forEach((invoice) => {
			worksheet.addRow({
				id: invoice._id,
				apdung: invoice.apdung,
				phantramkm: invoice.phantramkm,
				batdau: invoice.batdau,
				ketthuc: invoice.ketthuc,
				title: invoice.title,
				description: invoice.description,
				category: invoice.category,

			})
		});

			// Add more fields as needed;
		const filePath = 'invoices.xlsx';
		await workbook.xlsx.writeFile(filePath);


		const fileStream = fs.createReadStream(filePath);
    	fileStream.pipe(res);

   		fileStream.on('end', () => {
      	fs.unlinkSync(filePath);
    });
		
	}
	catch(error) {
		res.status(400).send(error);
	}
}
// export const ExportEmployeeExcel = async(req,res) => {
// 	try {
// 		const listProducts = await Products;
// 		const workbook = new ExcelJS.Workbook();
//   		const worksheet = workbook.addWorksheet('List Product');
// 		const headers = ['Name', 'Email', 'Age'];
// 		worksheet.addRow(headers);
		
// 		  // Add data rows
// 		listProducts.forEach((row) => {
// 			const values = Object.values(row);
// 			worksheet.addRow(values);
// 		});
// 		res.setHeader(
// 			'Content-Type',
// 			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// 		  );
// 		res.setHeader(
// 			'Content-Disposition',
// 			'attachment; filename=' + 'data.xlsx'
// 		  );
		
// 		  // Send the workbook as a response
// 		  workbook.xlsx.write(res).then(() => {
// 			res.end();
// 		})
// 	}
// 	catch(error) {
// 		res.status(400).send(error);
// 	}
// }
// export const ExportPromotionExcel = async(req,res) => {
// 	try {
// 		const listProducts = await Products;
// 		const workbook = new ExcelJS.Workbook();
//   		const worksheet = workbook.addWorksheet('List Product');
// 		const headers = ['Name', 'Email', 'Age'];
// 		worksheet.addRow(headers);
		
// 		  // Add data rows
// 		listProducts.forEach((row) => {
// 			const values = Object.values(row);
// 			worksheet.addRow(values);
// 		});
// 		res.setHeader(
// 			'Content-Type',
// 			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// 		  );
// 		res.setHeader(
// 			'Content-Disposition',
// 			'attachment; filename=' + 'data.xlsx'
// 		  );
		
// 		  // Send the workbook as a response
// 		  workbook.xlsx.write(res).then(() => {
// 			res.end();
// 		})
// 	}
// 	catch(error) {
// 		res.status(400).send(error);
// 	}
// }
// export const ExportCustomerExcel = async(req,res) => {
// 	try {
// 		const listProducts = await Products;
// 		const workbook = new ExcelJS.Workbook();
//   		const worksheet = workbook.addWorksheet('List Product');
// 		const headers = ['Name', 'Email', 'Age'];
// 		worksheet.addRow(headers);
		
// 		  // Add data rows
// 		listProducts.forEach((row) => {
// 			const values = Object.values(row);
// 			worksheet.addRow(values);
// 		});
// 		res.setHeader(
// 			'Content-Type',
// 			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// 		  );
// 		res.setHeader(
// 			'Content-Disposition',
// 			'attachment; filename=' + 'data.xlsx'
// 		  );
		
// 		  // Send the workbook as a response
// 		  workbook.xlsx.write(res).then(() => {
// 			res.end();
// 		})
// 	}
// 	catch(error) {
// 		res.status(400).send(error);
// 	}
// }
// export const ExportOrderExcel = async(req,res) => {
// 	try {
// 		const listProducts = await Products;
// 		const workbook = new ExcelJS.Workbook();
//   		const worksheet = workbook.addWorksheet('List Product');
// 		const headers = ['Name', 'Email', 'Age'];
// 		worksheet.addRow(headers);
		
// 		  // Add data rows
// 		listProducts.forEach((row) => {
// 			const values = Object.values(row);
// 			worksheet.addRow(values);
// 		});
// 		res.setHeader(
// 			'Content-Type',
// 			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// 		  );
// 		res.setHeader(
// 			'Content-Disposition',
// 			'attachment; filename=' + 'data.xlsx'
// 		  );
		
// 		  // Send the workbook as a response
// 		  workbook.xlsx.write(res).then(() => {
// 			res.end();
// 		})
// 	}
// 	catch(error) {
// 		res.status(400).send(error);
// 	}
// }


