import html
from app.models.inquiry import Inquiry

def get_customer_inquiry_email_html(inquiry: Inquiry) -> str:
    """고객용: 온라인 문의 접수 확인 이메일 HTML"""
    safe_author = html.escape(inquiry.author_name)
    safe_company = html.escape(inquiry.company_name)
    safe_subject = html.escape(inquiry.subject) if inquiry.subject else "일반 문의"
    safe_message = html.escape(inquiry.message).replace("\n", "<br>")

    return f"""<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:30px 10px;">
    <tr><td align="center">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.06);">
        <!-- 헤더 -->
        <tr>
          <td style="background:#1E40AF;padding:30px;text-align:center;color:#ffffff;">
            <div style="font-size:18px;font-weight:800;letter-spacing:1px;margin-bottom:6px;">GARNET IT</div>
            <h1 style="margin:0;font-size:20px;font-weight:700;">문의가 정상적으로 접수되었습니다</h1>
          </td>
        </tr>
        <!-- 본문 안내 -->
        <tr>
          <td style="padding:28px 25px 15px;">
            <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #1f2937;">
              안녕하세요, <strong>{safe_author}</strong> 고객님.<br>
              <strong>가넷정보기술</strong>에 관심을 가져주시고 문의를 남겨주셔서 감사드립니다.
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
              고객님께서 보내주신 소중한 문의 내역이 안전하게 접수되었습니다.<br>
              담당자가 내용을 신속하게 검토한 후 빠르게 회신드리겠습니다.
            </p>
          </td>
        </tr>
        <!-- 접수 내역 요약 박스 -->
        <tr>
          <td style="padding: 0 25px 25px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; color: #64748b; width: 80px; font-weight: 600;">문의 유형</td>
                <td style="padding-bottom: 12px; font-size: 15px; color: #1e293b; font-weight: 600;">{safe_subject}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; color: #64748b; font-weight: 600;">회사명</td>
                <td style="padding-bottom: 12px; font-size: 15px; color: #1e293b;">{safe_company}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; color: #64748b; font-weight: 600;">담당자</td>
                <td style="padding-bottom: 12px; font-size: 15px; color: #1e293b;">{safe_author}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                  <div style="font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 8px;">문의 내용</div>
                  <div style="font-size: 14px; color: #334155; line-height: 1.6; background-color: #ffffff; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
                    {safe_message}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- 푸터 (회사 정보) -->
        <tr>
          <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">
              (주)가넷정보기술 | 서울특별시 영등포구 경인로 775, 에이스하이테크시티
            </p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              본 메일은 온라인 문의 접수 확인을 위해 자동 발송된 발신 전용 메일입니다.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>"""

def get_admin_inquiry_email_html(inquiry: Inquiry) -> str:
    """
    관리자(사내)에게 발송되는 '신규 문의 접수 알림 리포트' HTML 이메일 템플릿
    """
    safe_message = html.escape(inquiry.message).replace("\n", "<br>")
    safe_author = html.escape(inquiry.author_name)
    safe_company = html.escape(inquiry.company_name)
    safe_subject = html.escape(inquiry.subject) if inquiry.subject else "일반 문의"
    safe_phone = html.escape(inquiry.phone)
    safe_email = html.escape(inquiry.email)

    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[신규 문의] {safe_company} - {safe_author}님의 문의가 접수되었습니다.</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- 헤더 -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 24px 30px; color: #ffffff;">
                            <div style="font-size: 13px; color: #38bdf8; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px;">GARNET IT ADMIN</div>
                            <h2 style="margin: 0; font-size: 19px; font-weight: 700;">🔔 새로운 온라인 문의가 등록되었습니다</h2>
                        </td>
                    </tr>

                    <!-- 정보 테이블 -->
                    <tr>
                        <td style="padding: 24px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; width: 90px; font-weight: 600;">회사명</td>
                                    <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">{safe_company}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600;">담당자명</td>
                                    <td style="padding: 8px 0; font-weight: 600;">{safe_author}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600;">연락처</td>
                                    <td style="padding: 8px 0;"><a href="tel:{safe_phone}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{safe_phone}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600;">이메일</td>
                                    <td style="padding: 8px 0;"><a href="mailto:{safe_email}" style="color: #2563eb; text-decoration: none;">{safe_email}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600;">문의 유형</td>
                                    <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">{safe_subject}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 14px; border-top: 1px solid #e2e8f0;">
                                        <div style="font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 8px;">문의 내용</div>
                                        <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0; line-height: 1.6; color: #1e293b;">
                                            {safe_message}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- 관리자 바로가기 버튼 -->
                            <div style="margin-top: 24px; text-align: center;">
                                <a href="https://garnet2014.cafe24.com/garnet-adm/dashboard/boards/inquiries" 
                                   style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                                    관리자 문의 접수함 바로가기 →
                                </a>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""
