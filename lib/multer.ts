// lib/multer.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Define temporary upload directory
const uploadDir = path.join(process.cwd(), "public", "temp");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });
let total = 0;

groupedItems.forEach(item => {
  let quantityToCharge = item.quantity;
  if (item.name === "Apple") {
    const freeItems = Math.floor(item.quantity / 4);
    quantityToCharge -= freeItems;
  }
  total += quantityToCharge * item.price;
});

console.log("Total Price:", total.toFixed(2));
