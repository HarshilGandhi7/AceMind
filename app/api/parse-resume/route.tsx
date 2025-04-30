import { NextResponse } from "next/server";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import pdfTextExtract from "pdf-text-extract";
import mammoth from "mammoth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";

    if (file.type === "application/pdf") {
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `${uuidv4()}.pdf`);
      
      try {
        // Write buffer to temp file
        await fs.writeFile(tempFilePath, buffer);
        
        // Now use pdfTextExtract with the file path
        text = await new Promise((resolve, reject) => {
          pdfTextExtract(tempFilePath as any, (err:any, pages:any) => {
            if (err) return reject(err);
            resolve(pages.join("\n"));
          });
        });
        
        // Clean up temp file
        await fs.unlink(tempFilePath);
      } catch (pdfError) {
        console.error("PDF processing error:", pdfError);
        throw pdfError;
      }
    }
    else if (file.type.includes("wordprocessingml")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }
    else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      text: text.trim() 
    });

  } catch (error:any) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to parse file", details: error.message },
      { status: 500 }
    );
  }
}