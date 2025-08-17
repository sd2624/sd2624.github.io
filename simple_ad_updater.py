#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
광고 템플릿 간단 적용 스크립트
"""

import os
import re
from pathlib import Path

# 작업 디렉토리
BASE_DIR = Path(r"c:\Users\com\Desktop\테스트프로\sd2624.github.io")

def simple_update_folder(folder_name):
    """개별 폴더 업데이트"""
    folder_path = BASE_DIR / folder_name
    
    if not folder_path.exists():
        print(f"❌ {folder_name} 폴더가 존재하지 않습니다.")
        return False
    
    html_file = folder_path / "index.html"
    js_file = folder_path / "script.js"
    
    success = True
    
    # HTML 파일 처리
    if html_file.exists():
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 구글 애드센스 스크립트 확인 및 추가
            if 'pagead2.googlesyndication.com' not in content:
                head_pattern = r'</head>'
                if re.search(head_pattern, content):
                    adsense_script = '''    <!-- 구글 애드센스 -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755" crossorigin="anonymous"></script>
</head>'''
                    content = re.sub(head_pattern, adsense_script, content)
            
            # 상단 광고가 없다면 추가
            if 'data-ad-slot="3201247599"' not in content:
                # 컨테이너 시작 부분 찾기
                container_pattern = r'(<div[^>]*class="[^"]*container[^"]*"[^>]*>)'
                if re.search(container_pattern, content):
                    top_ad = '''            <!-- [광고] 상단 광고 -->
            <div class="ad-section" id="adTop">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="3201247599"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>

'''
                    content = re.sub(container_pattern, r'\1\n' + top_ad, content, count=1)
            
            # 중간 광고가 없다면 추가
            if 'data-ad-slot="1966797795"' not in content:
                # 질문 섹션 끝이나 결과 섹션 시작 부분 찾기
                patterns = [
                    r'(<!-- 결과 페이지 -->)',
                    r'(<div[^>]*id="result)',
                    r'(</div>\s*</div>\s*<!-- 결과)'
                ]
                
                mid_ad = '''            <!-- [광고] 중간 광고 -->
            <div class="ad-section" id="adMid" style="display: none;">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="1966797795"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>

'''
                
                for pattern in patterns:
                    if re.search(pattern, content):
                        content = re.sub(pattern, mid_ad + r'\1', content, count=1)
                        break
            
            # 결과 광고가 없다면 추가
            if 'data-ad-slot="4448942166"' not in content:
                # 결과 설명 다음 부분 찾기
                patterns = [
                    r'(<p id="result-description"></p>)',
                    r'(<div class="personality-traits">)',
                    r'(<div class="share-container">)'
                ]
                
                result_ad = '''                    <!-- [광고] 결과 광고 -->
                    <div class="ad-section" id="adResult">
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-9374368296307755"
                             data-ad-slot="4448942166"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                    </div>

'''
                
                for pattern in patterns:
                    if re.search(pattern, content):
                        content = re.sub(pattern, r'\1\n' + result_ad, content, count=1)
                        break
            
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ {folder_name}/index.html 업데이트 완료")
            
        except Exception as e:
            print(f"❌ {folder_name}/index.html 실패: {e}")
            success = False
    
    # JavaScript 파일 처리
    if js_file.exists():
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 기존 AdManager 코드가 없다면 추가
            if 'class AdManager' not in content:
                admanager_code = '''// [광고] AdManager 클래스 - 광고 로드 및 중복 방지 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set();
    }
    
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            console.log(`[광고] ${adId} 이미 로드됨`);
            return false;
        }
        
        const adElement = document.getElementById(adId);
        if (adElement && typeof adsbygoogle !== 'undefined') {
            try {
                adElement.style.display = 'block';
                (adsbygoogle = window.adsbygoogle || []).push({});
                this.loadedAds.add(adId);
                console.log(`[광고] ${adId} 로드 완료`);
                return true;
            } catch (error) {
                console.warn(`[광고] ${adId} 로드 실패:`, error);
                return false;
            }
        }
        return false;
    }
    
    showMidAd() {
        return this.loadAd('adMid');
    }
    
    showResultAd() {
        return this.loadAd('adResult');
    }
}

const adManager = new AdManager();

const setupAdObservers = () => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const options = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const midAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showMidAd();
                midAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    const resultAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showResultAd();
                resultAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    const midAd = document.getElementById('adMid');
    const resultAd = document.getElementById('adResult');
    
    if (midAd) midAdObserver.observe(midAd);
    if (resultAd) resultAdObserver.observe(resultAd);
};

'''
                content = admanager_code + '\n' + content
            
            # DOMContentLoaded 이벤트가 없다면 추가
            if 'adManager.loadAd(\'adTop\')' not in content:
                domload_code = '''
// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    adManager.loadAd('adTop');
    setupAdObservers();
});
'''
                content += domload_code
            
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ {folder_name}/script.js 업데이트 완료")
            
        except Exception as e:
            print(f"❌ {folder_name}/script.js 실패: {e}")
            success = False
    
    return success

# 테스트 폴더 목록
folders = [
    "감정", "건강보험피부양자", "관상", "노후연금", "닮은동물", "돈", "동물", "로블록스", 
    "류마티스관절염", "사랑", "색", "스트레스", "신분증", "신용등급", "신용카드결제일", 
    "실버타운", "실시간TV", "실업급여", "아파트시세", "알뜰실버타운", "에겐", "연예인닮은꼴", 
    "운전면허반납", "운전자보험", "유튜브음악다운로드", "의료지원금", "자동차리스", "전기요금", 
    "정부지원대출", "주유할인카드", "주정차", "주차접촉사고", "체크카드추천", "치아보험", 
    "코스트코", "타로", "통신비", "퍼스널컬러", "해외여행자보험", "행복", "행운", "mbti"
]

def main():
    print("🚀 광고 템플릿 간단 적용 시작...")
    success_count = 0
    
    for folder in folders:
        print(f"\n📂 처리 중: {folder}")
        if simple_update_folder(folder):
            success_count += 1
            print(f"✅ {folder} 완료")
        else:
            print(f"❌ {folder} 실패")
    
    print(f"\n📊 완료: {success_count}/{len(folders)} 폴더")

if __name__ == "__main__":
    main()
