#!/usr/bin/env python3
"""
Render a resume LaTeX file from structured JSON using a Jinja2 template.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

from jinja2 import Environment, FileSystemLoader, StrictUndefined


def latex_escape(value: Any) -> str:
    if value is None:
        return ""
    text = str(value)
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def _to_string(value: Any) -> str:
    return str(value).strip() if value is not None else ""


def _to_string_list(value: Any) -> List[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str) and value.strip():
        parts = [part.strip() for part in value.replace("\n", ",").split(",")]
        return [part for part in parts if part]
    return []


def normalize_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    data = {
        "name": _to_string(payload.get("name")),
        "phone": _to_string(payload.get("phone")),
        "email": _to_string(payload.get("email")),
        "github": _to_string(payload.get("github")),
        "education": [],
        "skills": {
            "languages": [],
            "libraries": [],
            "databases": [],
            "tools": [],
        },
        "projects": [],
        "certifications": [],
        "achievements": _to_string_list(payload.get("achievements")),
        "extracurriculars": _to_string_list(payload.get("extracurriculars")),
    }

    for edu in payload.get("education", []) if isinstance(payload.get("education"), list) else []:
        if not isinstance(edu, dict):
            continue
        institution = _to_string(edu.get("institution"))
        if not institution:
            continue
        data["education"].append(
            {
                "degree": _to_string(edu.get("degree")),
                "institution": institution,
                "location": _to_string(edu.get("location")),
                "duration": _to_string(edu.get("duration")),
                "cgpa": _to_string(edu.get("cgpa")),
                "coursework": _to_string_list(edu.get("coursework")),
            }
        )

    skills = payload.get("skills", {})
    if isinstance(skills, dict):
        data["skills"] = {
            "languages": _to_string_list(skills.get("languages")),
            "libraries": _to_string_list(skills.get("libraries")),
            "databases": _to_string_list(skills.get("databases")),
            "tools": _to_string_list(skills.get("tools")),
        }

    for project in payload.get("projects", []) if isinstance(payload.get("projects"), list) else []:
        if not isinstance(project, dict):
            continue
        title = _to_string(project.get("title"))
        if not title:
            continue
        data["projects"].append(
            {
                "title": title,
                "tech_stack": _to_string_list(project.get("tech_stack")),
                "bullets": _to_string_list(project.get("bullets")),
            }
        )

    for cert in payload.get("certifications", []) if isinstance(payload.get("certifications"), list) else []:
        if not isinstance(cert, dict):
            continue
        name = _to_string(cert.get("name"))
        if not name:
            continue
        data["certifications"].append(
            {
                "name": name,
                "issuer": _to_string(cert.get("issuer")),
                "year": _to_string(cert.get("year")),
            }
        )

    return data


def render_template(template_path: Path, context: Dict[str, Any]) -> str:
    env = Environment(
        loader=FileSystemLoader(str(template_path.parent)),
        autoescape=False,
        trim_blocks=True,
        lstrip_blocks=True,
        comment_start_string="/*",
        comment_end_string="*/",
        undefined=StrictUndefined,
    )
    env.filters["latex_escape"] = latex_escape
    template = env.get_template(template_path.name)
    return template.render(**context)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render resume LaTeX from JSON")
    parser.add_argument("--input-json", required=True, help="Path to structured JSON input")
    parser.add_argument("--template", required=True, help="Path to Jinja2 LaTeX template")
    parser.add_argument("--output-tex", required=True, help="Path to write rendered .tex")
    args = parser.parse_args()

    input_json = Path(args.input_json)
    template_path = Path(args.template)
    output_tex = Path(args.output_tex)

    payload = json.loads(input_json.read_text(encoding="utf-8-sig"))
    context = normalize_payload(payload)
    rendered = render_template(template_path, context)

    output_tex.parent.mkdir(parents=True, exist_ok=True)
    output_tex.write_text(rendered, encoding="utf-8")
    print(str(output_tex))


if __name__ == "__main__":
    main()
