import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";
    if (file.type === "application/pdf") {
      try {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } catch (pdfError: any) {
        console.error("PDF processing error:", pdfError);
        return NextResponse.json(
          { error: "Failed to parse PDF", details: pdfError.message },
          { status: 500 }
        );
      }
    }
    else if (file.type.includes("wordprocessingml")) {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } catch (docxError: any) {
        console.error("DOCX processing error:", docxError);
        return NextResponse.json(
          { error: "Failed to parse DOCX", details: docxError.message },
          { status: 500 }
        );
      }
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

  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to parse file", details: error.message },
      { status: 500 }
    );
  }
}

