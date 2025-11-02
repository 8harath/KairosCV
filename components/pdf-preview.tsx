interface PDFPreviewProps {
  pdfUrl: string | null
}

export default function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  if (!pdfUrl) return null

  return (
    <div className="card">
      <div className="mb-6 border-b-3 border-primary pb-4">
        <h2>Optimized Resume</h2>
      </div>

      <div className="pdf-preview">
        {pdfUrl.includes("placeholder") ? (
          <img src={pdfUrl || "/placeholder.svg"} alt="Preview" className="w-full h-auto" />
        ) : (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-96 md:h-[600px] border-3 border-primary"
            title="Optimized Resume PDF"
          />
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-4">✓ ATS Optimized • Enhanced Content • Professional Formatting</p>
    </div>
  )
}
