declare module 'pdf-text-extract' {
    function pdfTextExtract(
      buffer: Buffer,
      callback: (err: Error | null, pages?: string[]) => void
    ): void;
    export = pdfTextExtract;
  }