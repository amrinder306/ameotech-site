# backend/app/reasoning/router.py

"""
ARE-3.x Router
Maps (state + intent + context + tone) → ActionObject
This is the engine's reply brain.
"""

from typing import Dict
from .templates import ActionObject


def route_message(state: str, intent: str, confidence: float, session, analysis: Dict) -> ActionObject:
    tone = analysis.get("tone")
    msg_type = analysis.get("message_type")
    is_rejection = analysis.get("is_rejection")
    clean = (analysis.get("clean") or "").lower()
    topic_hint = analysis.get("topic_hint")

    # 1. Hard escalation: contact_human
    if state == "contact_human":
        return ActionObject(
            action="escalate_human",
            bot_reply=(
                "I can connect you with someone from Ameotech. "
                "Would you prefer to send a short note or book a quick call?"
            ),
            action_payload={"link": "mailto:hello@ameotech.com"},
        )

    if state == "handoff_ready":
        return ActionObject(
            action="escalate_human",
            bot_reply=(
                "This looks easier to handle in a direct conversation. "
                "I can connect you with someone from the engineering team."
            ),
            action_payload={"link": "mailto:hello@ameotech.com"},
        )

    # 2. Careers flow
    if state == "careers":
        # If user is confused, annoyed, or rejecting, don't just repeat careers text.
        if msg_type in ("confused", "meta", "insult") or is_rejection:
            return ActionObject(
                action="show_options",
                bot_reply=(
                    "I can help with jobs at Ameotech, or with projects and existing systems.\n"
                    "Which of these fits better with what you need right now?"
                ),
                action_payload={
                    "options": [
                        {"id": "careers", "label": "Careers / jobs"},
                        {"id": "new_project", "label": "Start a new project"},
                        {"id": "existing_system", "label": "Fix an existing system"},
                    ]
                },
            )

        return ActionObject(
            action="show_message",
            bot_reply=(
                "You can explore open roles on the Careers page. "
                "If you don’t see a match, you can still share your profile."
            ),
            action_payload={"link": "/careers"},
        )

    # 3. New project flow
    if state == "new_project":
        # Recognise explicit rejection of tools/steps
        if is_rejection:
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "No problem. Tell me a little about what you want to build. "
                    "A one-line description of the idea or main workflow is enough."
                ),
                action_payload={},
            )

        # Cost / budget / price / estimate → suggest estimator
        cost_markers = [
            "budget", "how much", "cost", "price", "pricing",
            "estimate", "rough idea", "ballpark", "money",
        ]
        if any(m in clean for m in cost_markers):
            return ActionObject(
                action="open_lab_tool",
                bot_reply=(
                    "We can sketch a budget band, timeline and delivery model "
                    "based on a few quick questions. "
                    "Do you want to run the Build Estimator?"
                ),
                action_payload={"lab_tool": "build_estimator"},
            )

        # Tech markers → give tech guidance instead of looping
        tech_markers = [
            ".net", "dotnet", "react", "vite", "typescript", "javascript",
            "node", "next.js", "nextjs", "django", "python", "stack",
            "frontend", "front-end", "backend", "back-end",
        ]
        if any(m in clean for m in tech_markers):
            return ActionObject(
                action="show_message",
                bot_reply=(
                    ".NET for the backend and React with Vite on the frontend is a solid setup for modern web/SaaS products.\n\n"
                    "A typical structure we use is:\n"
                    "- .NET 8 Web API for the backend\n"
                    "- PostgreSQL or SQL Server as the main database\n"
                    "- React + Vite + TypeScript for the frontend\n"
                    "- Tailwind CSS for UI components\n\n"
                    "We can fine-tune this once we know more about scale, integrations and any AI features you have in mind."
                ),
                action_payload={},
            )

        # Trust / legitimacy questions → answer directly
        trust_words = ["trust", "scam", "fraud", "legit", "real company", "you guys real"]
        if msg_type == "trust" or any(w in clean for w in trust_words):
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "Ameotech focuses on applied AI engineering, pricing engines, forecasting, "
                    "data platforms and automation for SaaS, retail, fintech and enterprise teams.\n\n"
                    "We usually start with a small, scoped engagement like a discovery sprint or pilot "
                    "so you can evaluate us on real delivery before committing to anything larger. "
                    "You can also review case studies on the site to see examples of previous work."
                ),
                action_payload={"link": "/case-studies"},
            )

        # Light teasing / meta comments → gently steer back
        if msg_type in ("meta", "insult") and not any(m in clean for m in cost_markers):
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "I may miss some of the nuance here, but I can help with new projects, "
                    "existing systems, pricing engines and data platforms.\n\n"
                    "For your project, we can talk through the idea, the tech stack, and then "
                    "rough timelines and budget if you’d like."
                ),
                action_payload={},
            )

        # Stage-based behaviour for new project
        stage = getattr(session, "new_project_stage", "intro")

        if stage == "intro":
            # First time we know it's a project: ask about idea
            session.new_project_stage = "idea"
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "Great — we can help with new builds. "
                    "What’s the idea or the main workflow you’re thinking about?"
                ),
                action_payload={},
            )

        if stage == "idea":
            # Treat the current message as the idea; move to shaping.
            session.new_project_stage = "shaping"
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "Got it. For the first version, what matters most for you right now — "
                    "getting the tech stack right, hitting a specific timeline, or staying within a budget range?"
                ),
                action_payload={},
            )

        # shaping stage or anything beyond → keep it practical
        # Avoid repeating the exact same line endlessly
        if session.last_action == "show_message":
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "We can either stay high-level here or move into something concrete like a "
                    "rough budget range and timeline. Which would you prefer?"
                ),
                action_payload={},
            )

        return ActionObject(
            action="show_message",
            bot_reply=(
                "If you share your rough timelines and budget range, "
                "we can suggest how to structure the engagement and what to build first."
            ),
            action_payload={},
        )

    # 4. Existing system flow
    if state == "existing_system":
        if is_rejection:
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "Alright — just tell me what’s happening with the current system. "
                    "Is it bugs, performance issues, missing features, or something else?"
                ),
                action_payload={},
            )

        if not session.goal:
            return ActionObject(
                action="show_message",
                bot_reply=(
                    "We often help teams fix, stabilise or extend existing systems. "
                    "What seems to be the main issue right now?"
                ),
                action_payload={},
            )

        return ActionObject(
            action="show_message",
            bot_reply=(
                "Got it. A short description of the stack or the main bottleneck "
                "will help us point you to next steps."
            ),
            action_payload={},
        )

    # 5. Pricing engine flow
    if state == "pricing_engine":
        return ActionObject(
            action="show_message",
            bot_reply=(
                "We build pricing engines, elasticity models and demand forecasters "
                "for teams with large SKU catalogs or complex pricing rules. "
                "What pricing challenge are you facing?"
            ),
            action_payload={},
        )

    # 6. Data platform flow
    if state == "data_platform":
        return ActionObject(
            action="show_message",
            bot_reply=(
                "We help teams with data engineering, ETL pipelines, warehouses "
                "and analytics platforms. "
                "What kind of data problem are you looking to solve?"
            ),
            action_payload={},
        )

    # 7. Unknown → clarifiers (multi-step) using topic_hint
    if state == "unknown":
        loops = session.clarifier_loops

        # If we have a topic hint, use a targeted clarifier first
        if topic_hint == "project_like" and loops <= 2:
            return ActionObject(
                action="show_options",
                bot_reply=(
                    "It sounds like you want to talk about a project.\n"
                    "Are you looking to start a new project with us, fix an existing system, "
                    "or is this more about roles and jobs?"
                ),
                action_payload={
                    "options": [
                        {"id": "new_project", "label": "Start a new project"},
                        {"id": "existing_system", "label": "Fix an existing system"},
                        {"id": "careers", "label": "Careers / jobs"},
                    ]
                },
            )

        if topic_hint == "existing_like" and loops <= 2:
            return ActionObject(
                action="show_options",
                bot_reply=(
                    "It sounds like this might be about an existing system or website.\n"
                    "Do you mainly want to stabilise or fix an existing system, start something new, "
                    "or talk about roles and jobs?"
                ),
                action_payload={
                    "options": [
                        {"id": "existing_system", "label": "Fix an existing system"},
                        {"id": "new_project", "label": "Start a new project"},
                        {"id": "careers", "label": "Careers / jobs"},
                    ]
                },
            )

        if topic_hint == "careers_like" and loops <= 2:
            return ActionObject(
                action="show_options",
                bot_reply=(
                    "It sounds like you might be asking about roles or jobs at Ameotech.\n"
                    "Is this mainly about careers, or are you looking to discuss a project or an existing system?"
                ),
                action_payload={
                    "options": [
                        {"id": "careers", "label": "Careers / jobs"},
                        {"id": "new_project", "label": "Start a new project"},
                        {"id": "existing_system", "label": "Fix an existing system"},
                    ]
                },
            )

        # Generic clarifiers when we have no hint or we've already tried hint-based ones
        if loops <= 1:
            return ActionObject(
                action="show_options",
                bot_reply=(
                    "To point you in the right direction — are you looking to:\n"
                    "- start a new project,\n"
                    "- fix an existing system,\n"
                    "- explore careers,\n"
                    "or something else related to Ameotech?"
                ),
                action_payload={
                    "options": [
                        {"id": "new_project", "label": "Start a new project"},
                        {"id": "existing_system", "label": "Fix an existing system"},
                        {"id": "careers", "label": "Careers / jobs"},
                        {"id": "contact", "label": "Talk to someone"},
                    ]
                },
            )

        if loops == 2:
            return ActionObject(
                action="show_options",
                bot_reply=(
                    "Got it — just to avoid guessing:\n"
                    "Is this mainly about a project, an existing system, or jobs?"
                ),
                action_payload={
                    "options": [
                        {"id": "new_project", "label": "Project"},
                        {"id": "existing_system", "label": "Existing system"},
                        {"id": "careers", "label": "Jobs"},
                    ]
                },
            )

        # 3rd+ time: escalate
        return ActionObject(
            action="escalate_human",
            bot_reply=(
                "Let me connect you with someone directly — "
                "they can understand the situation faster."
            ),
            action_payload={"link": "mailto:hello@ameotech.com"},
        )

    # 8. Safety fallback
    return ActionObject(
        action="show_message",
        bot_reply=(
            "I can help with new projects, existing systems, pricing, data platforms or careers at Ameotech."
        ),
        action_payload={},
    )
