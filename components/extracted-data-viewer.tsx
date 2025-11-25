"use client"

import { useState, useEffect } from "react"

interface ExtractedDataViewerProps {
  fileId: string | null
}

export default function ExtractedDataViewer({ fileId }: ExtractedDataViewerProps) {
  const [jsonData, setJsonData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!fileId) return

    const fetchJSON = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/json/${fileId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch extracted data")
        }

        const data = await response.json()
        setJsonData(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error"
        setError(errorMsg)
        console.error("Error fetching JSON:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJSON()
  }, [fileId])

  if (!fileId) return null

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-secondary border-2 border-primary">
        <p className="text-sm">Loading extracted data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-secondary border-2 border-destructive">
        <p className="text-sm text-destructive">
          Failed to load extracted data: {error}
        </p>
        <p className="text-xs mt-2 text-muted-foreground">
          Note: JSON data is only available after processing completes.
        </p>
      </div>
    )
  }

  if (!jsonData) return null

  return (
    <div className="mt-8 border-2 border-primary bg-secondary">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left font-bold flex justify-between items-center hover:bg-primary/10 transition-colors"
      >
        <span>📊 Extracted Resume Data (Developer View)</span>
        <span className="text-2xl">{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <div className="p-6 border-t-2 border-primary space-y-6">
          <div className="bg-background p-4 border border-primary/30 rounded">
            <h3 className="font-bold mb-3 text-primary">Contact Information</h3>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(jsonData.contact, null, 2)}
            </pre>
          </div>

          {jsonData.summary && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">Summary</h3>
              <p className="text-sm">{jsonData.summary}</p>
            </div>
          )}

          {jsonData.experience && jsonData.experience.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">
                Work Experience ({jsonData.experience.length} entries)
              </h3>
              <pre className="text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(jsonData.experience, null, 2)}
              </pre>
            </div>
          )}

          {jsonData.education && jsonData.education.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">
                Education ({jsonData.education.length} entries)
              </h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(jsonData.education, null, 2)}
              </pre>
            </div>
          )}

          {jsonData.skills && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">Skills</h3>
              <div className="space-y-2 text-sm">
                {jsonData.skills.languages?.length > 0 && (
                  <div>
                    <strong>Languages:</strong> {jsonData.skills.languages.join(", ")}
                  </div>
                )}
                {jsonData.skills.frameworks?.length > 0 && (
                  <div>
                    <strong>Frameworks:</strong> {jsonData.skills.frameworks.join(", ")}
                  </div>
                )}
                {jsonData.skills.tools?.length > 0 && (
                  <div>
                    <strong>Tools:</strong> {jsonData.skills.tools.join(", ")}
                  </div>
                )}
                {jsonData.skills.databases?.length > 0 && (
                  <div>
                    <strong>Databases:</strong> {jsonData.skills.databases.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {jsonData.projects && jsonData.projects.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">
                Projects ({jsonData.projects.length} entries)
              </h3>
              <pre className="text-xs overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(jsonData.projects, null, 2)}
              </pre>
            </div>
          )}

          {jsonData.certifications && jsonData.certifications.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">
                Certifications ({jsonData.certifications.length} entries)
              </h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(jsonData.certifications, null, 2)}
              </pre>
            </div>
          )}

          {/* Additional sections */}
          {jsonData.awards && jsonData.awards.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">Awards</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(jsonData.awards, null, 2)}
              </pre>
            </div>
          )}

          {jsonData.publications && jsonData.publications.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">Publications</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(jsonData.publications, null, 2)}
              </pre>
            </div>
          )}

          {jsonData.volunteer && jsonData.volunteer.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">Volunteer Work</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(jsonData.volunteer, null, 2)}
              </pre>
            </div>
          )}

          {jsonData.customSections && jsonData.customSections.length > 0 && (
            <div className="bg-background p-4 border border-primary/30 rounded">
              <h3 className="font-bold mb-3 text-primary">Custom Sections</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(jsonData.customSections, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-background p-4 border border-primary/30 rounded">
            <h3 className="font-bold mb-3 text-primary">Complete JSON</h3>
            <pre className="text-xs overflow-x-auto max-h-96 overflow-y-auto">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
                alert("JSON copied to clipboard!")
              }}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              Copy JSON
            </button>
            <a
              href={`/api/json/${fileId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-sm px-4 py-2"
            >
              View Raw JSON
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
