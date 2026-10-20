import json
import urllib.request
import logging
from app.config import settings
from app.models.inquiry import Inquiry

logger = logging.getLogger(__name__)

def send_discord_inquiry_notification(inquiry: Inquiry):
    """
    신규 온라인 문의 접수 시 디스코드 채널로 예쁜 카드(Embed) 형태의 알림을 발송합니다.
    파이썬 표준 내장 라이브러리(urllib)를 사용하여 별도 패키지 설치 없이 즉시 동작합니다.
    """
    webhook_url = settings.DISCORD_WEBHOOK_URL
    if not webhook_url:
        logger.warning("DISCORD_WEBHOOK_URL이 설정되지 않아 디스코드 알림을 건너뜁니다.")
        return

    # 카드(Embed) 메시지 구성
    payload = {
        "username": "가넷 고객문의 봇",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",  # 알림봇 프로필 아이콘
        "embeds": [
            {
                "title": "🔔 새로운 온라인 문의가 접수되었습니다!",
                "color": 0x3B82F6,  # 가넷 블루 테마 색상 (16진수)
                "fields": [
                    {
                        "name": "🏢 회사명",
                        "value": inquiry.company_name,
                        "inline": True
                    },
                    {
                        "name": "👤 담당자",
                        "value": inquiry.author_name,
                        "inline": True
                    },
                    {
                        "name": "📞 연락처",
                        "value": inquiry.phone,
                        "inline": True
                    },
                    {
                        "name": "✉️ 이메일",
                        "value": inquiry.email,
                        "inline": True
                    },
                    {
                        "name": "🏷️ 문의 유형",
                        "value": inquiry.subject or "일반 문의",
                        "inline": True
                    },
                    {
                        "name": "📝 문의 내용",
                        "value": inquiry.message if len(inquiry.message) <= 1000 else inquiry.message[:997] + "...",
                        "inline": False
                    }
                ],
                "footer": {
                    "text": f"가넷정보기술 관리자 시스템 • 문의 ID #{inquiry.id}"
                }
            }
        ]
    }

    try:
        # JSON 인코딩 및 HTTP POST 요청 전송
        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            webhook_url,
            data=req_data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "GarnetIT-Inquiry-Bot/1.0"
            }
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status in (200, 204):
                logger.info(f"디스코드 문의 알림 발송 성공 (Inquiry ID: {inquiry.id})")
    except Exception as e:
        # 알림 발송에 실패하더라도 고객의 문의 DB 저장은 취소되지 않도록 예외를 안전하게 격리
        logger.error(f"디스코드 웹훅 발송 실패: {e}")
