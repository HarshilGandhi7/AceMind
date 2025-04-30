declare module 'pdf-parse' {
    import { Buffer } from 'buffer';

    interface PDFParseOptions {
        max: number;
        pagerender: (data: any) => string;
        disableCombineTextItems: boolean;
    }

    interface PDFParseResult {
        numpages: number;
        numrender: number;
        info: any;
        metadata: any;
        text: string;
    }

    function pdfParse(buffer: Buffer, options?: PDFParseOptions): Promise<PDFParseResult>;

    export = pdfParse;
}