import time
import re
import sys
import random
import logging
import os
from datetime import datetime
try:
    from bs4 import BeautifulSoup
    import cloudscraper
    from fake_useragent import UserAgent
except ImportError as e:
    print(f"필요한 패키지가 설치되지 않았습니다: {str(e)}")
    print("다음 명령어로 필요한 패키지를 설치하세요:")
    print("pip install beautifulsoup4 cloudscraper fake-useragent")
    sys.exit(1)

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('scraping.log', encoding='utf-8')
    ]
)

def clean_filename(text):
    """파일명으로 사용할 수 있게 문자열 정리"""
    # URL에서 사용 가능한 문자만 허용
    # 1. 공백을 하이픈으로 변경
    text = text.replace(' ', '-')
    # 2. 대괄호 제거
    text = text.replace('[', '').replace(']', '')
    # 3. 알파벳, 숫자, 하이픈만 허용
    text = re.sub(r'[^a-zA-Z0-9가-힣\-]', '', text)
    # 4. 연속된 하이픈을 하나로
    text = re.sub(r'-+', '-', text)
    # 5. 앞뒤 하이픈 제거
    return text.strip('-')

def get_scraper():
    """클라우드플레어 우회 스크래퍼 생성"""
    ua = UserAgent()
    scraper = cloudscraper.create_scraper(
        browser={
            'browser': 'chrome',
            'platform': 'windows',
            'desktop': True
        }
    )
    scraper.headers.update({
        'User-Agent': ua.random,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.humorworld.net/',
        'DNT': '1',
    })
    return scraper

def setup_folders():
    """필요한 폴더 구조 생성"""
    base_path = os.path.join('www')
    # image_path 제거
    os.makedirs(base_path, exist_ok=True)
    return base_path, None  # None 반환하여 이미지 경로 사용 안함

def save_article(title, content, images, base_path, prev_post=None, next_post=None):
    try:
        # 이미 처리된 제목을 그대로 사용
        safe_title = clean_filename(title)
        filename = os.path.join(base_path, f'{safe_title}.html')
        
        # 네비게이션 링크 설정 수정
        nav_links = []
        if prev_post and 'filename' in prev_post:
            nav_links.append(f'<a href="https://testpro.site/output/vvv/{prev_post["filename"]}" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">◀ 이전 글</a>')
        
        # 홈 링크를 전체 URL로 변경
        nav_links.append('<a href="https://testpro.site/output/vvv/humor_1.html" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; background-color: #f0f0f0; transition: background-color 0.3s;">홈</a>')
        
        if next_post and 'filename' in next_post:
            nav_links.append(f'<a href="https://testpro.site/output/vvv/{next_post["filename"]}" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">다음 글 ▶</a>')
        
        nav_html = '\n'.join(nav_links)

        # content가 BeautifulSoup 객체인 경우 HTML 추출
        if isinstance(content, BeautifulSoup):
            content_html = str(content)
            content_html = content_html.replace('src="/', 'src="https://amg.friendwoo.com//')
            
            # Remove all AdSense related elements
            soup = BeautifulSoup(content_html, 'html.parser')
            for element in soup.select('ins.adsbygoogle, script[src*="adsbygoogle.js"], [data-ad-client], [data-ad-slot]'):
                element.decompose()
            content_html = str(soup)
        else:
            content_html = f"<p>{content}</p>"

        # Single clean ad block for article
        clean_ad_block = '''
        <!-- Article Ad -->
        <div class="article-ad" style="margin: 20px 0; text-align: center;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                 data-ad-slot="YOUR_AD_SLOT"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
        '''

        # 봇용 텍스트 구조화
        bot_text_parts = {
            'intro': [
                "이 포스팅에서 소개할 내용은",
                "오늘의 흥미로운 이야기는",
                "여러분과 함께 나누고 싶은 소식은",
                "이번에 준비한 재미있는 콘텐츠는",
                "하루를 웃게 해줄 오늘의 주제는",
                "놓치면 아쉬울 이번 이야기는",
                "당신의 관심을 끌 소식은",
                "지금 소개할 재미있는 주제는",
                "즐겁게 감상할 오늘의 내용은",
                "다 함께 공감할 이야기거리는",
                "오늘도 공유하고 싶은 유쾌한 정보는",
                "마음을 따뜻하게 할 이번 이야기의 주제는",
                "가볍게 읽기 좋은 콘텐츠는",
                "재미와 정보를 함께 담은 이 콘텐츠는",
                "피식 웃음 나오는 이번 주제는",
                "새롭게 소개할 오늘의 콘텐츠는",
                "순간을 즐기게 해줄 이야기는",
                "인터넷에서 화제가 된 내용은",
                "기분 전환에 딱 맞는 콘텐츠는",
                "보는 순간 미소 지을 이야기거리는"
            ],
            'detail': [
                "유머러스하게 풀어낸",
                "재치있게 구성된",
                "즐겁게 전달하는",
                "신선한 시각으로 바라본",
                "일상에서 공감할 수 있는",
                "생생하게 표현된",
                "읽는 재미가 있는",
                "한 번쯤 생각하게 만드는",
                "눈길을 사로잡는",
                "흥미를 끌 만한",
                "웃음 포인트가 담긴",
                "감성적으로 구성된",
                "짧지만 인상적인",
                "의외의 반전을 지닌",
                "가볍지만 의미 있는",
                "실제 있었던 이야기 기반의",
                "기발한 상상력이 녹아든",
                "독자의 참여를 유도하는",
                "공유하고 싶은 가치가 있는",
                "보고 또 봐도 질리지 않는"
            ],
            'ending': [
                "이야기입니다",
                "내용입니다",
                "포스팅입니다",
                "컨텐츠입니다",
                "소개글입니다",
                "정보입니다",
                "읽을거리입니다",
                "소식입니다",
                "주제입니다",
                "자료입니다",
                "유머입니다",
                "읽기 좋은 글입니다",
                "감상거리입니다",
                "짧은 소통입니다",
                "함께 나눌 이야기입니다",
                "좋은 하루를 위한 이야기입니다",
                "생각해볼만한 이야기입니다",
                "기분 좋아지는 이야기입니다",
                "오늘의 피식입니다",
                "지금 웃을 거리입니다"
            ]
        }

        # 3-5개의 랜덤 문장 생성
        selected_bot_texts = [
            f"{random.choice(bot_text_parts['intro'])} {random.choice(bot_text_parts['detail'])} {random.choice(bot_text_parts['ending'])}"
            for _ in range(random.randint(10, 15))
        ]

        bot_content = "\n".join(f'<div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)};">{text}</div>' for text in selected_bot_texts)

        def get_random_interactive_elements():
            elements = [
                lambda: f'''
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <form role="form" aria-label="독자 의견">
                            <h4>이 글 어떠셨나요?</h4>
                            <textarea placeholder="여러분의 소중한 의견을 남겨주세요" style="width:300px;height:100px"></textarea>
                            <button type="submit" style="margin-top:10px">의견 남기기</button>
                        </form>
                    </div>
                ''',
                lambda: f'''
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <details>
                            <summary>관련 태그</summary>
                            <ul>
                                <li>유머</li>
                                <li>웃음</li>
                                <li>일상</li>
                            </ul>
                        </details>
                    </div>
                ''',
                lambda: f'''
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <div class="rating">
                            <h4>평가해주세요</h4>
                            <input type="radio" name="rate" id="rate1">
                            <label for="rate1">😄</label>
                            <input type="radio" name="rate" id="rate2">
                            <label for="rate2">😊</label>
                            <input type="radio" name="rate" id="rate3">
                            <label for="rate3">😐</label>
                        </div>
                    </div>
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <div class="rating">
                            <h4>평가해주세요</h4>
                            <input type="radio" name="rate" id="rate1">
                            <label for="rate1">좋음</label>
                            <input type="radio" name="rate" id="rate2">
                            <label for="rate2">중간</label>
                            <input type="radio" name="rate" id="rate3">
                            <label for="rate3">나쁨</label>
                        </div>
                    </div>
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <div class="rating">
                            <h4>평가해주세요</h4>
                            <input type="radio" name="rate" id="rate1">
                            <label for="rate1">그럭저럭이다</label>
                            <input type="radio" name="rate" id="rate2">
                            <label for="rate2">중간저럭이다</label>
                            <input type="radio" name="rate" id="rate3">
                            <label for="rate3">나쁨저럭이다</label>
                        </div>
                    </div>      
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <div class="rating">
                            <h4>평가해주세요</h4>
                            <input type="radio" name="rate" id="rate1">
                            <label for="rate1">밥이 맛이 맛있었다</label>
                            <input type="radio" name="rate" id="rate2">
                            <label for="rate2">라면은 중간저럭이다</label>
                            <input type="radio" name="rate" id="rate3">
                            <label for="rate3">피자는 나쁨저럭이다</label>
                        </div>
                    </div>               
                ''',
                lambda: f'''
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <select aria-label="카테고리 선택">
                            <option>유머</option>
                            <option>일상</option>
                            <option>이슈</option>
                        </select>
                    </div>
                ''',
                lambda: f'''
                    <div style="position:absolute; left:-9999px; top:{random.randint(1000,3000)}px; z-index:-{random.randint(1,999)}">
                        <div class="progress-wrap">
                            <h4>읽은 사람들의 반응</h4>
                            <progress value="{random.randint(70,95)}" max="100"></progress>
                            <span>긍정적</span>
                        </div>
                    </div>
                '''
            ]
            return "\n".join(random.sample([el() for el in elements], random.randint(3, 6)))

        html_content = f"""<!DOCTYPE html>
<html lang="ko-KR" class="js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755" crossorigin="anonymous"></script>
    <script>
        // AdSense 초기화 함수
        function initAds() {{
            try {{
                if (typeof adsbygoogle !== 'undefined') {{
                    adsbygoogle.push({{
                        google_ad_client: "ca-pub-9374368296307755",
                        enable_page_level_ads: true
                    }});
                    
                    // 개별 광고 슬롯 초기화
                    const adElements = document.querySelectorAll('.adsbygoogle');
                    adElements.forEach(ad => {{
                        try {{
                            (adsbygoogle = window.adsbygoogle || []).push({{}});
                        }} catch(e) {{
                            console.log('Ad slot initialization error:', e);
                        }}
                    }});
                }} else {{
                    // AdSense가 로드되지 않은 경우 재시도
                    setTimeout(initAds, 1000);
                }}
            }} catch(e) {{
                console.log('AdSense initialization error:', e);
            }}
        }}

        // 페이지 로드 완료 후 광고 초기화
        window.addEventListener('load', function() {{
            setTimeout(initAds, 100);
        }});
    </script>

    
    <!-- 원본 스타일시트 -->
    <link rel='stylesheet' id='wp-block-library-css' href='https://amg.friendwoo.com//wp-includes/css/dist/block-library/style.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='classic-theme-styles-css' href='https://amg.friendwoo.com//wp-includes/css/classic-themes.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='blogberg-style-css' href='https://amg.friendwoo.com//wp-content/themes/blogberg/style.css' type='text/css' media='all' />
    <link rel='stylesheet' id='blogberg-google-fonts-css' href='https://fonts.googleapis.com/css?family=Poppins:300,400,400i,500,600,700,700i|Rubik:300,400,400i,500,700,700i' type='text/css' media='all' />
    <link rel='stylesheet' id='bootstrap-css' href='https://amg.friendwoo.com//wp-content/themes/blogberg/assets/vendors/bootstrap/css/bootstrap.min.css' type='text/css' media='all' />
    
    <style type="text/css">
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
            line-height: 1.6;
            background-color: #f8f9fa;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            overflow-x: hidden;
            position: relative;
        }}
        
        .container {{
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 15px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        
        .content-area {{
            width: 100%;
            max-width: 100%;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 20px;
            margin: 0 auto;
            box-sizing: border-box;
        }}
        
        .entry-content img {{
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1rem auto;
        }}
        
        .entry-title {{
            font-size: 1.5rem;
            line-height: 1.4;
            margin: 1rem 0;
            word-break: keep-all;
        }}
        
        .bottom-navigation {{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
            padding: 10px 0;
            width: 100%;
            z-index: 1000;
        }}
        
        .nav-links {{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            padding: 0 15px;
            margin: 0 auto;
            max-width: 600px;
        }}
        
        @media (max-width: 768px) {{
            .container {{
                padding: 10px;
            }}
            
            .content-area {{
                padding: 15px;
                border-radius: 0;
            }}
            
            .entry-title {{
                font-size: 1.3rem;
            }}
            
            .entry-content {{
                font-size: 1rem;
            }}
            
            .nav-links {{
                padding: 0 10px;
                font-size: 0.9rem;
            }}
        }}
        
        @media (max-width: 375px) {{
            .container {{
                padding: 5px;
            }}
            
            .content-area {{
                padding: 10px;
            }}
            
            .entry-title {{
                font-size: 1.2rem;
            }}
            
            .entry-content {{
                font-size: 0.95rem;
            }}
            
            .nav-links {{
                padding: 0 5px;
                font-size: 0.85rem;
            }}
        }}

        /* 팝업 스타일 */
        .popup-overlay {{
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }}
        
        .popup-container {{
            position: relative;
            width: 90%;
            max-width: 500px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        
        .popup-content {{
            text-align: center;
        }}
        
        .popup-title {{
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
        }}
        
        .popup-timer {{
            position: absolute;
            top: 10px;
            right: 10px;
            background: #6c5ce7;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }}
        
        .popup-ad {{
            margin: 20px 0;
            min-height: 250px;
            display: flex;
            justify-content: center;
            align-items: center;
        }}
        
        @media (max-width: 768px) {{
            .popup-container {{
                width: 95%;
                margin: 10px;
                padding: 15px;
            }}
            
            .popup-title {{
                font-size: 20px;
                margin-bottom: 15px;
            }}
        }}
    </style>
</head>
<body>
    <!-- 봇용 숨겨진 콘텐츠 -->
    <div class="hidden-content" aria-hidden="true">
        {bot_content}
        {get_random_interactive_elements()}
    </div>

    <div class="container">
        <main class="content-area">
            <!-- 상단 광고 -->
            <div class="ad-container">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="8384240134"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
            
            <article class="post">
                <header class="entry-header">
                    <h1 class="entry-title">{title}</h1>
                    <div class="entry-meta">
                        <span class="posted-on">
   
                        </span>
                    </div>
                </header>
                <div class="entry-content">
                    {content_html}
                    {images}
                </div>
                <footer class="entry-footer">
                    <nav class="navigation post-navigation">
                        <div class="nav-links">
                            {f'<div class="nav-previous"><a href="{prev_post["filename"]}">{prev_post["title"]}</a></div>' if prev_post else ''}
                            {f'<div class="nav-next"><a href="{next_post["filename"]}">{next_post["title"]}</a></div>' if next_post else ''}
                        </div>
                    </nav>
                </footer>
            </article>
            
            <!-- 하단 광고 -->
            <div class="ad-container">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="8384240134"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        </main>
    </div>

    <!-- 팝업 -->
    <div class="popup-overlay">
        <div class="popup-container">
            <div class="popup-content">
                <div class="popup-timer">5</div>
                <h2 class="popup-title">관련 콘텐츠</h2>
                <!-- 팝업 광고 -->
                <div class="ad-container">
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-9374368296307755"
                         data-ad-slot="8384240134"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                </div>
            </div>
        </div>
    </div>

    <!-- 봇용 숨겨진 콘텐츠 -->
    <div class="hidden-content" aria-hidden="true">
        {bot_content}
        {get_random_interactive_elements()}
    </div>

    <!-- 원본 사이트 스크립트 -->
    <script src='https://amg.friendwoo.com//wp-includes/js/jquery/jquery.min.js' id='jquery-core-js'></script>
    <script src='https://amg.friendwoo.com//wp-content/themes/blogberg/assets/vendors/bootstrap/js/bootstrap.min.js' id='bootstrap-js'></script>
</body>
</html>"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logging.info(f"Successfully saved HTML file: {filename}")
        return filename
    except Exception as e:
        logging.error(f"Error saving HTML file: {str(e)}")
        return None

def is_duplicate_post(title, base_path):
    """게시물 제목 중복 검사 (원본 제목 사용)"""
    safe_title = clean_filename(title)
    return os.path.exists(os.path.join(base_path, f'{safe_title}.html'))

# 클릭 유도 접두어와 흥미로운 주제 접미어 리스트 추가
CLICK_PREFIXES = [
    "충격", "경악", "화제", "논란", "실화", "대박", "궁금", "알고보니", "충격적", "결국",
    "현실", "경악", "공감", "화제의", "완벽", "역대급", "필독", "최초", "극과극", "충격반전",
    "실시간", "속보", "단독", "전격", "긴급", "초특급", "절대", "화제의", "놀라운", "충격적인",
    "완전", "초강력", "강추", "필수", "대유행", "최강", "극한", "전설의", "상상초월", "신기한"
]

INTEREST_SUFFIXES = [
    "비하인드", "꿀팁", "레전드", "사연", "현실", "반전", "근황", "비밀", "이야기", "심쿵",
    "순간", "기적", "노하우", "핵심", "비결", "대반전", "진실", "TMI", "모음", "영상",
    "현장", "총정리", "요약", "정보", "모음집", "기록", "사실", "모먼트", "포인트", "궁금증",
    "꿀잼", "분석", "해설", "후기", "리뷰", "정리", "모음", "꿀팁", "레시피", "노하우"
]

def process_title(title):
    """제목에 접두어와 접미어 한 번씩만 추가"""
    # 제목을 기반으로 일관된 인덱스 생성
    prefix_index = hash(title) % len(CLICK_PREFIXES)
    suffix_index = hash(title + "suffix") % len(INTEREST_SUFFIXES)
    
    prefix = CLICK_PREFIXES[prefix_index]
    suffix = INTEREST_SUFFIXES[suffix_index]
    
    # 접두어와 접미어를 한 번씩만 추가
    return f"[{prefix}] {title} ({suffix})"

def create_humor_page(posts_info, base_path, page_number=1):
    """유머 페이지 생성"""
    posts_per_page = 10
    total_posts = len(posts_info)
    total_pages = (total_posts + posts_per_page - 1) // posts_per_page
    
    start_idx = (page_number - 1) * posts_per_page
    end_idx = min(start_idx + posts_per_page, total_posts)
    current_posts = posts_info[start_idx:end_idx]
    
    # 네비게이션 링크 추가 - 미리보기 없음 버전과 동일하게 수정
    nav_links = []
    if page_number > 1:
        nav_links.append(f'<a href="./humor_{page_number-1}.html" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">◀ 이전</a>')
    
    nav_links.append(f'<span style="color: #333; padding: 8px 15px;">페이지 {page_number}</span>')
    
    if page_number < total_pages:
        nav_links.append(f'<a href="./humor_{page_number+1}.html" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">다음 ▶</a>')
    
    nav_html = '\n'.join(nav_links)
    
    # 페이지네이션 HTML 수정
    pagination_html = '<div class="pagination" style="margin-top: 20px; text-align: center;">'
    
    # 이전 페이지 링크
    if page_number > 1:
        pagination_html += f'<a href="./humor_{page_number-1}.html" style="margin: 0 5px; padding: 5px 10px; text-decoration: none; color: #333;">◀</a>'
    
    # 페이지 번호
    for i in range(1, total_pages + 1):
        if i == page_number:
            pagination_html += f'<span style="margin: 0 5px; padding: 5px 10px; background-color: #f0f0f0; border-radius: 3px;">{i}</span>'
        else:
            pagination_html += f'<a href="./humor_{i}.html" style="margin: 0 5px; padding: 5px 10px; text-decoration: none; color: #333;">{i}</a>'
    
    # 다음 페이지 링크
    if page_number < total_pages:
        pagination_html += f'<a href="./humor_{page_number+1}.html" style="margin: 0 5px; padding: 5px 10px; text-decoration: none; color: #333;">▶</a>'
    
    pagination_html += '</div>'

    # 게시물 목록 HTML 생성
    posts_html = '<ul style="list-style: none; padding: 0;">'
    for post in current_posts:
        posts_html += f'''
        <li style="margin: 15px 0; padding: 15px; background-color: #fff; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <a href="./{post['filename']}" style="text-decoration: none; color: #333; display: block;">
                <h2 style="margin: 0; font-size: 18px;">{post['title']}</h2>
            </a>
        </li>'''
    posts_html += '</ul>'

    html_content = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>유머 게시판 - 페이지 {page_number}</title>
    <style>
        /* 기본 스타일 */
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }}
        .container {{
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 15px;
            box-sizing: border-box;
        }}
        h1 {{
            text-align: center;
            margin: 20px 0;
            font-size: 24px;
            color: #333;
        }}
        
        /* 게시물 목록 스타일 */
        .posts-list {{
            list-style: none;
            padding: 0;
            margin: 0;
        }}
        .post-item {{
            background: #fff;
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }}
        .post-item:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }}
        .post-link {{
            text-decoration: none;
            color: #333;
            display: block;
        }}
        .post-title {{
            font-size: 18px;
            margin: 0;
            line-height: 1.4;
        }}
        
        /* 페이지네이션 스타일 */
        .pagination {{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin: 30px 0;
            flex-wrap: wrap;
        }}
        .pagination a, .pagination span {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            height: 36px;
            padding: 0 12px;
            border-radius: 4px;
            background: #fff;
            color: #333;
            text-decoration: none;
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }}
        .pagination a:hover {{
            background: #f0f0f0;
            transform: translateY(-1px);
        }}
        .pagination span.current {{
            background: #333;
            color: #fff;
        }}
        
        /* 하단 네비게이션 */
        .bottom-navigation {{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding: 10px 0;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
            z-index: 1000;
        }}
        .nav-links {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 600px;
            margin: 0 auto;
            padding: 0 15px;
        }}
        .nav-button {{
            padding: 8px 16px;
            border-radius: 4px;
            background: #fff;
            color: #333;
            text-decoration: none;
            transition: all 0.2s ease;
        }}
        .nav-button:hover {{
            background: #f0f0f0;
        }}
        
        /* 모바일 최적화 */
        @media (max-width: 768px) {{
            .container {{
                padding: 10px;
            }}
            h1 {{
                font-size: 20px;
                margin: 15px 0;
            }}
            .post-item {{
                padding: 15px;
                margin: 10px 0;
            }}
            .post-title {{
                font-size: 16px;
            }}
            .pagination a, .pagination span {{
                min-width: 32px;
                height: 32px;
                padding: 0 8px;
                font-size: 14px;
            }}
            .nav-button {{
                padding: 6px 12px;
                font-size: 14px;
            }}
        }}
        
        /* 작은 모바일 화면 */
        @media (max-width: 375px) {{
            .container {{
                padding: 8px;
            }}
            .post-item {{
                padding: 12px;
                margin: 8px 0;
            }}
            .post-title {{
                font-size: 14px;
            }}
            .pagination a, .pagination span {{
                min-width: 28px;
                height: 28px;
                padding: 0 6px;
                font-size: 13px;
            }}
            .nav-button {{
                padding: 5px 10px;
                font-size: 13px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>유머 게시판</h1>
        {posts_html}
        {pagination_html}
    </div>
    
    <!-- 하단 네비게이션 바 추가 -->
    <nav class="bottom-navigation" style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
        padding: 10px 0;
        z-index: 1000;
    ">
        <div class="container">
            <div class="nav-links" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 600px;
                margin: 0 auto;
                padding: 0 20px;
            ">
                {nav_html}
            </div>
        </div>
    </nav>
    
    <div style="height: 60px;"><!-- 하단 네비게이션 바 공간 확보 --></div>
</body>
</html>"""

    filename = f'humor_{page_number}.html'
    with open(os.path.join(base_path, filename), 'w', encoding='utf-8') as f:
        f.write(html_content)

def scrape_category():
    """이미지가 있는 게시물만 스크래핑"""
    base_path, _ = setup_folders()
    posts_info = []
    post_count = 0
    
    try:
        scraper = get_scraper()
        page = 1
        
        while True:
            try:
                base_url = 'https://amg.friendwoo.com/'
                url = f'{base_url}page/{page}/' if page > 1 else base_url
                logging.info(f"Scraping page {page}: {url}")
                
                response = scraper.get(url)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                articles = soup.select('article.format-standard')
                if not articles:
                    logging.info("No more articles found")
                    break
                    
                for article in articles:
                    try:
                        title_elem = article.select_one('.entry-title a')
                        if not title_elem:
                            continue
                        
                        # 게시물 상세 페이지 스크래핑
                        link = title_elem.get('href')
                        article_response = scraper.get(link)
                        article_soup = BeautifulSoup(article_response.text, 'html.parser')
                        
                        content = article_soup.select_one('.entry-content')
                        if not content:
                            continue

                        # 이미지 태그 확인
                        images = content.find_all('img')
                        if not images:  # 이미지가 없으면 건너뛰기
                            logging.info("Skipping post without images")
                            continue

                        original_title = title_elem.get_text(strip=True)
                        
                        # 여기서부터는 이미지가 있는 게시물만 처리
                        if is_duplicate_post(original_title, base_path):
                            logging.info(f"Skipping duplicate post: {original_title}")
                            continue

                        # 이미지 HTML 생성
                        images_html = ""
                        for img in images:
                            if img.get('src'):
                                img_url = img['src']
                                if not img_url.startswith('http'):
                                    img_url = f"https://amg.friendwoo.com/{img_url}"
                                images_html += f'<img src="{img_url}" alt="{original_title}" loading="lazy">\n'

                        # 나머지 처리 코드는 동일...
                        # 현재 게시물 정보 저장
                        processed_title = process_title(original_title)
                        safe_filename = clean_filename(processed_title) + '.html'
                        
                        current_post = {
                            'title': original_title,
                            'processed_title': processed_title,
                            'content': content,
                            'images': images_html,
                            'filename': safe_filename
                        }
                        
                        # 이전/다음 게시물 정보 설정
                        prev_post = posts_info[-1] if posts_info else None
                        next_post = posts_info[-2] if len(posts_info) > 1 else None
                        
                        # 게시물 저장
                        saved_file = save_article(
                            processed_title,
                            content,
                            images_html,
                            base_path,
                            prev_post,
                            next_post
                        )
                        
                        # 게시물 정보 저장 및 페이지 생성
                        if saved_file:
                            posts_info.append(current_post)
                            logging.info(f"Article saved: {original_title}")
                            post_count += 1
                            
                            # 10개 단위로 페이지 생성
                            if post_count % 10 == 0:
                                page_number = post_count // 10
                                create_humor_page(posts_info, base_path, page_number)
                                
                                # 사용자 확인
                                choice = input(f"\n{post_count}개의 게시물을 스크래핑했습니다. 계속하시겠습니까? (y/n): ")
                                if choice.lower() != 'y':
                                    # 마지막 페이지 생성
                                    final_page = (post_count + 9) // 10
                                    create_humor_page(posts_info, base_path, final_page)
                                    return
                        
                        time.sleep(random.uniform(2, 4))
                        
                    except Exception as e:
                        logging.error(f'Error processing article: {str(e)}')
                        continue
                
                page += 1
                time.sleep(random.uniform(3, 5))
                
            except Exception as e:
                logging.error(f'Error scraping page {page}: {str(e)}')
                break
                
    except Exception as e:
        logging.error(f'Error occurred: {str(e)}')
    finally:
        # 마지막 페이지 생성
        if post_count > 0 and post_count % 10 != 0:
            final_page = (post_count + 9) // 10
            create_humor_page(posts_info, base_path, final_page)

if __name__ == '__main__':
    print('Starting to scrape humorworld.net category...')
    scrape_category()
    print('Scraping completed!')
