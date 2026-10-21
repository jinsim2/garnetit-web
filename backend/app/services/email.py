import smtplib
import ssl
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr

from app.config import settings
from app.models.inquiry import Inquiry
from app.services.email_templates import (
    get_customer_inquiry_email_html,
    get_admin_inquiry_email_html
)

logger = logging.getLogger(__name__)


def send_html_email(to_email: str, subject: str, html_content: str):
    """
    단일 HTML 이메일을 하이웍스 SMTP 서버를 통해 발송하는 공통 함수
    """
    if not settings.SMTP_SERVER or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP 설정이 누락되어 이메일 발송을 건너뜁니다.")
        return

    # MIME 이메일 메시지 생성
    msg = MIMEMultipart("alternative")
    
    # 한글 깨짐 방지 발신자/수신자/제목 인코딩
    msg["From"] = formataddr((str(Header(settings.SMTP_FROM_NAME, "utf-8")), settings.SMTP_USER))
    msg["To"] = to_email
    msg["Subject"] = Header(subject, "utf-8")

    # HTML 본문 추가
    part = MIMEText(html_content, "html", "utf-8")
    msg.attach(part)

    try:
        # SSL 보안 연결 (하이웍스 포트 465)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT, context=context, timeout=10) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, [to_email], msg.as_string())
            logger.info(f"이메일 발송 성공: {to_email} (제목: {subject})")
    except Exception as e:
        logger.error(f"이메일 발송 실패 ({to_email}): {e}")


def send_inquiry_emails(inquiry: Inquiry):
    """
    고객이 문의를 등록했을 때 실행되는 오케스트레이션 함수:
    1) 고객에게 '접수 확인 안내' 이메일 발송
    2) 사내 관리자에게 '신규 문의 접수 리포트' 이메일 발송
    """
    # 1. 고객에게 확인 메일 발송
    if inquiry.email:
        customer_subject = f"[가넷정보기술] {inquiry.author_name} 고객님의 온라인 문의가 정상 접수되었습니다."
        customer_html = get_customer_inquiry_email_html(inquiry)
        send_html_email(
            to_email=inquiry.email,
            subject=customer_subject,
            html_content=customer_html
        )

    # 2. 관리자에게 알림 메일 발송
    if settings.ADMIN_EMAIL:
        admin_subject = f"🔔 [신규 문의] {inquiry.company_name} - {inquiry.author_name}님의 문의가 접수되었습니다."
        admin_html = get_admin_inquiry_email_html(inquiry)
        send_html_email(
            to_email=settings.ADMIN_EMAIL,
            subject=admin_subject,
            html_content=admin_html
        )
