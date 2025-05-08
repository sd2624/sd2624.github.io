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
    from PIL import Image
    import io
except ImportError as e:
    print(f"필요한 패키지가 설치되지 않았습니다: {str(e)}")
    print("다음 명령어로 필요한 패키지를 설치하세요:")
    print("pip install beautifulsoup4 cloudscraper fake-useragent pillow")
    sys.exit(1)

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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

def clean_filename(text):
    """파일명으로 사용할 수 있게 문자열 정리"""
    # 기본 파일명 정리
    cleaned = re.sub(r'[\\/*?:"<>|]', "", text)
    # URL에서 사용할 수 있도록 추가 처리
    cleaned = cleaned.replace(' ', '-')  # 공백을 하이픈으로 변경
    cleaned = re.sub(r'[^\w\-\.]', '', cleaned)  # 알파벳, 숫자, 하이픈, 점만 허용
    cleaned = re.sub(r'-+', '-', cleaned)  # 연속된 하이픈을 하나로
    return cleaned.strip('-')  # 앞뒤 하이픈 제거

def process_title(title, prefix_index=None, suffix_index=None):
    """제목에 일관된 접두어와 접미어 추가"""
    # seed를 사용하여 일관된 접두어/접미어 선택
    if prefix_index is None:
        # 제목을 기반으로 일관된 인덱스 생성
        prefix_index = hash(title) % len(CLICK_PREFIXES)
    if suffix_index is None:
        suffix_index = hash(title + "suffix") % len(INTEREST_SUFFIXES)
        
    prefix = CLICK_PREFIXES[prefix_index]
    suffix = INTEREST_SUFFIXES[suffix_index]
    return f"[{prefix}] {title} ({suffix})"

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
    base_path = os.path.join('sd2624.github.io', 'output', 'vvv')
    image_path = os.path.join(base_path, 'images')
    
    # 폴더 생성
    os.makedirs(base_path, exist_ok=True)
    os.makedirs(image_path, exist_ok=True)
    
    return base_path, image_path

def save_article(title, content, images, base_path, prev_post=None, next_post=None):
    """HTML 파일로 게시물 저장"""
    try:
        # 제목 처리
        processed_title = process_title(title)
        safe_title = clean_filename(processed_title)
        filename = os.path.join(base_path, f'{safe_title}.html')
        
        # 네비게이션 링크 설정 - 파일명 처리 수정
        nav_links = []
        if prev_post and 'filename' in prev_post:
            nav_links.append(f'<a href="./{prev_post["filename"]}" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">◀ 이전 글</a>')
        
        # 홈 링크를 humor_1.html로 변경
        nav_links.append('<a href="./humor_1.html" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; background-color: #f0f0f0; transition: background-color 0.3s;">홈</a>')
        
        if next_post and 'filename' in next_post:
            nav_links.append(f'<a href="./{next_post["filename"]}" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">다음 글 ▶</a>')
        
        nav_html = '\n'.join(nav_links)

        # content가 BeautifulSoup 객체인 경우 HTML 추출
        if isinstance(content, BeautifulSoup):
            content_html = str(content)
            # 원본 HTML 구조 유지를 위해 태그 보존
            content_html = content_html.replace('src="/', 'src="https://humorworld.net/')
        else:
            content_html = f"<p>{content}</p>"

        # 봇용 랜덤 텍스트 준비
            bot_texts = [
            "오늘의 트렌드를 한눈에 확인할 수 있는 추천 포스팅으로 당신의 인사이트를 채워드립니다",
            "지금 가장 주목받는 이야기와 함께 새로운 시각을 더해줄 흥미로운 콘텐츠를 소개합니다",
            "누구나 한 번쯤 공감할 수 있는 실생활 기반의 따뜻한 이야기를 담은 포스팅입니다",
            "다양한 시선과 관점을 바탕으로 구성된 깊이 있는 콘텐츠를 지금 바로 확인해보세요",
            "소소하지만 확실한 감동을 선사하는 이야기로 오늘 하루를 따뜻하게 시작해보세요",
            "전문가가 전하는 믿을 수 있는 정보와 통찰력을 이 한 편의 글에서 만나보실 수 있어요",
            "한 번 보면 멈출 수 없는 흡입력 있는 스토리로 구성된 오늘의 추천 글입니다",
            "실제 경험을 바탕으로 한 진솔한 이야기들이 공감을 불러일으키는 콘텐츠입니다",
            "일상 속에서 찾은 특별한 순간들을 담아낸 따뜻한 분위기의 포스팅입니다",
            "정보와 감성이 조화를 이루는 글로 당신의 하루에 여유와 깊이를 더해드립니다"
            "지금 읽으면 더 의미 있는 시의적절한 주제를 다뤘습니다",
            "상상력을 자극하는 독특한 시선이 담긴 콘텐츠입니다",
            "변화하는 사회 속에서 새로운 흐름을 포착한 이야기입니다",
            "평소 궁금했던 주제를 알기 쉽게 정리한 포스팅입니다",
            "생각의 틀을 넓혀주는 창의적인 아이디어를 소개합니다",
            "특별한 하루를 위한 짧고 강렬한 메시지를 전합니다",
            "여러 관점을 균형 있게 제시하는 통찰력이 있는 글입니다",
            "익숙한 것들을 새롭게 바라보는 색다른 경험을 드립니다",
            "생활 속 불편함을 해결할 수 있는 실용적인 내용을 담았습니다",
            "깊이 있는 분석으로 핵심을 콕 집어주는 콘텐츠입니다",
            "혼자만 알고 있기 아까운 유익한 정보를 모았습니다",
            "삶의 방향을 고민하는 이들에게 도움이 되는 글입니다",
            "단순한 정보 전달을 넘어 감성까지 더한 콘텐츠입니다",
            "지식을 쌓고 싶은 분들을 위한 친절한 콘텐츠입니다",
            "가볍지만 의미 있는 이야기를 담은 포스팅입니다",
            "무심코 지나쳤던 사실에 대해 다시 생각하게 합니다",
            "하루의 끝에서 여운을 남기는 따뜻한 콘텐츠입니다",
            "균형 잡힌 시각으로 현실을 바라보는 글입니다",
            "지루할 틈 없는 다채로운 구성이 돋보입니다",
            "자기계발에 도움이 되는 핵심 정보를 엄선했습니다",
            "세상을 이해하는 데 필요한 기초 지식을 담았습니다",
            "지금 꼭 알아야 할 키워드를 쉽게 설명합니다",
            "작지만 확실한 변화에 대해 이야기합니다",
            "공간과 시간의 의미를 되짚는 철학적인 시선이 담겨 있습니다",
            "문학적 감수성을 자극하는 섬세한 문장이 매력적입니다",
            "여행처럼 새로운 세상을 안내하는 글입니다",
            "당신만의 시각을 키울 수 있는 통찰력을 전합니다",
            "지친 일상 속 작은 위로가 되어주는 콘텐츠입니다",
            "현실적인 예시로 이해를 돕는 유익한 글입니다",
            "감동적인 사례와 함께 전달되는 진심 어린 이야기입니다",
            "정보와 감성을 동시에 만족시키는 포스팅입니다",
            "지속 가능한 삶에 대한 실천적 아이디어를 제안합니다",
            "다른 사람의 삶을 들여다볼 수 있는 이야기입니다",
            "감춰진 진실을 파헤치는 탐구적인 접근이 돋보입니다",
            "독립적인 사고를 유도하는 문제제기형 콘텐츠입니다",
            "무거운 주제를 쉽게 풀어내는 솜씨가 인상적입니다",
            "단어 하나에도 깊은 의미가 담긴 문장을 소개합니다",
            "공감과 참여를 유도하는 스토리텔링이 살아 있습니다",
            "다양한 세대가 함께 공감할 수 있는 이야기를 담았습니다",
            "익숙한 소재를 새롭게 해석한 창의적인 콘텐츠입니다",
            "감성적인 음악과 어울리는 분위기의 글입니다",
            "자연스럽게 몰입되는 흐름으로 완성도 높은 구성입니다",
            "미래를 준비하는 데 필요한 인사이트를 제공합니다",
            "실패 속에서도 배움을 찾는 긍정적인 메시지가 담겨 있습니다",
            "현대인의 고민을 대변하는 솔직한 이야기입니다",
            "자연과 함께 살아가는 삶의 방식에 대해 이야기합니다",
            "시간이 지나도 잊히지 않을 감동을 선사합니다",
            "마음의 안정과 치유를 위한 편안한 콘텐츠입니다",
            "어려운 개념도 쉽게 설명해주는 친절한 글입니다",
            "우리 주변의 이야기를 깊이 있게 다뤘습니다",
            "문화적 맥락을 이해하는 데 도움이 되는 콘텐츠입니다",
            "실생활에서 바로 써먹을 수 있는 꿀팁을 모았습니다",
            "가볍게 시작해서 깊이 있는 사고로 이어지는 구성입니다",
            "다양한 사례를 통해 설득력을 높인 포스팅입니다",
            "지속적으로 관심 가져야 할 이슈를 소개합니다",
            "감각적인 편집과 구성으로 읽는 재미를 더했습니다",
            "시작부터 끝까지 몰입하게 만드는 글입니다",
            "공감대를 형성하며 이야기 속으로 자연스럽게 이끕니다",
            "작가의 개성과 스타일이 뚜렷한 콘텐츠입니다",
            "하나의 주제를 여러 각도에서 분석한 포스팅입니다",
            "삶의 태도에 대해 생각하게 만드는 이야기입니다",
            "계절의 변화에 어울리는 감성적인 글입니다",
            "디지털 시대에 꼭 필요한 정보와 시사점을 담았습니다",
            "고정관념을 깨고 새로운 시각을 제시합니다",
            "마음속 질문에 대한 작은 힌트를 제공하는 콘텐츠입니다",
            "현실을 직시하면서도 희망을 잃지 않는 메시지입니다",
            "익숙한 일상에서 발견한 특별한 순간을 소개합니다",
            "정보에 깊이를 더한 프리미엄 콘텐츠입니다",
            "지금 알아두면 쓸모 있는 실전 노하우를 전합니다",
            "다양한 분야의 전문가 의견을 반영한 신뢰도 높은 글입니다",
            "숫자와 데이터로 이야기하는 명확한 콘텐츠입니다",
            "생활 속 궁금증을 시원하게 풀어주는 설명입니다",
            "상황별 대응 방법을 구체적으로 알려주는 실용 콘텐츠입니다",
            "짧은 시간 안에 핵심을 파악할 수 있도록 구성했습니다",
            "비슷한 경험을 떠올리게 하는 현실적인 이야기입니다",
            "디자인과 콘텐츠가 조화를 이루는 시각적 완성도가 뛰어납니다",
            "불확실한 시대에 필요한 판단 기준을 제시합니다",
            "다양한 사례 분석을 통해 실전 감각을 길러주는 글입니다",
            "혼자만 알기 아까운 정보들을 알기 쉽게 풀었습니다",
            "지금 가장 뜨거운 이슈에 대해 깊이 있게 다뤘습니다",
            "미래를 바꾸는 기술과 아이디어를 소개합니다",
            "사소한 일상도 특별하게 만드는 시선이 담겼습니다",
            "다른 사람의 관점을 통해 스스로를 돌아보게 합니다",
            "과거와 현재를 잇는 흥미로운 이야기입니다",
            "지적 호기심을 만족시켜주는 탐색형 콘텐츠입니다",
            "주제를 깊이 파고드는 전문적인 설명이 인상적입니다",
            "신뢰할 수 있는 출처를 기반으로 구성된 콘텐츠입니다",
            "시대를 반영하는 이야기를 통해 현재를 읽을 수 있습니다",
            "복잡한 세상을 이해하는 데 도움이 되는 이야기입니다",
            "스스로 생각하게 만드는 질문을 던지는 글입니다",
            "여러 사람이 함께 생각해볼 만한 주제를 제시합니다",
            "전문 용어 없이 쉽게 이해할 수 있는 글입니다",
            "짧지만 임팩트 있는 메시지가 담겨 있습니다",
            "마음을 움직이는 문장으로 오래 기억에 남습니다",
            "읽고 나면 생각이 정리되는 기분 좋은 콘텐츠입니다",
            "일상에 숨겨진 가치와 아름다움을 찾아보는 이야기입니다"
            "새로운 아이디어와 창의적인 접근이 돋보이는 특별한 콘텐츠를 만나보세요",
            "하루를 여유롭게 시작할 수 있는 따뜻하고 잔잔한 이야기를 담았습니다",
            "다양한 분야의 정보를 한곳에 모아 더 넓은 세상을 탐험할 수 있습니다",
            "시선을 사로잡는 흥미로운 주제로 지루할 틈 없는 콘텐츠를 제공합니다",
            "일상의 소소한 순간들을 특별하게 만들어주는 감성 콘텐츠입니다",
            "의미 있는 메시지와 함께 생각할 거리를 던져주는 깊이 있는 포스팅입니다",
            "지금 이 순간을 특별하게 만들어줄 콘텐츠로 하루를 채워보세요",
            "평범한 일상 속 숨겨진 가치를 발견할 수 있는 이야기를 전합니다",
            "행동을 유도하는 설득력 있는 메시지를 담고 있습니다",
            "공간의 의미를 재해석하며 일상의 변화를 이야기합니다",
            "실현 가능한 목표를 설정하는 데 도움이 되는 글입니다",
            "시간을 절약할 수 있는 스마트한 방법을 알려드립니다",
            "작은 습관이 큰 변화를 만든다는 메시지를 전합니다",
            "흥미로운 인물 이야기를 통해 삶의 방향을 고민합니다",
            "정보의 흐름을 파악하며 시대 감각을 유지할 수 있습니다",
            "도전과 성장을 응원하는 긍정적인 에너지가 담겨 있습니다",
            "가볍지만 오래 남는 인상을 주는 이야기를 준비했습니다",
            "지속 가능한 일상을 위한 친환경 팁을 소개합니다",
            "독자의 궁금증을 정확히 짚어주는 설명이 특징입니다",
            "직관적인 구성으로 누구나 쉽게 접근할 수 있습니다",
            "실패를 자산으로 바꾸는 사고방식을 공유합니다",
            "문제 해결력을 높이는 사고법을 제시합니다",
            "개성과 감성이 살아 있는 글로 차별화를 꾀했습니다",
            "주제를 다각도로 분석하여 폭넓은 이해를 돕습니다",
            "생각을 자극하는 문장이 인상적으로 구성되어 있습니다",
            "복잡한 이슈를 명쾌하게 정리해주는 정보 콘텐츠입니다",
            "바쁜 일상 속에서 잠시 쉬어갈 수 있는 이야기입니다",
            "일상의 변화를 이끄는 작은 실천을 강조합니다",
            "심플한 표현으로 깊은 의미를 전하는 콘텐츠입니다",
            "사회적 흐름을 통찰력 있게 읽어내는 글입니다",
            "정서적 안정감을 주는 따뜻한 문체로 구성되어 있습니다",
            "현장의 목소리를 반영한 생생한 정보가 담겨 있습니다",
            "생산성과 효율성을 높이는 전략을 소개합니다",
            "정보 과잉 시대에 꼭 필요한 핵심만 담았습니다",
            "깊이 있는 해석으로 이해도를 높여주는 콘텐츠입니다",
            "감정을 자극하지 않고도 공감을 이끌어냅니다",
            "현실을 반영한 솔직한 이야기로 신뢰를 얻습니다",
            "생각의 전환을 유도하는 흥미로운 사례를 다뤘습니다",
            "직관적인 이미지와 함께 정보를 효과적으로 전달합니다",
            "지금 놓치면 후회할 중요한 내용을 정리했습니다",
            "마음을 움직이는 서사 구조로 몰입감을 높였습니다",
            "기술 변화에 대응하는 현실적인 방법을 제시합니다",
            "혼란스러운 상황에서도 중심을 잡는 지침이 됩니다",
            "일상에서 실천할 수 있는 간단한 아이디어를 전합니다",
            "복잡한 주제를 명쾌하게 풀어낸 글입니다",
            "미래 지향적인 관점에서 내용을 구성했습니다",
            "사회적 책임과 윤리에 대한 고민을 담았습니다",
            "정보의 신뢰도를 최우선으로 고려한 콘텐츠입니다",
            "독자 스스로 답을 찾을 수 있도록 유도하는 방식입니다",
            "과학적 사고를 기반으로 한 체계적인 설명이 특징입니다",
            "감각적인 디자인 요소로 가독성을 높였습니다",
            "사소한 요소 하나까지 신경 쓴 완성도 높은 글입니다",
            "심리적 안정감을 줄 수 있는 콘텐츠입니다",
            "행동 변화로 이어질 수 있도록 구체적인 팁을 담았습니다",
            "사회 변화에 따른 새로운 패러다임을 다뤘습니다",
            "시대 흐름을 읽을 수 있는 통계 기반의 분석입니다",
            "감정을 자극하지 않고 사실만 전달하는 형식입니다",
            "쉽게 따라 할 수 있는 실전 중심 콘텐츠입니다",
            "타인의 경험을 통해 배우는 간접 학습 콘텐츠입니다",
            "일과 삶의 균형을 맞추는 현실적인 방법을 제시합니다",
            "새로운 기술과 흐름을 연결해주는 브릿지 콘텐츠입니다",
            "사회적 소외를 줄이기 위한 연대의 메시지를 담았습니다",
            "지식뿐 아니라 지혜를 전달하는 콘텐츠입니다",
            "디지털 시대에 필요한 자기 관리 전략을 소개합니다",
            "글 속에서 자신을 돌아보게 만드는 요소를 포함했습니다",
            "정보의 흐름을 시각적으로 정리하여 이해를 돕습니다",
            "실천을 유도하는 동기 부여형 콘텐츠입니다",
            "변화하는 환경에 유연하게 적응하는 사고법을 다룹니다",
            "공감과 정보가 조화를 이루는 콘텐츠입니다",
            "관계 회복에 도움이 되는 소통의 기술을 제시합니다",
            "짧은 글 속에 명확한 메시지를 담았습니다",
            "생활 리듬을 회복하는 데 유용한 정보가 담겼습니다",
            "다양한 세대가 함께 공감할 수 있는 메시지입니다",
            "지속 가능한 경영을 위한 사례를 소개합니다",
            "다소 어려운 개념도 친절한 설명으로 쉽게 전달합니다",
            "지금 필요한 전략을 구체적으로 알려주는 콘텐츠입니다",
            "사용자 경험 중심의 접근 방식으로 구성된 글입니다",
            "불안한 시대에 중심을 잡아주는 통찰을 담았습니다",
            "타인의 입장을 이해할 수 있도록 돕는 내용입니다",
            "불필요한 정보를 배제하고 본질에 집중했습니다",
            "긍정적인 자극을 줄 수 있는 구성으로 설계되었습니다",
            "실패 없는 시작을 위한 준비 과정을 설명합니다",
            "누구나 쉽게 이해할 수 있도록 비유를 활용했습니다",
            "가장 많이 묻는 질문을 중심으로 구성된 글입니다",
            "현실과 이상 사이에서 균형을 맞춘 조언이 담겼습니다",
            "감각적인 구성으로 지루하지 않게 읽을 수 있습니다",
            "사회적 공감을 이끌어내는 주제를 중심으로 다뤘습니다",
            "심리학적 이론을 바탕으로 삶의 태도를 조명합니다",
            "짧은 글 속에서도 통찰을 전할 수 있도록 구성했습니다",
            "건강한 삶을 위한 현실적인 조언이 담겼습니다",
            "지적 자극과 감성적 공감을 동시에 유도합니다",
            "정보의 깊이와 폭을 동시에 확보한 콘텐츠입니다",
            "현장의 사례를 중심으로 신뢰도를 높였습니다",
            "개인 성장에 실질적인 도움이 되는 콘텐츠입니다",
            "미디어 리터러시를 높이는 데 도움이 됩니다",
            "미래를 상상하고 준비할 수 있는 영감을 줍니다",
            "기획자 관점에서 바라본 콘텐츠 구성입니다",
            "문화적 코드에 기반한 해석을 제시합니다",
            "디지털 트렌드를 이해하는 데 필요한 키워드 중심입니다",
            "가족과의 관계 개선을 위한 실천적인 조언입니다",
            "지금 이 시대에 꼭 필요한 가치에 대해 이야기합니다",
            "작은 행동이 어떻게 사회를 변화시키는지 보여줍니다",
            "주변의 문제를 해결하는 데 참고가 되는 글입니다",
            "균형 잡힌 사고를 위한 다양한 시각을 제공합니다",
            "독자의 몰입도를 고려해 구조를 설계한 콘텐츠입니다",
            "심리적 회복력을 키우는 데 필요한 정보입니다"
            "바쁜 하루 속에서 잠시 멈춰 서게 만드는 따뜻한 문장을 담았습니다",
            "몰입감을 높여주는 생생한 묘사와 매력적인 이야기로 구성되어 있습니다",
            "유쾌한 발상과 기발한 구성으로 보는 재미를 더한 콘텐츠입니다",
            "생산성과 집중력을 높여줄 실용적인 팁을 담은 유익한 정보입니다",
            "다양한 주제를 아우르며 새로운 관점을 제시하는 포스팅을 소개합니다",
            "감각적인 글과 이미지로 감성을 자극하는 콘텐츠입니다",
            "마음에 잔잔한 울림을 주는 글귀와 따뜻한 이야기가 담겨 있습니다",
            "생활 속 유익한 정보를 쉽고 간결하게 정리해 드립니다",
            "여유로운 순간에 어울리는 차분하고 편안한 이야기를 만나보세요",
            "독창적인 시선으로 풀어낸 특별한 이야기들이 기다리고 있습니다",
            "현실적인 조언과 진심 어린 메시지로 공감을 이끌어냅니다",
            "다채로운 정보와 흥미로운 사례로 이해를 돕는 콘텐츠입니다",
            "세상에 대한 궁금증을 풀어주는 알기 쉬운 설명이 포함되어 있습니다",
            "가치 있는 시간을 선사하는 깊이 있는 글을 담았습니다",
            "지금 주목해야 할 트렌드를 누구보다 빠르게 소개해 드립니다",
            "창의력과 사고의 폭을 넓혀주는 색다른 콘텐츠입니다",
            "마음을 사로잡는 문장과 아름다운 표현이 인상적인 이야기입니다",
            "꼭 알아야 할 소식과 필수 정보만을 엄선하여 전해드립니다",
            "일상에서 영감을 얻을 수 있는 새로운 시도를 소개합니다",
            "잠시 생각을 멈추고 감상할 수 있는 편안한 글입니다",
            "감동과 재미를 동시에 느낄 수 있는 알찬 콘텐츠입니다",
            "복잡한 내용을 쉽게 풀어낸 친절한 설명이 돋보입니다"
            "자연스러운 흐름으로 독자의 이해를 돕는 구조입니다",
            "다양한 감정을 담아내는 균형 잡힌 콘텐츠입니다",
            "이해하기 쉬운 비유로 복잡한 내용을 풀었습니다",
            "기술적 배경을 바탕으로 한 실용적인 정보입니다",
            "각자의 입장에서 생각해볼 만한 주제를 다룹니다",
            "일상에 적용 가능한 구체적인 사례를 포함했습니다",
            "지속적인 성장을 위한 습관 형성을 돕는 콘텐츠입니다",
            "사회적 변화에 민감하게 반응한 트렌드 분석입니다",
            "정제된 언어로 정돈된 인상을 주는 글입니다",
            "불확실성을 줄이기 위한 현실적인 대안을 제시합니다",
            "새로운 시도를 장려하는 창의적인 접근입니다",
            "감정적 소모 없이 사실 중심으로 설명합니다",
            "다양한 연령층을 고려한 배려 깊은 구성입니다",
            "개인적 체험을 통해 공감과 신뢰를 이끌어냅니다",
            "주요 개념을 시각적으로 정리해 학습 효과를 높였습니다",
            "기획자의 의도가 잘 드러나는 명확한 메시지입니다",
            "세부 정보까지 꼼꼼하게 챙긴 완성도 높은 글입니다",
            "현장의 목소리를 반영한 현실적인 조언입니다",
            "새로운 패러다임을 소개하며 시각을 확장합니다",
            "정보의 홍수 속에서 핵심만 추려낸 콘텐츠입니다",
            "사실 기반의 분석으로 신뢰도를 높였습니다",
            "공적인 논의를 위한 기초 자료로 활용 가능합니다",
            "미묘한 감정을 섬세하게 표현한 글입니다",
            "지속 가능한 습관을 위한 실천 방안을 제시합니다",
            "감정 이입을 유도하는 따뜻한 표현이 돋보입니다",
            "현재를 진단하고 미래를 제시하는 통찰이 담겼습니다",
            "무거운 주제도 가볍게 풀어내는 문체가 인상적입니다",
            "상호 이해를 위한 대화의 출발점을 제공합니다",
            "작은 실천을 통해 긍정적인 변화를 유도합니다",
            "체계적인 구성으로 내용의 흐름이 매끄럽습니다",
            "시대 정신을 반영한 주제를 다루고 있습니다",
            "소소한 순간에서 얻을 수 있는 교훈을 담았습니다",
            "다양한 사회 현상을 유기적으로 연결한 콘텐츠입니다",
            "생활 밀착형 정보로 실용성을 강조했습니다",
            "사고의 폭을 넓히는 철학적 요소를 포함했습니다",
            "독자 중심의 서술 방식으로 몰입도를 높였습니다",
            "불필요한 수식 없이 명료하게 전달합니다",
            "직접적인 표현보다 여운을 주는 문장을 사용했습니다",
            "현실과 이상 사이의 균형을 추구하는 콘텐츠입니다",
            "현재 이슈를 다른 각도에서 바라볼 수 있도록 구성했습니다",
            "지속적인 자기 성찰을 유도하는 글입니다",
            "정량적 자료와 함께 해석을 제공해 신뢰도를 높였습니다",
            "사회적 맥락을 고려한 시의성 있는 내용입니다",
            "정서적 안정에 도움이 되는 차분한 문체입니다",
            "상호작용을 유도하는 질문 형태를 활용했습니다",
            "지식 전달을 넘어 경험 공유를 목적으로 했습니다",
            "문제 인식을 통해 행동 변화를 이끌어냅니다",
            "콘텐츠의 흐름이 일관되고 자연스럽습니다",
            "기초 개념부터 심화 내용까지 단계적으로 구성했습니다",
            "독자의 시선에서 필요를 충족하는 정보를 제공합니다",
            "기존 틀에서 벗어난 창의적인 구성입니다",
            "주변에서 흔히 겪는 상황을 예로 들어 설명했습니다",
            "사회적 거리감을 좁히는 따뜻한 시선이 담겼습니다",
            "정보 소비자의 요구를 반영한 실용 중심 콘텐츠입니다",
            "문장마다 의도가 분명하게 전달됩니다",
            "가치관 형성에 도움이 되는 주제를 다뤘습니다",
            "미래 사회에 필요한 핵심 역량을 짚어드립니다",
            "정보와 감성이 자연스럽게 어우러진 구조입니다",
            "공익적 목적이 뚜렷한 콘텐츠입니다",
            "각자의 상황에 맞게 적용할 수 있는 팁을 담았습니다",
            "단순한 이야기 속에 복합적인 의미를 담았습니다",
            "의사결정에 필요한 기준을 제시하는 글입니다",
            "이야기 구조가 탄탄하여 흐름이 끊기지 않습니다",
            "타인의 경험을 통해 스스로를 돌아볼 기회를 제공합니다",
            "문화적 다양성을 반영한 열린 시각이 담겨 있습니다",
            "이해하기 쉬운 언어로 전문성을 전달합니다",
            "복합적 이슈를 다층적으로 풀어낸 콘텐츠입니다",
            "실제 사례를 중심으로 신뢰를 구축했습니다",
            "감정을 억누르지 않고 자연스럽게 표현했습니다",
            "주제의 깊이를 확장하는 질문을 던지는 형식입니다",
            "독자의 참여를 유도하는 구성으로 짜였습니다",
            "각 요소들이 유기적으로 연결되어 완성도를 높였습니다",
            "독창적인 아이디어로 차별화를 꾀했습니다",
            "정확한 정보와 따뜻한 감성을 동시에 담았습니다",
            "타인을 배려하는 언어 사용이 돋보입니다",
            "상황 판단에 도움이 되는 기준을 제시했습니다",
            "다양한 시나리오를 상정해 실효성을 높였습니다",
            "핵심 메시지가 반복 없이 명확하게 전달됩니다",
            "독자의 시야를 확장시키는 주제를 다뤘습니다",
            "개인의 성장 과정에 유용한 실천 방안입니다",
            "실제 행동으로 이어질 수 있도록 동기를 부여합니다",
            "유연한 사고를 장려하는 열린 구성을 갖췄습니다",
            "실제로 겪은 경험담을 중심으로 설득력을 높였습니다",
            "감정에 호소하지 않고 이성적으로 접근한 콘텐츠입니다",
            "다양한 배경을 가진 사람도 쉽게 공감할 수 있도록 구성했습니다",
            "글 전반에 걸쳐 일관된 톤과 메시지를 유지했습니다",
            "혼자 읽기 아까운 통찰을 나누는 콘텐츠입니다",
            "실천 가능한 아이디어를 중심으로 소개합니다",
            "읽는 즐거움을 더해주는 구성 요소가 포함되어 있습니다",
            "서술 방식이 유연하여 다양한 해석이 가능합니다",
            "지적 호기심을 자극하며 탐구심을 키워줍니다",
            "개인의 취향에 따라 다양한 방식으로 접근할 수 있습니다",
            "단순한 정보 전달을 넘어 관점 전환을 유도합니다",
            "사회적 가치를 중심으로 한 이야기 전개입니다",
            "독자가 스스로 해석할 여지를 남겨둔 문장 구성입니다",
            "무리한 주장 없이 자연스럽게 이끄는 서술입니다",
            "행동을 촉진하는 심리적 장치를 활용했습니다"
            "전문가의 시각으로 바라본 깊이 있는 분석입니다",
            "미세한 차이를 발견하고 해석하는 능력을 키워줍니다",
            "복잡한 현상을 간단한 구조로 풀어낸 글입니다",
            "정보의 신뢰성과 전달력을 동시에 고려했습니다",
            "자기 이해를 돕는 질문을 중심으로 구성되어 있습니다",
            "사람 중심의 스토리텔링으로 감정선을 따라갑니다",
            "성찰과 반성을 유도하는 단단한 메시지를 담았습니다",
            "새로운 시선으로 일상의 가치를 재발견합니다",
            "정서적 소통을 우선시하는 따뜻한 콘텐츠입니다",
            "선택에 도움이 되는 판단 기준을 제시합니다",
            "불확실한 상황에서도 방향을 제시하는 글입니다",
            "스스로 해답을 찾도록 유도하는 구성이 특징입니다",
            "사회 전반의 흐름을 반영한 종합적인 콘텐츠입니다",
            "시간이 지나도 유효한 보편적 가치를 담았습니다",
            "간결한 문장으로 강한 인상을 남깁니다",
            "개인의 관점을 확장시켜주는 다층적 서술입니다",
            "선입견을 깨는 문제 제기로 흥미를 유도합니다",
            "누구나 이해할 수 있도록 용어를 쉽게 풀었습니다",
            "감정과 이성이 균형 있게 공존하는 글입니다",
            "다양한 생활 영역에서 유용한 정보가 포함되어 있습니다",
            "불필요한 군더더기를 제거해 핵심에 집중했습니다",
            "읽는 이의 사고를 자극하는 질문을 던집니다",
            "사회적 책임감을 바탕으로 기획된 콘텐츠입니다",
            "단편적인 정보가 아닌 전체 흐름을 이해할 수 있습니다",
            "현실적인 조언과 함께 방향성을 제시합니다",
            "혼란스러운 정보 속 질서를 제안하는 구성입니다",
            "개인의 성장 여정을 응원하는 메시지가 담겼습니다",
            "기존의 상식을 재구성하는 창의적 접근입니다",
            "문제 해결에 직접적으로 도움이 되는 글입니다",
            "간접 경험을 통해 통찰을 얻게 합니다",
            "상황 판단을 위한 근거를 제시하는 콘텐츠입니다",
            "조용한 울림을 남기는 감성적 서사가 포함되어 있습니다",
            "사회적 공존을 위한 대화의 장을 마련합니다",
            "전달력 높은 언어로 핵심을 명확히 전달합니다",
            "일상에서 실천할 수 있는 지혜를 나눕니다",
            "타인의 관점을 존중하는 시선이 담겼습니다",
            "정보의 유통과정까지 고려한 체계적 설명입니다",
            "복합적인 원인을 단순화하여 이해를 돕습니다",
            "행동과 사고를 연결하는 실천적 조언입니다",
            "지식의 맥락을 중심으로 내용을 구성했습니다",
            "대중성과 전문성 사이의 균형을 유지합니다",
            "독자의 필요를 먼저 고려한 콘텐츠 기획입니다",
            "주제를 다양한 층위에서 다루며 깊이를 더합니다",
            "스토리텔링이 중심이 되어 몰입을 유도합니다",
            "실생활 적용을 전제로 한 유익한 정보입니다",
            "고정관념을 깨고 새로운 관점을 제시합니다",
            "사소한 차이가 만든 변화를 조명한 글입니다",
            "논리적 구조 속 감성적 요소를 자연스럽게 녹였습니다",
            "정보 접근성을 높이는 쉬운 표현을 사용했습니다",
            "일상에 스며드는 실질적인 가치를 전달합니다",
            "독자 참여를 고려한 인터랙티브한 구성입니다",
            "다양한 배경을 수용할 수 있는 포용적 콘텐츠입니다",
            "명확한 구조로 이해도를 높이는 글입니다",
            "감정선에 따라 흐름을 조절한 서술 방식입니다",
            "읽는 재미를 더하기 위해 구조에 변화를 주었습니다",
            "주제에 집중하도록 돕는 간결한 문장이 특징입니다",
            "실제 사례를 통해 신뢰를 쌓는 방식입니다",
            "정보 소비자 입장에서 다시 구성한 콘텐츠입니다",
            "감동을 주기 위한 연출보다는 사실 중심으로 구성했습니다",
            "일상적 경험을 통해 사회적 이슈를 조명합니다",
            "감정을 배제하고 논리로 설득하는 글입니다",
            "고정된 시각에서 벗어나 열린 접근을 시도합니다",
            "짧은 문장 안에 복합적 의미를 담았습니다",
            "일상 속 불편함을 해결하는 실질적인 방법입니다",
            "독자가 자기 이야기를 떠올릴 수 있도록 구성했습니다",
            "기획자의 의도가 자연스럽게 드러나는 글입니다",
            "단계별 흐름으로 이해하기 쉽게 설명합니다",
            "관계의 본질을 돌아보게 하는 주제를 담았습니다",
            "감정을 자극하지 않으면서 공감을 끌어냅니다",
            "기초부터 차근차근 설명하는 입문자용 콘텐츠입니다",
            "독자의 입장을 고려한 배려 있는 언어를 사용했습니다",
            "주제를 다양한 관점에서 균형 있게 다뤘습니다",
            "의미 있는 메시지를 일상 언어로 풀어낸 구성입니다",
            "공감과 성찰이 함께 이루어지는 콘텐츠입니다",
            "이해와 존중의 태도를 기반으로 한 글입니다",
            "정보를 넘어 감정까지 고려한 구성입니다",
            "객관적 시선으로 내용을 전개해 신뢰를 높였습니다",
            "감정 과잉 없이 담백한 서술이 돋보입니다",
            "독자의 사고 흐름에 맞춘 자연스러운 구성이 특징입니다",
            "성장 과정의 단계를 현실적으로 보여줍니다",
            "타인의 이야기를 통해 자신을 돌아볼 수 있게 합니다",
            "선명한 메시지로 독자의 인식을 전환합니다",
            "현실 속 문제에 대한 실제적 대안을 제시합니다",
            "관찰을 통한 통찰력을 공유하는 글입니다",
            "정보를 조합해 새로운 시각을 제공하는 방식입니다",
            "정해진 답이 아닌 사고를 유도하는 질문을 던집니다",
            "불안감 해소를 위한 구체적인 사례가 포함되어 있습니다",
            "전달하고자 하는 바를 중심으로 압축한 구성입니다",
            "균형 있는 사고를 도와주는 비판적 관점을 포함했습니다",
            "독자의 삶에 긍정적인 영향을 줄 수 있는 글입니다",
            "구성요소 간의 연결성을 고려해 설계된 콘텐츠입니다",
            "실생활 경험을 분석해 공감을 끌어내는 방식입니다",
            "감정적 소통과 정보 전달을 동시에 실현했습니다",
            "지적 만족감과 정서적 안정감을 동시에 제공합니다",
            "무리한 강조 없이 자연스럽게 설득력을 높였습니다",
            "현재 사회 흐름에 맞춘 적시성 있는 콘텐츠입니다",
            "일상의 문제를 근본적으로 바라보는 관점을 제시합니다"
            "가치 중심의 시각으로 삶의 방향을 고민하게 합니다",
            "작은 변화를 통해 이루어지는 큰 성장을 제안합니다",
            "읽는 이의 삶과 연결되는 구체적인 이야기를 담았습니다",
            "단순한 정보 나열이 아닌 의미 있는 흐름이 있습니다",
            "혼자만의 고민이 아닌 모두의 이야기로 풀었습니다",
            "마음의 여유를 갖게 해주는 차분한 어조가 인상적입니다",
            "배려 있는 관점으로 타인의 입장을 이해하게 합니다",
            "의도와 맥락을 함께 설명하여 이해를 도왔습니다",
            "감정을 다독이는 문장들로 위로를 전합니다",
            "생활 속 관찰을 바탕으로 한 실질적 통찰입니다",
            "복잡하지 않지만 깊이 있는 내용 구성이 특징입니다",
            "글의 시작부터 끝까지 일관된 흐름을 유지합니다",
            "막연했던 생각을 구체화할 수 있도록 돕습니다",
            "정보의 양보다는 질에 집중하여 구성했습니다",
            "일상적인 언어로 특별한 가치를 전하려 했습니다",
            "새로운 가능성을 엿볼 수 있는 창의적 기획입니다",
            "자기만의 시선으로 재해석한 독창적인 콘텐츠입니다",
            "감동보다는 공감을 중시한 현실적인 글입니다",
            "감정을 억누르지 않고 드러내며 위안을 줍니다",
            "주관과 객관의 균형을 통해 설득력을 높였습니다",
            "미루어 왔던 생각을 행동으로 이끄는 문장입니다",
            "사소한 실천에서 비롯된 변화를 기록했습니다",
            "기존 방식에서 벗어난 새로운 틀을 제시했습니다",
            "다각도에서 주제를 풀어내며 시야를 넓혔습니다",
            "심리적 안정감을 줄 수 있는 표현을 사용했습니다",
            "문제 해결을 위한 구조적 사고를 유도합니다",
            "독자의 일상과 맞닿은 소재로 접근했습니다",
            "실용성과 감성을 동시에 만족시키는 콘텐츠입니다",
            "고민의 방향성을 잡아주는 문장이 돋보입니다",
            "이야기 안에 교훈을 자연스럽게 녹여냈습니다",
            "특정 상황에 적합한 맞춤형 정보를 제시합니다",
            "단편적인 정보가 아닌 지속 가능한 아이디어입니다",
            "개인의 정체성을 돌아보게 하는 주제를 담았습니다",
            "문제에 대한 단순한 설명이 아닌 실천적 해답을 줍니다",
            "불안한 시대 속 안정감을 주는 구성이 돋보입니다",
            "관계를 회복하는 데 필요한 대화를 제안합니다",
            "혼란한 감정을 정리하는 데 도움이 되는 글입니다",
            "생활 전반을 돌아보게 하는 현실적인 제안입니다",
            "독자가 스스로를 발견할 수 있도록 돕는 구성입니다",
            "단계별로 구성된 설명으로 이해가 쉬운 글입니다",
            "낯선 개념도 친숙하게 느껴지도록 풀어냈습니다",
            "독서 후 행동으로 이어지도록 유도하는 콘텐츠입니다",
            "단어 선택 하나에도 신중함이 느껴집니다",
            "경험에서 우러난 진심이 전달되는 문장입니다",
            "독자에게 힘이 되는 현실적인 위로가 담겼습니다",
            "무엇보다 진정성을 우선으로 한 구성이 인상적입니다",
            "혼란한 생각을 정리해주는 명확한 메시지가 있습니다",
            "타인을 위한 시선에서 출발한 주제를 다뤘습니다",
            "표현보다는 본질에 집중한 구성입니다",
            "막연했던 문제에 구체적인 접근법을 제시했습니다",
            "익숙함 속에서 낯선 감정을 끌어냈습니다",
            "의미 있는 반복을 통해 주제를 강화했습니다",
            "가볍게 읽히지만 무게 있는 내용을 담았습니다",
            "읽고 난 뒤 잔상이 오래 남는 글입니다",
            "자신의 삶을 돌아보게 하는 질문이 담겨 있습니다",
            "공간과 시간의 의미를 새롭게 조명했습니다",
            "정보를 넘어서 감정을 전달하는 데 중점을 뒀습니다",
            "짧은 문장 속에 깊은 생각을 녹였습니다",
            "글 자체가 하나의 여정처럼 느껴지도록 구성했습니다",
            "균형 잡힌 시선으로 다양한 해석을 가능케 했습니다",
            "단계적 흐름이 있어 정보 이해에 도움이 됩니다",
            "가볍게 읽히면서도 생각할 거리를 남깁니다",
            "주제에 적합한 비유를 사용해 이해를 도왔습니다",
            "자신만의 해석을 덧붙일 수 있는 여유가 있습니다",
            "사회 속 개인의 위치를 조명한 콘텐츠입니다",
            "직접적이기보다는 암시적인 표현을 활용했습니다",
            "간결함 속에서도 풍부한 내용을 담아냈습니다",
            "미묘한 감정선을 잡아내는 능력이 돋보입니다",
            "일상 속 놓치기 쉬운 감정을 포착했습니다",
            "주제 선정부터 마무리까지 신중함이 느껴집니다",
            "모호했던 개념을 명확히 정리한 구성입니다",
            "하나의 사건을 다양한 관점에서 해석했습니다",
            "행동 유도를 위한 실천 방법이 구체적입니다",
            "마음의 균형을 회복하는 데 도움을 줍니다",
            "심리적 부담을 줄이고 실천 가능성을 높였습니다",
            "지적 자극과 감성적 공감이 공존합니다",
            "주제와 상징이 자연스럽게 연결되어 있습니다",
            "작은 질문에서 큰 통찰을 끌어내는 구성이 특징입니다",
            "복잡한 사회 현상을 단순화해 전달했습니다",
            "어떤 순간에도 적용 가능한 보편적 메시지입니다",
            "지속 가능성을 고려한 실천 중심의 콘텐츠입니다",
            "일상의 작은 변화가 얼마나 큰 영향을 주는지를 보여줍니다",
            "타인의 마음을 짐작하게 만드는 문장 구성이 인상적입니다",
            "개념 정리를 통해 독립적인 사고를 돕습니다",
            "다양한 삶의 방식을 존중하는 시각이 담겼습니다",
            "사회 구조에 대한 통찰을 쉽게 풀어냈습니다",
            "스스로 행동하게 만드는 자연스러운 동기부여가 있습니다",
            "각자의 맥락에 따라 적용 가능한 유연한 조언입니다",
            "공감대를 형성하면서 정보 전달도 놓치지 않았습니다",
            "불확실한 시대에 필요한 안정된 시선이 담겼습니다",
            "각 문단이 하나의 흐름으로 자연스럽게 이어집니다",
            "복잡한 이야기 없이 간명한 구조를 유지했습니다",
            "직관적인 메시지로 명확한 방향성을 제공합니다",
            "이야기의 전개가 시각적으로 그려지는 구성입니다",
            "정서적 몰입과 논리적 설득이 동시에 이뤄집니다",
            "작은 실천에서 오는 성취감을 강조한 글입니다",
            "선택과 집중을 통해 얻는 가치에 대해 다뤘습니다",
            "서로 다른 경험이 만나는 지점을 조명했습니다",
            "경험의 진정성이 글 전체를 감싸고 있습니다"         
            ]
        
        # 20-30개 랜덤 선택
        selected_texts = random.sample(bot_texts * 2, random.randint(30, 45))
        bot_content = "\n".join(f"<p style='display:none'>{text}</p>" for text in selected_texts)

        html_content = f"""<!DOCTYPE html>
<html lang="ko-KR" class="js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    
    <!-- 네이버 밴드 썸네일 비활성화 -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{processed_title}">
    <meta property="og:description" content="">
    <meta property="og:image" content="">
    <meta property="og:url" content="">
    <meta name="twitter:card" content="none">
    <link rel="image_src" href="">
    
    <title>{processed_title}</title>
    
    <!-- 검색엔진 노출 제한 -->
    <meta name="googlebot" content="noindex,nofollow">
    <meta name="googlebot-news" content="nosnippet">
    <meta name="robots" content="noarchive">
    
    <!-- 원본 스타일시트 -->
    <link rel='stylesheet' id='wp-block-library-css' href='https://humorworld.net/wp-includes/css/dist/block-library/style.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='classic-theme-styles-css' href='https://humorworld.net/wp-includes/css/classic-themes.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='blogberg-style-css' href='https://humorworld.net/wp-content/themes/blogberg/style.css' type='text/css' media='all' />
    <link rel='stylesheet' id='blogberg-google-fonts-css' href='https://fonts.googleapis.com/css?family=Poppins:300,400,400i,500,600,700,700i|Rubik:300,400,400i,500,700,700i' type='text/css' media='all' />
    <link rel='stylesheet' id='bootstrap-css' href='https://humorworld.net/wp-content/themes/blogberg/assets/vendors/bootstrap/css/bootstrap.min.css' type='text/css' media='all' />
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755" crossorigin="anonymous"></script>
    
    <style type="text/css">
        /* 기본 스타일 */
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            line-height: 1.8;
            color: #333333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        
        /* 컨테이너 레이아웃 */
        .container {{
            width: 100%;
            max-width: 1200px;
            margin: 20px auto;
            padding: 0 15px;
            box-sizing: border-box;
        }}
        
        /* 메인 콘텐츠 영역 */
        .content-area {{
            width: 100%;
            max-width: 800px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 20px;
            margin: 0 auto;
            box-sizing: border-box;
        }}
        
        /* 이미지 반응형 처리 */
        .entry-content img {{
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }}
        
        /* 광고 컨테이너 중앙 정렬 */
        .ad-container {{
            width: 100%;
            max-width: 728px;
            margin: 20px auto;
            text-align: center;
            overflow: hidden;
        }}
        
        /* 반응형 디자인 */
        @media (max-width: 768px) {{
            body {{
                padding: 0;
            }}
            
            .container {{
                padding: 10px;
                margin: 10px auto;
            }}
            
            .content-area {{
                padding: 15px;
                border-radius: 0;
            }}
            
            .entry-title {{
                font-size: 1.5em;
                word-break: keep-all;
            }}
            
            .bottom-navigation .container {{
                padding: 0 10px;
            }}
            
            .nav-links {{
                font-size: 0.9em;
            }}
        }}
        

        /* 하단 네비게이션 중앙 정렬 */
        .bottom-navigation .container {{
            padding: 0;
            margin: 0 auto;
            width: 100%;
        }}
        
        .nav-links {{
            justify-content: center;
            gap: 20px;
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
    <!-- 봇용 랜덤 텍스트를 상단에 배치 -->
    <div class="bot-content" style="display:none">
        {bot_content}
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
                <script>(adsbygoogle = window.adsbygoogle || []).push({{}});</script>
            </div>
            
            <article class="post">
                <header class="entry-header">
                    <h1 class="entry-title">{processed_title}</h1>
                    <div class="entry-meta">
                        <span class="posted-on">
                            <time class="entry-date published">{datetime.now().strftime('%Y년 %m월 %d일')}</time>
                        </span>
                    </div>
                </header>
                <div class="entry-content">
                    {content_html}
                    {images}
                </div>
                <footer class="entry-footer">
                    <nav class="navigation post-navigation">
                        <div class="nav-links" style="display: flex; justify-content: space-between; margin: 20px 0;">
                            {f'<div class="nav-previous"><a href="./{prev_post["filename"]}">{prev_post["title"]}</a></div>' if prev_post else ''}
                            {f'<div class="nav-next"><a href="./{next_post["filename"]}">{next_post["title"]}</a></div>' if next_post else ''}
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
        <!-- 웰컴 팝업 -->
    <div class="popup-overlay" id="welcome-popup">
        <div class="popup-container">
            <div class="popup-timer">7</div>
            <div class="popup-content">
                <h2 class="popup-title">환영합니다</h2>
                <div class="popup-ad">
                    <!-- 구글 애드센스 광고 -->
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-9374368296307755"
                         data-ad-slot="8384240134"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>
                        (adsbygoogle = window.adsbygoogle || []).push();
                    </script>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 팝업 표시 및 타이머 기능
        document.addEventListener('DOMContentLoaded', function() {{
            const popup = document.getElementById('welcome-popup');
            const timerElement = document.querySelector('.popup-timer');
            let timeLeft = 7;
            
            // 팝업 표시
            popup.style.display = 'flex';
            
            // 타이머 시작
            const timer = setInterval(() => {{
                timeLeft--;
                timerElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {{
                    clearInterval(timer);
                    popup.style.display = 'none';
                }}
            }}, 1000);
        }});
    </script>

    
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
    """게시물 제목 중복 검사 - 처리된 제목 사용"""
    processed_title = process_title(title)
    safe_title = clean_filename(processed_title)
    return os.path.exists(os.path.join(base_path, f'{safe_title}.html'))

def create_humor_page(posts_info, base_path, page_number=1):
    """유머 페이지 생성"""
    posts_per_page = 10
    total_posts = len(posts_info)
    total_pages = (total_posts + posts_per_page - 1) // posts_per_page
    
    # 현재 페이지의 게시물 계산
    start_idx = (page_number - 1) * posts_per_page
    end_idx = min(start_idx + posts_per_page, total_posts)
    current_posts = posts_info[start_idx:end_idx]
    
    # 네비게이션 링크 추가
    nav_links = []
    if page_number > 1:
        nav_links.append(f'<a href="./humor_{page_number-1}.html" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">◀ 이전</a>')
    
    nav_links.append(f'<span style="color: #333; padding: 8px 15px;">페이지 {page_number}</span>')
    
    if page_number < total_pages:
        nav_links.append(f'<a href="./humor_{page_number+1}.html" style="color: #333; text-decoration: none; padding: 8px 15px; border-radius: 4px; transition: background-color 0.3s;">다음 ▶</a>')
    
    nav_html = '\n'.join(nav_links)
    
    # 페이지네이션 HTML 수정 - 이전/다음 페이지 버튼 추가
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

    # 게시물 목록 HTML 생성 수정
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
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }}
        h1 {{
            text-align: center;
            margin-bottom: 30px;
            color: #333;
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

def update_humor_pages(posts_info, base_path):
    """모든 유머 페이지 업데이트"""
    total_posts = len(posts_info)
    total_pages = (total_posts + 9) // 10  # 10개씩 표시

    for page in range(1, total_pages + 1):
        create_humor_page(posts_info, base_path, page)

def initialize_humor_page(base_path):
    """초기 유머 페이지 생성"""
    # 초기 페이지를 humor_1.html로 생성
    html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>유머 게시판</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        #post-list {
            list-style: none;
            padding: 0;
        }
        .pagination {
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>유머 게시판</h1>
        <ul id="post-list"></ul>
        <div class="pagination"></div>
    </div>
</body>
</html>"""
    
    with open(os.path.join(base_path, 'humor_1.html'), 'w', encoding='utf-8') as f:
        f.write(html_content)

def scrape_category():
    """게시물 스크래핑 함수"""
    base_path, image_path = setup_folders()
    posts_info = []
    
    # 초기 유머 페이지 생성
    initialize_humor_page(base_path)
    
    try:
        scraper = get_scraper()
        page = 1
        
        while True:
            base_url = 'https://humorworld.net/category/humorstorage/'
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
                    
                    title = title_elem.get_text(strip=True)
                    link = title_elem.get('href')
                    
                    # 제목의 해시값을 사용하여 일관된 접두어/접미어 선택
                    prefix_index = hash(title) % len(CLICK_PREFIXES)
                    suffix_index = hash(title + "suffix") % len(INTEREST_SUFFIXES)
                    processed_title = process_title(title, prefix_index, suffix_index)
                    safe_filename = clean_filename(processed_title) + '.html'
                    
                    # 중복 게시물 검사 - processed_title 사용
                    if os.path.exists(os.path.join(base_path, safe_filename)):
                        logging.info(f"Skipping duplicate post: {title}")
                        continue
                    
                    # 게시물 정보를 딕셔너리에 저장
                    current_post = {
                        'title': title,
                        'processed_title': processed_title,
                        'filename': safe_filename,
                        'prefix_index': prefix_index,
                        'suffix_index': suffix_index,
                        'content': None,
                        'images': None,
                        'page_number': (len(posts_info) // 10) + 1  # 페이지 번호 추가
                    }
                    
                    # 게시물 상세 페이지 스크래핑
                    article_response = scraper.get(link)
                    article_soup = BeautifulSoup(article_response.text, 'html.parser')
                    
                    content = article_soup.select_one('.entry-content')
                    if not content:
                        logging.error(f"Content not found for: {title}")
                        continue

                    # 이미지 처리 - WebP 변환 추가
                    images_html = ""
                    for img in content.find_all('img'):
                        if img.get('src'):
                            img_name = clean_filename(os.path.basename(img['src']))
                            webp_name = f"{os.path.splitext(img_name)[0]}.webp"
                            img_path = os.path.join(image_path, webp_name)
                            
                            try:
                                # 이미지 다운로드
                                img_response = scraper.get(img['src'])
                                img_data = Image.open(io.BytesIO(img_response.content))
                                
                                # RGBA 이미지를 RGB로 변환
                                if img_data.mode in ('RGBA', 'LA'):
                                    background = Image.new('RGB', img_data.size, (255, 255, 255))
                                    background.paste(img_data, mask=img_data.split()[-1])
                                    img_data = background
                                
                                # WebP로 저장 (품질 85%)
                                img_data.save(img_path, 'WEBP', quality=85)
                                images_html += f'<img src="images/{webp_name}" alt="{title}" loading="lazy">\n'
                                logging.info(f"Image saved as WebP: {webp_name}")
                            except Exception as e:
                                logging.error(f"Failed to process image: {str(e)}")

                    # 이전/다음 게시물 설정
                    prev_post = None
                    next_post = None
                    
                    # 현재 게시물의 페이지 번호와 인덱스 계산
                    current_page = (len(posts_info)) // 10 + 1
                    current_index = (len(posts_info)) % 10
                    
                    # 첫 페이지 첫 글이 아닌 경우 이전 글 설정
                    if len(posts_info) > 0:
                        prev_post = posts_info[-1]
                    
                    # 다음 게시물 설정
                    if len(posts_info) > 1:
                        # 페이지의 마지막 글이 아닌 경우
                        if current_index < 9:
                            next_post = posts_info[-2]
                    
                    # 현재 게시물 저장
                    current_post['content'] = content
                    current_post['images'] = images_html
                    
                    saved_file = save_article(
                        current_post['title'],
                        current_post['content'],
                        current_post['images'],
                        base_path,
                        prev_post,  # 이전 게시물
                        next_post   # 다음 게시물
                    )
                    
                    if saved_file:
                        # 이전 게시물이 있는 경우 해당 게시물의 다음 글로 현재 게시물 설정
                        if prev_post:
                            save_article(
                                prev_post['title'],
                                prev_post['content'],
                                prev_post['images'],
                                base_path,
                                posts_info[-2] if len(posts_info) > 1 else None,  # 이전 글의 이전 글
                                current_post  # 현재 게시물을 다음 글로 설정
                            )
                        
                        posts_info.append(current_post)

                    time.sleep(random.uniform(2, 4))
                    
                except Exception as e:
                    logging.error(f'Error processing article: {str(e)}')
                    continue
            
            # 페이지 단위로 유머 페이지 업데이트
            update_humor_pages(posts_info, base_path)
            
            page += 1
            time.sleep(random.uniform(3, 5))
            
    except Exception as e:
        logging.error(f'Error occurred: {str(e)}')
    finally:
        # humor.html을 humor_1.html로 리다이렉트하는 파일 생성
        redirect_html = """<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0;url=humor_1.html">
</head>
<body>
    <script>window.location.href = 'humor_1.html';</script>
</body>
</html>"""
        with open(os.path.join(base_path, 'humor.html'), 'w', encoding='utf-8') as f:
            f.write(redirect_html)
            
        # 최종 유머 페이지 업데이트
        update_humor_pages(posts_info, base_path)

if __name__ == '__main__':
    print('Starting to scrape humorworld.net category...')
    scrape_category()
    print('Scraping completed!')
