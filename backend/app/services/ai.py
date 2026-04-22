MOOD_CN = {
    "ecstatic": "狂喜", "happy": "开心", "calm": "平静",
    "neutral": "一般", "anxious": "焦虑", "sad": "难过",
    "angry": "生气", "exhausted": "疲惫"
}

async def analyze_mood_trend(mood_data: list, period: str = "weekly") -> str:
    if not mood_data:
        return "还没有记录哦，开始记录你的心情吧！"
    dist = {}
    for d in mood_data:
        dist[d["mood"]] = dist.get(d["mood"], 0) + 1
    dominant = max(dist, key=dist.get) if dist else "neutral"
    total = len(mood_data)
    cn = MOOD_CN.get(dominant, dominant)
    return f"过去{period}你记录了{total}天心情，主要情绪是「{cn}」。继续记录，了解自己的情绪规律吧！"
