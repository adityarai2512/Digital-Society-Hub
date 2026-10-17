import multer from "multer";
import path from "path";
import fs from "fs";

// ============================================
// UPLOAD MIDDLEWARE (Multer)
// Ye file image uploads handle karta hai — Complaint photos
// aur ab Product photos (Marketplace module) dono ke liye.
// Har type ki file apne alag folder me save hoti hai taaki
// organize rahe — jaise /uploads/complaints/ aur /uploads/products/
// ============================================

// Ek helper function — kisi bhi folder ke liye multer uploader bana deta hai.
// Isse code duplicate nahi karna padta har naye upload type ke liye.
const makeUploader = (folderName) => {
  const uploadDir = `uploads/${folderName}`;

  // Agar folder exist nahi karta, to pehli baar use hote hi bana do
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Unique filename banate hain taaki 2 alag uploads overwrite na karein
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

  // Sirf image files allow karo (security ke liye — koi .exe waghera upload na kar sake)
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Sirf image files allowed hain (jpg, png, etc)."), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  });
};

// Complaint photos ke liye (default export — purane complaintRoutes.js isi ko use karta hai)
const upload = makeUploader("complaints");

// Product photos ke liye (Marketplace module — named export)
export const uploadProduct = makeUploader("products");

export default upload;
