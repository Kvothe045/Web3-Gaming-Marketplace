import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

// Disable body parsing so that formidable can handle multipart data.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend the File interface to include the 'filepath' property
interface CustomFile extends File {
  filepath: string;
}

type Data = {
  url?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  form.parse(
    req,
    (err: any, fields: any, files: any) => {
      if (err) {
        console.error("Error parsing the files", err);
        return res.status(500).json({ error: "Error parsing the files" });
      }

      // Assuming the file input field is named 'file'
      const file = files.file as CustomFile | undefined;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Build the public URL for the uploaded file using the custom property
      const publicUrl = `/uploads/${path.basename(file.filepath)}`;
      return res.status(200).json({ url: publicUrl });
    }
  );
}
