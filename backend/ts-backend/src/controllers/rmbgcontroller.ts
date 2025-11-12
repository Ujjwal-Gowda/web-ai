import { Request, Response } from "express";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

export const removeBackground = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Processing file:", file.originalname);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    console.log(formData);
    console.log("header", formData.getHeaders());
    const response = await fetch(
      "http://localhost:8000/rmbg/remove-bg-base64",
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Python backend error:", errorText);
      throw new Error(`Failed to process image: ${response.status}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      image: string;
      filename: string;
    };

    fs.unlinkSync(file.path);

    res.json(data);
  } catch (error) {
    console.error("Remove background error:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Failed to remove background",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
