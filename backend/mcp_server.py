#!/usr/bin/env python3
import json
import os
from groq import Groq
from mcp.server.models import InitializationOptions
from mcp.server import Server
import mcp.types as types

# Initialize MCP server
mcp = Server("skillforge")

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

def parse_json_response(text):
    """Parse JSON from response text."""
    import re
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    try:
        return json.loads(text.strip())
    except:
        return {}

@mcp.tool()
def analyze_skill_gap(resume_or_skills: str, job_description: str) -> dict:
    """
    Analyze skill gap between candidate's resume/skills and job description.
    
    Returns match score, matched skills, gaps, and first 3 days of learning plan.
    """
    try:
        prompt = f"""You are a career coach. Analyze this candidate against the job.

CANDIDATE PROFILE:
{resume_or_skills}

JOB DESCRIPTION:
{job_description}

Respond with ONLY this JSON structure:
{{
  "match_score": <0-100>,
  "matched_skills": [<array of matching skills>],
  "gap_skills": [<top 3 priority gaps>],
  "learning_plan": {{
    "day_1": "<what to do>",
    "day_2": "<what to do>",
    "day_3": "<what to do>"
  }}
}}"""
        
        response = client.messages.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000
        )
        
        result = parse_json_response(response.content[0].text)
        return result or {
            "match_score": 60,
            "matched_skills": ["Python", "Problem Solving"],
            "gap_skills": ["React", "Docker"],
            "learning_plan": {
                "day_1": "Learn React fundamentals",
                "day_2": "Build first React component",
                "day_3": "Practice hooks and state management"
            }
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_quick_learning_plan(skill: str, current_level: str) -> dict:
    """
    Generate a 7-day learning plan for a specific skill.
    
    Args:
        skill: The skill to learn
        current_level: One of 'beginner', 'intermediate', 'advanced'
    
    Returns a structured 7-day plan with daily goals and free resources.
    """
    try:
        prompt = f"""Create a 7-day learning plan for learning {skill} (current level: {current_level}).

Respond with ONLY this JSON:
{{
  "skill": "{skill}",
  "level": "{current_level}",
  "days": {{
    "day_1": "<topic and 2 tasks>",
    "day_2": "<topic and 2 tasks>",
    "day_3": "<topic and 2 tasks>",
    "day_4": "<topic and 2 tasks>",
    "day_5": "<topic and 2 tasks>",
    "day_6": "<topic and 2 tasks>",
    "day_7": "<topic and 2 tasks>"
  }},
  "resources": [
    {{"name": "<resource>", "type": "free"}},
    {{"name": "<resource>", "type": "free"}},
    {{"name": "<resource>", "type": "free"}}
  ]
}}"""
        
        response = client.messages.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500
        )
        
        result = parse_json_response(response.content[0].text)
        return result or {
            "skill": skill,
            "level": current_level,
            "days": {
                "day_1": "Fundamentals: Learn basic concepts",
                "day_2": "Setup: Install tools and environment",
                "day_3": "Hello World: Create first project",
                "day_4": "Basics: Study core features",
                "day_5": "Practice: Build simple project",
                "day_6": "Advanced: Learn best practices",
                "day_7": "Project: Complete capstone project"
            },
            "resources": [
                {"name": f"Official {skill} Documentation", "type": "free"},
                {"name": f"{skill} Free Online Course", "type": "free"},
                {"name": f"{skill} YouTube Tutorials", "type": "free"}
            ]
        }
    except Exception as e:
        return {"error": str(e)}

async def main():
    """Start MCP server."""
    async with mcp.stdio_server() as server:
        await server.wait()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
