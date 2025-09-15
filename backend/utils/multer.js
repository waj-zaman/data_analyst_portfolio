import multer from "multer";

// Use memory storage so files can be sent directly to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs and images only
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"), false);
    }
  },
});

// Define fields for report, solution approach, and image
export const uploadDashboardFiles = upload.fields([
  { name: "report", maxCount: 1 },
  { name: "approach", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export default upload;
