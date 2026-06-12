import os
import json
import re
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from PyPDF2 import PdfReader
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

def strip_markdown_fences(text):
    """Remove markdown code fences from text."""
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    return text.strip()

def parse_analysis_response(response_text):
    """Parse JSON response from Groq API."""
    cleaned_text = strip_markdown_fences(response_text)
    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        # Fallback mock response if parsing fails
        return {
            "match_score": 50,
            "matched_skills": ["Python", "Problem Solving"],
            "required_skills": ["Python", "React", "AWS", "Docker", "Problem Solving"],
            "skill_gaps": ["React", "AWS", "Docker"],
            "learning_plan": [
                {
                    "week": 1,
                    "focus": "React Fundamentals",
                    "tasks": [
                        "Learn React hooks and component lifecycle",
                        "Build simple components",
                        "Understand JSX syntax"
                    ]
                },
                {
                    "week": 2,
                    "focus": "Docker Basics",
                    "tasks": [
                        "Learn Docker containerization",
                        "Create Dockerfile",
                        "Deploy container"
                    ]
                },
                {
                    "week": 3,
                    "focus": "AWS Fundamentals",
                    "tasks": [
                        "Learn AWS core services (EC2, S3, RDS)",
                        "Set up AWS account",
                        "Deploy simple application"
                    ]
                },
                {
                    "week": 4,
                    "focus": "Integration Project",
                    "tasks": [
                        "Build full-stack application",
                        "Deploy to AWS",
                        "Document learning"
                    ]
                }
            ]
        }

def extract_text_from_pdf(file_stream):
    """Extract text from PDF file."""
    try:
        pdf_reader = PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def fetch_github_skills(github_username: str) -> list:
    """Fetch GitHub user's repositories and extract programming languages used."""
    try:
        # Clean up username
        username = github_username.replace("https://github.com/", "").replace("http://github.com/", "").strip()
        if not username:
            return []
        
        # Fetch user repositories
        repos_url = f"https://api.github.com/users/{username}/repos?per_page=30"
        repos_response = requests.get(repos_url, timeout=10)
        repos_response.raise_for_status()
        repos = repos_response.json()
        
        if not isinstance(repos, list):
            return []
        
        # Aggregate language data
        language_bytes = {}
        for repo in repos:
            if repo.get('languages_url'):
                try:
                    langs_response = requests.get(repo['languages_url'], timeout=5)
                    langs_response.raise_for_status()
                    langs = langs_response.json()
                    if isinstance(langs, dict):
                        for lang, bytes_count in langs.items():
                            language_bytes[lang] = language_bytes.get(lang, 0) + bytes_count
                except Exception:
                    continue
        
        # Sort by usage and return top 15
        sorted_langs = sorted(language_bytes.items(), key=lambda x: x[1], reverse=True)
        top_skills = [lang for lang, _ in sorted_langs[:15]]
        return top_skills if top_skills else []
    except requests.exceptions.RequestException:
        return []
    except Exception:
        return []

def generate_mock_analysis(resume_text="", github_skills=None, job_description=""):
    """Generate a realistic mock analysis response."""
    if github_skills is None:
        github_skills = []
    
    base_skills = ["Python", "JavaScript", "Problem Solving", "Communication"]
    all_skills = list(set(base_skills + github_skills))
    
    return {
        "match_score": 60,
        "matched_skills": all_skills[:8] if len(all_skills) >= 8 else all_skills,
        "required_skills": ["Python", "React", "SQL", "Docker", "AWS", "Git", "REST APIs", "Problem Solving"],
        "skill_gaps": ["React", "SQL", "Docker"],
        "learning_plan": [
            {
                "week": 1,
                "focus": "React Fundamentals",
                "tasks": ["Learn React hooks", "Build components", "Understand JSX"]
            },
            {
                "week": 2,
                "focus": "SQL & Databases",
                "tasks": ["Learn SQL basics", "Set up database", "Write queries"]
            },
            {
                "week": 3,
                "focus": "Docker & Deployment",
                "tasks": ["Learn Docker", "Containerize app", "Deploy"]
            },
            {
                "week": 4,
                "focus": "Integration & Project",
                "tasks": ["Build full-stack", "Deploy to cloud", "Document"]
            }
        ]
    }

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "model": "llama-3.3-70b-versatile"
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze skill gap between resume and job description."""
    try:
        data = request.form if request.form else request.get_json()
        
        # Extract inputs
        resume_text = data.get('resume_text', '') or ''
        github_username = data.get('github_username', '') or ''
        job_description = data.get('job_description', '') or ''
        
        # Handle file upload
        if 'resume_file' in request.files:
            file = request.files['resume_file']
            if file.filename.endswith('.pdf'):
                pdf_stream = BytesIO(file.read())
                resume_text = extract_text_from_pdf(pdf_stream)
            else:
                resume_text = file.read().decode('utf-8')
        
        # Fetch GitHub skills if provided
        github_skills = []
        if github_username and len(github_username) >= 3:
            github_skills = fetch_github_skills(github_username)
        
        # Validation
        if not resume_text and not github_skills:
            return jsonify({"error": "Please provide resume text, PDF, or GitHub profile"}), 400
        
        if not job_description:
            return jsonify({"error": "Job description is required"}), 400
        
        # Combine inputs for prompt
        input_text = f"""Resume/Skills: {resume_text or ', '.join(github_skills)}
        
Job Description: {job_description}"""
        
        # Try to get analysis from Groq, fall back to mock if API key missing
        if not os.getenv("GROQ_API_KEY"):
            analysis = generate_mock_analysis(resume_text, github_skills, job_description)
        else:
            try:
                prompt = f"""You are a career coach AI. Analyze the candidate's resume and GitHub skills against the job description. 
                
{input_text}

Provide a JSON response with this exact structure:
{{
  "match_score": <0-100>,
  "matched_skills": [<skills they have that are needed>],
  "required_skills": [<all skills required for the job>],
  "skill_gaps": [<top gaps>],
  "learning_plan": [
    {{
      "week": 1,
      "focus": "<skill focus>",
      "tasks": ["<task1>", "<task2>", "<task3>"]
    }},
    {{
      "week": 2,
      "focus": "<skill focus>",
      "tasks": ["<task1>", "<task2>", "<task3>"]
    }},
    {{
      "week": 3,
      "focus": "<skill focus>",
      "tasks": ["<task1>", "<task2>", "<task3>"]
    }},
    {{
      "week": 4,
      "focus": "<skill focus>",
      "tasks": ["<task1>", "<task2>", "<task3>"]
    }}
  ]
}}

Respond with ONLY valid JSON, no markdown or extra text."""
                
                response = client.messages.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=3000
                )
                
                response_text = response.content[0].text
                analysis = parse_analysis_response(response_text)
            except Exception as e:
                print(f"Groq API error: {e}")
                analysis = generate_mock_analysis(resume_text, github_skills, job_description)
        
        # Transform response to match frontend expectations
        transformed = {
            "match_score": analysis.get("match_score", 0),
            "resume_skills": analysis.get("matched_skills", []),
            "required_skills": analysis.get("required_skills", []),
            "matched_skills": analysis.get("matched_skills", []),
            "gap_skills": [
                {
                    "skill": gap,
                    "priority": "high" if i < 2 else "medium" if i < 4 else "low",
                    "reason": f"Required for the role but not in your current skill set"
                }
                for i, gap in enumerate(analysis.get("skill_gaps", []))
            ],
            "learning_plan": [
                {
                    "week": plan.get("week", i+1),
                    "title": plan.get("focus", ""),
                    "skills": plan.get("tasks", []),
                    "tasks": [
                        {
                            "day_range": f"Day {(i*2)+1}-{(i*2)+2}",
                            "task": task,
                            "resource": "Online course",
                            "resource_url": "https://learn.example.com",
                            "type": "course"
                        }
                        for i, task in enumerate(plan.get("tasks", [])[:3])
                    ]
                }
                for i, plan in enumerate(analysis.get("learning_plan", []))
            ],
            "summary": f"Your skills match {analysis.get('match_score', 0)}% of the job requirements. Focus on: {', '.join(analysis.get('skill_gaps', [])[:3])}"
        }
        
        return jsonify(transformed)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/plan', methods=['POST'])
def get_learning_plan():
    """Get detailed learning plan for a specific skill."""
    try:
        data = request.get_json()
        skill = data.get('skill', '')
        current_level = data.get('current_level', 'beginner')
        
        if not skill:
            return jsonify({"error": "Skill is required"}), 400
        
        if not os.getenv("GROQ_API_KEY"):
            return jsonify({
                "skill": skill,
                "level": current_level,
                "week": 1,
                "focus": f"Learn {skill}",
                "tasks": [f"Study {skill} basics", f"Practice {skill}"],
                "resources": [
                    {"title": "Free Course", "url": "https://learn.example.com"},
                    {"title": "Documentation", "url": "https://docs.example.com"}
                ]
            })
        
        prompt = f"""Create a 7-day learning plan for {skill}. Current level: {current_level}.

Respond with a JSON plan for week 1 only:
{{
  "week": 1,
  "focus": "<main focus>",
  "tasks": ["<day 1>", "<day 2>", ... "<day 7>"],
  "resources": [
    {{"title": "<resource>", "url": "<url>"}},
    ...
  ]
}}

Respond with ONLY valid JSON."""
        
        response = client.messages.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000
        )
        
        response_text = response.content[0].text
        plan = parse_analysis_response(response_text)
        return jsonify(plan)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
