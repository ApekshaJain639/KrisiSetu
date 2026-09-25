import json
import asyncio
from typing import AsyncGenerator
from app.core.config import settings
from app.services.agent_tools import execute_tool

class KisanMitraCopilot:
    async def chat_stream(self, query: str, language: str = "kn") -> AsyncGenerator[str, None]:
        """
        Emits Server-Sent Events (SSE) detailing the 'Glass-Box' reasoning steps,
        tool executions, and vernacular final response.
        """
        yield f"data: {json.dumps({'type': 'thought', 'content': f'Analyzing farmer query: \"{query}\" in language: {language}'})}\n\n"
        await asyncio.sleep(0.3)

        q_lower = query.lower()

        # Route dynamically based on user intent
        if "grow" in q_lower or "crop" in q_lower or "ಬೆಳೆ" in q_lower or "soil" in q_lower:
            yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'recommend_crops', 'args': {'nitrogen': 100, 'phosphorus': 40, 'potassium': 140, 'ph': 5.8, 'soil_texture': 'Laterite'}})}\n\n"
            await asyncio.sleep(0.4)
            result = await execute_tool("recommend_crops", {"nitrogen": 100, "phosphorus": 40, "potassium": 140, "ph": 5.8, "soil_texture": "Laterite"})
            obs = f"Top crop: {result[0]['crop_name']} (Score: {result[0]['suitability_score']}%) with intercrop {result[0]['companion_crops'][0]}"
            yield f"data: {json.dumps({'type': 'observation', 'result': obs})}\n\n"
            await asyncio.sleep(0.3)
            
            final_text = (
                "ನಿಮ್ಮ ಜಮೀನಿಗೆ ಅಡಿಕೆ ಮತ್ತು ಕರಿಮೆಣಸು ಮಿಶ್ರಬೆಳೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ (ಸೂಕ್ತತೆ: 94.2%). "
                "ನಿಮಗೆ 1 ಎಕರೆಗೆ 3.8 ಚೀಲ ಯೂರಿಯಾ, 1.7 ಚೀಲ DAP ಮತ್ತು 4.6 ಚೀಲ MOP ರಸಗೊಬ್ಬರ ಬೇಕಾಗುತ್ತದೆ."
                if language == "kn" else
                "Arecanut intercropped with Black Pepper is the top recommended crop for your laterite soil (Suitability: 94.2%). "
                "For 1 acre, you will require 3.8 bags of Urea, 1.7 bags of DAP, and 4.6 bags of MOP."
            )

        elif "sell" in q_lower or "mandi" in q_lower or "market" in q_lower or "ಬೆಲೆ" in q_lower or "ಮಾರುಕಟ್ಟೆ" in q_lower:
            yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'calculate_mandi_arbitrage', 'args': {'crop': 'Arecanut', 'quantity_quintals': 25.0}})}\n\n"
            await asyncio.sleep(0.4)
            result = await execute_tool("calculate_mandi_arbitrage", {"crop": "Arecanut", "quantity_quintals": 25.0})
            obs = f"Best Mandi: {result['recommended_mandi']} with net bonus profit of ₹{result['net_bonus_profit']}"
            yield f"data: {json.dumps({'type': 'observation', 'result': obs})}\n\n"
            await asyncio.sleep(0.3)
            
            final_text = (
                f"ಸ್ಥಳೀಯ ಪುತ್ತೂರು ಮಂಡಿಗಿಂತ ಶಿವಮೊಗ್ಗ APMC ಯಲ್ಲಿ ಅಡಿಕೆ ಬೆಲೆ ₹4,200 ಹೆಚ್ಚಿದೆ. "
                f"ಸಾರಿಗೆ ವೆಚ್ಚ ಕಳೆದು ನಿಮಗೆ ₹{result['net_bonus_profit']} ಹೆಚ್ಚುವರಿ ನಿವ್ವಳ ಲಾಭ ದೊರೆಯುತ್ತದೆ. CAMPCO ಜಂಟಿ ವಾಹನ ಲಭ್ಯವಿದೆ!"
                if language == "kn" else
                f"Shivamogga APMC price is ₹4,200/qtl higher than local Puttur. "
                f"After transport deductions, you earn a net bonus of ₹{result['net_bonus_profit']}. Collective CAMPCO pooling available!"
            )

        elif "disease" in q_lower or "koleroga" in q_lower or "ರೋಗ" in q_lower or "ಕೊಳೆರೋಗ" in q_lower:
            yield f"data: {json.dumps({'type': 'tool_call', 'tool': 'diagnose_crop_disease', 'args': {'symptoms': 'Arecanut fruit rot'}})}\n\n"
            await asyncio.sleep(0.4)
            result = await execute_tool("diagnose_crop_disease", {"symptoms": "Arecanut fruit rot"})
            obs = f"Diagnosed: {result['detected_disease']} (Confidence: {result['confidence_pct']}%)"
            yield f"data: {json.dumps({'type': 'observation', 'result': obs})}\n\n"
            await asyncio.sleep(0.3)
            
            final_text = (
                "ಇದು ಅಡಿಕೆ ಕೊಳೆರೋಗ (ಫ್ರೂಟ್ ರಾಟ್). "
                "ತಕ್ಷಣ 1% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಿಸಿ ಅಥವಾ 'ಕೊಟ್ಟೆ ಕಟ್ಟುವ' ಪದ್ಧತಿಯನ್ನು ಅನುಸರಿಸಿ. 4 ದಿನಗಳ ನಂತರ ಮತ್ತೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
                if language == "kn" else
                "Diagnosed as Arecanut Koleroga (Fruit Rot). "
                "Immediately spray 1% Bordeaux mixture or tie traditional dried sheaths (Kotte Kattuva). Please re-upload in 4 days to track recovery."
            )

        else:
            yield f"data: {json.dumps({'type': 'thought', 'content': 'Providing general platform capability guidance'})}\n\n"
            final_text = (
                "ನಮಸ್ಕಾರ, ನಾನು ಕಿಸಾನ್ ಮಿತ್ರ! ನಾನು ಬೆಳೆ ಶಿಫಾರಸು, ಬೀಜ ಖರೀದಿ, ಕೊಳೆರೋಗ ಪತ್ತೆ ಮತ್ತು ಮಂಡಿ ಬೆಲೆ ತುಲನೆಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ."
                if language == "kn" else
                "Namaskara, I am Kisan Mitra! I can assist you with crop recommendations, seed reservations, disease diagnosis, and mandi price arbitrage."
            )

        yield f"data: {json.dumps({'type': 'final_answer', 'content': final_text})}\n\n"

copilot = KisanMitraCopilot()
