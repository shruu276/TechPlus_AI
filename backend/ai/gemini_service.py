import os
import json
from typing import Optional, Dict, Any, List

def get_gemini_api_key(db_session=None) -> Optional[str]:
    # 1. Environment variable
    key = os.getenv("GEMINI_API_KEY") or os.getenv("AI_API_KEY")
    if key and key.strip():
        return key.strip()
    
    # 2. Database AppSettings check if available
    if db_session:
        try:
            from backend.database.models import AppSettings
            setting = db_session.query(AppSettings).filter(AppSettings.key == "gemini_api_key").first()
            if setting and setting.value and setting.value.strip():
                return setting.value.strip()
        except Exception:
            pass
    return None

def is_gemini_configured(db_session=None) -> bool:
    key = get_gemini_api_key(db_session)
    return bool(key and len(key) > 10)

def call_gemini_llm(prompt: str, system_instruction: str = "", api_key: Optional[str] = None) -> Optional[str]:
    """
    Calls Google Gemini using the official google-genai library.
    Falls back gracefully to None if key is absent or on network/API failure.
    """
    if not api_key:
        api_key = get_gemini_api_key()
    if not api_key:
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        # Try latest recommended models
        for model_name in ["gemini-2.5-flash", "gemini-1.5-flash"]:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={
                        "system_instruction": system_instruction,
                        "temperature": 0.3,
                        "max_output_tokens": 1000
                    }
                )
                if response and response.text:
                    return response.text.strip()
            except Exception:
                continue
    except Exception as e:
        print(f"[Gemini Service Warning]: {e}")
        return None

    return None
