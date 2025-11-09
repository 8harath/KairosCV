import { useState } from 'react'
import { processResume, createPDFDownloadUrl } from './services/api'
import ResumePreview from './components/ResumePreview'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [enhancedData, setEnhancedData] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        setSelectedFile(null)
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    setEnhancedData(null)
    setDownloadUrl(null)

    try {
      const result = await processResume(selectedFile)
      setEnhancedData(result.data)

      // Convert base64 PDF to blob URL for download
      const blobUrl = createPDFDownloadUrl(result.pdfBase64, result.filename)
      setDownloadUrl(blobUrl)
    } catch (err) {
      console.error('Error processing resume:', err)
      setError(err.response?.data?.message || err.message || 'Failed to process resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // Revoke blob URL to free memory
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
    }

    setSelectedFile(null)
    setEnhancedData(null)
    setDownloadUrl(null)
    setError(null)
    // Reset file input
    const fileInput = document.getElementById('resume-upload')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Kai
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Resume Enhancement Tool
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Transform your resume into a professional masterpiece
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Upload Your Resume
              </h2>
              <p className="text-gray-600 mb-8">
                Upload your PDF resume and let AI enhance it for you
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-indigo-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  id="resume-upload"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-lg text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-sm text-gray-500 mt-2">
                    PDF files only (Max 5MB)
                  </span>
                </label>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading && (
                <div className="mt-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                  <p className="text-gray-600 mt-4">Processing your resume... This may take a moment.</p>
                </div>
              )}

              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedFile || loading}
                >
                  {loading ? 'Processing...' : 'Enhance Resume'}
                </button>
                {(selectedFile || enhancedData) && (
                  <button
                    onClick={handleReset}
                    className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>How it works:</p>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <span className="font-semibold">1.</span> Upload PDF
              </div>
              <div>
                <span className="font-semibold">2.</span> AI Enhancement
              </div>
              <div>
                <span className="font-semibold">3.</span> Download Result
              </div>
            </div>
          </div>

          {enhancedData && downloadUrl && (
            <ResumePreview data={enhancedData} downloadUrl={downloadUrl} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
