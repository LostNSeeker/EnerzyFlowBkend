import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  console.log("file.mimetype", file.mimetype);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and PDF are allowed."),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

export const saveFile = async (file) => {
  try {
    const imageData = JSON.parse(file);
    const base64Data = imageData.uri.split(",")[1];
    const mimeType = imageData.uri.match(/data:(.*);base64/)[1];
    const fileExtension = mimeType.split("/")[1];
    const fileName = `profile_${Date.now()}.${fileExtension}`;
    const filePath = path.join("uploads", fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
    return {
      uri: filePath,
      name: imageData.name,
      mimeType: mimeType,
      size: imageData.size,
    };
  } catch (error) {
    throw new Error("Failed to save file");
  }
};
