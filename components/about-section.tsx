"use client"

export default function AboutSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass dark:glass-dark p-12 rounded-3xl">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Built by Students, For Everyone
          </h2>

          <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              We're a team of undergraduate engineers who believe the hiring process is broken. Why should career
              opportunities depend on formatting skills? Why should technical brilliance go unnoticed because someone
              doesn't know proper kerning or margin spacing?
            </p>

            <p>
              At KairosCV, we're challenging the status quo. Talent shouldn't be judged by keywords and document
              design—it should be measured by knowledge, problem-solving ability, and real-world impact. We built this
              tool so that every developer, data scientist, and creative mind can showcase their abilities without
              worrying about resume templates.
            </p>

            <p>
              Whether you're a coding prodigy with zero design sense or a problem-solver who never learned LaTeX,
              KairosCV levels the playing field. Because your skills deserve to be seen.
            </p>
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
              Join Us in Redefining Resumes
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
