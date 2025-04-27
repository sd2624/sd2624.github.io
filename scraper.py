import time
import re
import sys
import random
import logging
import os
try:
    from bs4 import BeautifulSoup
    import cloudscraper
    from fake_useragent import UserAgent
    from PIL import Image
    import io
except ImportError as e:
    print(f"필요한 패키지가 설치되지 않았습니다: {str(e)}")
    print("다음 명령어로 필요한 패키지를 설치하세요:")
    print("pip install beautifulsoup4 cloudscraper fake-useragent pillow")
    sys.exit(1)

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def clean_filename(text):
    return re.sub(r'[\\/*?:"<>|]', "", text)

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
    base_path = os.path.join('s07102624.github.io', 'output', 'ccc')
    image_path = os.path.join(base_path, 'images')
    thumbnail_path = os.path.join(base_path, 'thumbnails')  # 썸네일용 폴더 추가
    
    # 폴더 생성
    os.makedirs(base_path, exist_ok=True)
    os.makedirs(image_path, exist_ok=True)
    os.makedirs(thumbnail_path, exist_ok=True)  # 썸네일 폴더 생성
    
    return base_path, image_path, thumbnail_path

def create_thumbnail(img, size=(100, 100)):
    """썸네일 이미지 생성"""
    img.thumbnail(size)
    return img

def save_article(title, content, images, base_path, prev_post=None, next_post=None):
    """HTML 파일로 게시물 저장"""
    try:
        safe_title = clean_filename(title)
        filename = os.path.join(base_path, f'{safe_title}.html')
        
        # 네비게이션 링크 설정 - 파일명 처리 수정
        nav_links = []
        if prev_post and 'title' in prev_post:
            prev_filename = f"{clean_filename(prev_post['title'])}.html"
            nav_links.append(f'<a href="./{prev_filename}" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">◀ 이전 글</a>')
        
        nav_links.append('<a href="https://kk.testpro.site/" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; background-color: #f0f0f0; transition: background-color 0.3s;">홈</a>')
        
        if next_post and 'title' in next_post:
            next_filename = f"{clean_filename(next_post['title'])}.html"
            nav_links.append(f'<a href="./{next_filename}" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">다음 글 ▶</a>')
        
        nav_html = '\n'.join(nav_links)

        # content가 BeautifulSoup 객체인 경우 HTML 추출
        if isinstance(content, BeautifulSoup):
            content_html = str(content)
            # 원본 HTML 구조 유지를 위해 태그 보존
            content_html = content_html.replace('src="/', 'src="https://humorworld.net/')
        else:
            content_html = f"<p>{content}</p>"

        html_content = f"""<!DOCTYPE html>
<html lang="ko-KR" class="js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>{title}</title>
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755" crossorigin="anonymous"></script>
    
    <style type="text/css">
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            width: 100%;
            overflow-x: hidden;
        }}
        
        .container {{
            width: 100%;
            padding: 10px;
            margin: 0 auto;
        }}
        
        .content-area {{
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        
        .entry-title {{
            font-size: 1.5em;
            margin: 10px 0;
            word-break: keep-all;
            line-height: 1.4;
        }}
        
        .entry-meta {{
            font-size: 0.9em;
            color: #666;
            margin-bottom: 20px;
        }}
        
        .entry-content {{
            width: 100%;
            overflow-x: hidden;
        }}
        
        .entry-content img {{
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 10px auto;
        }}
        
        .ad-container {{
            width: 100%;
            max-width: 800px;
            margin: 15px auto;
            text-align: center;
            overflow: hidden;
        }}
        
        .bottom-navigation {{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
            padding: 10px 0;
            z-index: 1000;
        }}
        
        .nav-links {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 600px;
            margin: 0 auto;
            padding: 0 15px;
            gap: 10px;
        }}
        
        .nav-links a {{
            color: #333;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 4px;
            background: #f0f0f0;
            font-size: 14px;
            white-space: nowrap;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
        }}
        
        @media (max-width: 600px) {{
            .container {{
                padding: 5px;
            }}
            
            .content-area {{
                padding: 10px;
                border-radius: 0;
            }}
            
            .entry-title {{
                font-size: 1.3em;
            }}
            
            .nav-links {{
                padding: 0 10px;
            }}
            
            .nav-links a {{
                padding: 8px 10px;
                font-size: 12px;
            }}
        }}
    </style>
</head>
<body>
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
                <script>(adsbygoogle = window.adsbygoogle || []).push({{}});</script>
            </div>
            
            <article class="post">
                <header class="entry-header">
                    <h1 class="entry-title">{title}</h1>
                    <div class="entry-meta">
                        <span class="posted-on">
                            <!-- 날짜 제거 -->
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
                <script>(adsbygoogle = window.adsbygoogle || []).push({{}});</script>
            </div>
        </main>
    </div>
    
    <!-- 고정 광고 -->
    <div class="ad-fixed">
        <ins class="adsbygoogle"
             style="display:inline-block;width:300px;height:250px"
             data-ad-client="ca-pub-9374368296307755"
             data-ad-slot="8384240134"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({{}});</script>
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
    
    <!-- 원본 사이트 스크립트 -->
    <script src='https://humorworld.net/wp-includes/js/jquery/jquery.min.js' id='jquery-core-js'></script>
    <script src='https://humorworld.net/wp-content/themes/blogberg/assets/vendors/bootstrap/js/bootstrap.min.js' id='bootstrap-js'></script>
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
    """게시물 제목 중복 검사"""
    safe_title = clean_filename(title)
    return os.path.exists(os.path.join(base_path, f'{safe_title}.html'))

def resize_image(img, size=None):
    """이미지 리사이즈 함수"""
    if size:
        # 썸네일용 정사각형 이미지 생성
        thumb = img.copy()
        thumb.thumbnail(size, Image.Resampling.LANCZOS)
        # 정사각형으로 크롭
        if thumb.size[0] != thumb.size[1]:
            size = min(thumb.size)
            box = ((thumb.size[0] - size) // 2, (thumb.size[1] - size) // 2,
                  (thumb.size[0] + size) // 2, (thumb.size[1] + size) // 2)
            thumb = thumb.crop(box)
        return thumb
    else:
        # 원본 이미지 리사이즈
        w_percent = 600 / float(img.size[0])
        h_size = int(float(img.size[1]) * float(w_percent))
        return img.resize((600, h_size), Image.Resampling.LANCZOS)

def generate_clickbait_title(original_title):
    """문맥을 고려한 클릭베이트 제목 생성"""
    funny_prefixes = [
        "초특급) ", "기절) ", "실화) ", "충격) ", "레전드) ", "폭소) ", "핫) ", "단독) ",
        "화제) ", "최초공개) ", "초고속) ", "대박) ", "극찬) ", "화제의) ", "최강) ", "반전) ",
        "돌직구) ", "경악) ", "초강력) ", "신기) ", "극한) ", "최고급) ", "센스) ", "꿀잼) ",
        "핵심) ", "필독) ", "초대박) ", "찐) ", "전설의) ", "놀라운) ", "기가막힌) ", "충격적) ",
        "대반전) ", "초특급) ", "완전) ", "미쳤다) ", "개쩌는) ", "빅뉴스) ", "긴급) ", "신박한) "
    ]
    
    engaging_suffixes = [
        " (리뷰 폭발)", " (실화입니다)", " (충격 반전)", " (완전 대박)", " (극찬 세례)", 
        " (리뷰 폭주)", " (경악 주의)", " (실화 후기)", " (대박 반전)", " (진실 공개)",
        " (전설의 시작)", " (화제의 그것)", " (반전 주의)", " (레전드 등극)", " (초강력 후기)", 
        " (놀라운 결말)", " (유출 주의)", " (긴급 속보)", " (폭소 주의)", " (신기한 이유)",
        " (대반전 주의)", " (충격적 진실)", " (필독 후기)", " (핵심 요약)", " (완전 실화)",
        " (전설로 등극)", " (기적의 순간)", " (충격 엔딩)", " (초고속 전파)", " (진실 폭로)",
        " (극찬 폭발)", " (대박 후기)", " (역대급 포텐)", " (인증 완료)", " (신기록 달성)",
        " (완벽 요약)", " (대격변)", " (극한 도전)", " (최초 발견)", " (충격적 실화)"
    ]

    # 제목 내용에 따라 적절한 접두어/접미어 선택
    keywords = {
        '충격': ['초특급) ', '충격) ', '경악) ', '기절) '],
        '웃음': ['폭소) ', '꿀잼) ', '레전드) ', '센스) '],
        '최초': ['단독) ', '최초공개) ', '긴급) ', '화제의) '],
        '반전': ['대반전) ', '충격적) ', '놀라운) ', '미쳤다) '],
        '실화': ['실화) ', '찐) ', '진짜) ', '완전) ']
    }
    
    matching_prefix = random.choice(funny_prefixes)  # 기본값
    matching_suffix = random.choice(engaging_suffixes)  # 기본값
    
    # 제목 내용에 따라 맞춤형 접두어/접미어 선택
    for keyword, prefixes in keywords.items():
        if keyword in original_title:
            matching_prefix = random.choice(prefixes)
            break
    
    return f"{matching_prefix}{original_title}{matching_suffix}"

def scrape_category():
    """게시물 스크래핑 함수"""
    base_path, image_path, thumbnail_path = setup_folders()  # 썸네일 경로 추가
    posts_info = []  # 모든 게시물 정보를 저장할 리스트
    post_count = 0
    base_url = 'https://humorworld.net/category/humorstorage/'
    
    try:
        scraper = get_scraper()
        page = 1
        
        while True:
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
                    
                    original_title = title_elem.get_text(strip=True)
                    title = generate_clickbait_title(original_title)  # 클릭베이트 제목으로 변환
                    link = title_elem.get('href')
                    
                    # 중복 게시물 검사
                    if is_duplicate_post(title, base_path):
                        logging.info(f"Skipping duplicate post: {title}")
                        continue
                    
                    # 게시물 상세 페이지 스크래핑
                    article_response = scraper.get(link)
                    article_soup = BeautifulSoup(article_response.text, 'html.parser')
                    
                    content = article_soup.select_one('.entry-content')
                    if not content:
                        logging.error(f"Content not found for: {title}")
                        continue

                    # 이미지 처리
                    images_html = ""
                    first_image = True
                    for img in content.find_all('img'):
                        if img.get('src'):
                            img_name = clean_filename(os.path.basename(img['src']))
                            webp_name = f"{os.path.splitext(img_name)[0]}.webp"
                            img_path = os.path.join(image_path, webp_name)
                            
                            try:
                                img_response = scraper.get(img['src'])
                                img_data = Image.open(io.BytesIO(img_response.content))
                                
                                # RGBA 이미지를 RGB로 변환
                                if img_data.mode in ('RGBA', 'LA'):
                                    background = Image.new('RGB', img_data.size, (255, 255, 255))
                                    background.paste(img_data, mask=img_data.split()[-1])
                                    img_data = background

                                if first_image:
                                    # 썸네일 이미지 생성 (200x200)
                                    thumb_name = f"thumb_{webp_name}"
                                    thumb_path = os.path.join(image_path, thumb_name)
                                    thumb_img = resize_image(img_data.copy(), size=(200, 200))
                                    thumb_img.save(thumb_path, 'WEBP', quality=85)
                                    
                                    # 썸네일 이미지를 HTML 상단에 추가
                                    images_html = f'<div class="thumbnail"><img src="images/{thumb_name}" alt="썸네일" style="width:200px; height:200px; object-fit:cover; margin:0 auto 20px;"></div>\n'
                                    first_image = False

                                # 원본 크기 이미지 처리
                                if img_data.size[0] > 600:
                                    img_data = resize_image(img_data)
                                
                                img_data.save(img_path, 'WEBP', quality=85)
                                images_html += f'<img src="images/{webp_name}" alt="{title}" loading="lazy" style="max-width:100%; height:auto;">\n'
                                logging.info(f"Image saved as WebP: {webp_name}")
                            except Exception as e:
                                logging.error(f"Failed to process image: {str(e)}")

                    # 현재 게시물 정보 저장 - 구조 수정
                    current_post = {
                        'title': title,
                        'content': content,
                        'images': images_html,
                        'thumbnail': f"thumbnails/thumb_{webp_name}" if first_image else "",
                        'filename': f'{clean_filename(title)}.html'  # filename 추가
                    }
                    
                    # 이전/다음 게시물 정보 설정
                    prev_post = posts_info[-1] if posts_info else None
                    
                    # 게시물 저장
                    saved_file = save_article(
                        title,
                        content,  # BeautifulSoup 객체 그대로 전달
                        images_html,
                        base_path,
                        prev_post,
                        None  # 다음 게시물은 아직 알 수 없음
                    )
                    
                    # 게시물 정보 저장
                    if saved_file:
                        posts_info.append(current_post)
                        
                        # 이전 게시물 업데이트
                        if prev_post:
                            save_article(
                                prev_post['title'],
                                prev_post['content'],
                                prev_post['images'],
                                base_path,
                                posts_info[-3] if len(posts_info) > 2 else None,
                                current_post
                            )
                    
                    if saved_file:
                        logging.info(f"Article saved: {title}")
                        post_count += 1
                    
                    if post_count % 2 == 0:  # 10에서 50으로 변경
                        choice = input(f"\n{post_count}개의 게시물을 스크래핑했습니다. 계속하시겠습니까? (y/n): ")
                        if choice.lower() != 'y':
                            return
                    
                    time.sleep(random.uniform(2, 4))
                    
                except Exception as e:
                    logging.error(f'Error processing article: {str(e)}')
                    continue
            
            page += 1
            time.sleep(random.uniform(3, 5))
            
    except Exception as e:
        logging.error(f'Error occurred: {str(e)}')

if __name__ == '__main__':
    print('Starting to scrape humorworld.net category...')
    scrape_category()
    print('Scraping completed!')
