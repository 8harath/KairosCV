import React from 'react';

export default function ResumePreview({ data, downloadUrl }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Enhanced Resume Preview</h2>
        <a
          href={downloadUrl}
          download
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Download PDF
        </a>
      </div>

      <div className="border-t pt-6">
        {/* Personal Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            {data.personalInfo?.name || 'No Name'}
          </h1>
          <div className="text-gray-600 text-sm">
            {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span> | {data.personalInfo.phone}</span>}
            {data.personalInfo?.location && <span> | {data.personalInfo.location}</span>}
          </div>
          {(data.personalInfo?.linkedin || data.personalInfo?.github) && (
            <div className="text-blue-600 text-sm mt-1">
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.github && (
                <>
                  {data.personalInfo.linkedin && ' | '}
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    GitHub
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-indigo-700 border-b-2 border-indigo-700 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-gray-700 text-justify">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-indigo-700 border-b-2 border-indigo-700 pb-1 mb-3">
              PROFESSIONAL EXPERIENCE
            </h3>
            {data.experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800">{exp.title} - {exp.company}</h4>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 text-sm mt-2 ml-4">
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-indigo-700 border-b-2 border-indigo-700 pb-1 mb-3">
              EDUCATION
            </h3>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <h4 className="font-bold text-gray-800">{edu.degree} - {edu.institution}</h4>
                <p className="text-sm text-gray-500">
                  {edu.year}{edu.gpa && ` | GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-indigo-700 border-b-2 border-indigo-700 pb-1 mb-3">
              SKILLS
            </h3>
            <div className="space-y-2">
              {data.skills.technical && data.skills.technical.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Technical: </span>
                  <span className="text-gray-700">{data.skills.technical.join(', ')}</span>
                </div>
              )}
              {data.skills.tools && data.skills.tools.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Tools & Technologies: </span>
                  <span className="text-gray-700">{data.skills.tools.join(', ')}</span>
                </div>
              )}
              {data.skills.soft && data.skills.soft.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Soft Skills: </span>
                  <span className="text-gray-700">{data.skills.soft.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-indigo-700 border-b-2 border-indigo-700 pb-1 mb-3">
              PROJECTS
            </h3>
            {data.projects.map((project, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold text-gray-800">{project.name}</h4>
                <p className="text-gray-700 text-sm">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Technologies: {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
