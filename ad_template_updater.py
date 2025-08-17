#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
광고 템플릿 일괄 적용 스크립트
모든 테스트 폴더의 index.html과 script.js에 표준화된 광고 시스템을 적용합니다.
"""

import os
import re
import shutil
from pathlib import Path

# 작업 디렉토리
BASE_DIR = Path(r"c:\Users\com\Desktop\테스트프로\sd2624.github.io")

# 테스트 폴더 목록 (index.html이 있는 폴더들)
TEST_FOLDERS = [
    "감정", "건강보험피부양자", "관상", "노후연금", "닮은동물", "돈", "동물", "로블록스", 
    "류마티스관절염", "사랑", "색", "스트레스", "신분증", "신용등급", "신용카드결제일", 
    "실버타운", "실시간TV", "실업급여", "아파트시세", "알뜰실버타운", "에겐", "연예인닮은꼴", 
    "운전면허반납", "운전자보험", "유튜브음악다운로드", "의료지원금", "자동차리스", "전기요금", 
    "정부지원대출", "주유할인카드", "주정차", "주차접촉사고", "체크카드추천", "치아보험", 
    "코스트코", "타로", "통신비", "퍼스널컬러", "해외여행자보험", "행복", "행운", "mbti"
]

# 광고 HTML 템플릿
AD_TEMPLATES = {
    'header': '''            <!-- [광고] 상단 광고 - 헤더 바로 아래 -->
            <div class="ad-section" id="adTop">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-9374368296307755"
                     data-ad-slot="3201247599"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>''',
    
    'middle': '''                <!-- [광고] 중간 광고 - 3번째 질문 후 -->
                <div class="ad-section" id="adMid" style="display: none;">
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-9374368296307755"
                         data-ad-slot="1966797795"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                </div>''',
    
    'result': '''                    <!-- [광고] 결과 페이지 중간 -->
                    <div class="ad-section" id="adResult">
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-9374368296307755"
                             data-ad-slot="4448942166"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                    </div>'''
}

# JavaScript AdManager 템플릿
ADMANAGER_TEMPLATE = '''// [광고] AdManager 클래스 - 광고 로드 및 중복 방지 관리
class AdManager {
    constructor() {
        this.loadedAds = new Set(); // 로드된 광고 추적
    }
    
    // 광고 로드 함수
    loadAd(adId) {
        if (this.loadedAds.has(adId)) {
            console.log(`[광고] ${adId} 이미 로드됨 - 중복 방지`);
            return false;
        }
        
        const adElement = document.getElementById(adId);
        if (adElement && typeof adsbygoogle !== 'undefined') {
            try {
                // 광고 컨테이너 표시
                adElement.style.display = 'block';
                
                // 광고 푸시
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
    
    // 중간 광고 표시 (3번째 질문 후)
    showMidAd() {
        return this.loadAd('adMid');
    }
    
    // 결과 광고 표시
    showResultAd() {
        return this.loadAd('adResult');
    }
}

// [광고] AdManager 인스턴스 생성
const adManager = new AdManager();

// [광고] IntersectionObserver를 이용한 광고 표시 관리
const setupAdObservers = () => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const options = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    // 중간 광고 관찰자
    const midAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showMidAd();
                midAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 결과 광고 관찰자
    const resultAdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adManager.showResultAd();
                resultAdObserver.unobserve(entry.target);
            }
        });
    }, options);
    
    // 관찰 대상 등록
    const midAd = document.getElementById('adMid');
    const resultAd = document.getElementById('adResult');
    
    if (midAd) midAdObserver.observe(midAd);
    if (resultAd) resultAdObserver.observe(resultAd);
};'''

DOMCONTENTLOADED_TEMPLATE = '''
// [광고] 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 상단 광고 즉시 로드
    adManager.loadAd('adTop');
    
    // 옵저버 설정
    setupAdObservers();
});'''

def backup_file(file_path):
    """파일 백업"""
    backup_path = f"{file_path}.backup"
    if file_path.exists():
        shutil.copy2(file_path, backup_path)
        print(f"백업 생성: {backup_path}")

def update_html_file(folder_path):
    """HTML 파일의 광고 코드 업데이트"""
    html_file = folder_path / "index.html"
    if not html_file.exists():
        print(f"❌ {folder_path.name}/index.html 파일이 없습니다.")
        return False
    
    # 백업 생성
    backup_file(html_file)
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 구글 애드센스 스크립트 추가 확인
        if 'pagead2.googlesyndication.com' not in content:
            head_end = content.find('</head>')
            if head_end != -1:
                adsense_script = '    <!-- 구글 애드센스 -->\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755" crossorigin="anonymous"></script>\n'
                content = content[:head_end] + adsense_script + content[head_end:]
        
        # 기존 광고 코드 제거
        content = re.sub(r'<!-- \[광고\].*?</div>', '', content, flags=re.DOTALL)
        content = re.sub(r'<div class="ad-section".*?</div>', '', content, flags=re.DOTALL)
        content = re.sub(r'<ins class="adsbygoogle".*?</ins>', '', content, flags=re.DOTALL)
        
        # 상단 광고 삽입 (헤더 다음)
        header_patterns = [
            (r'(<div class="container">\s*<div class="test-container">)', AD_TEMPLATES['header'] + r'\n            \1'),
            (r'(<body[^>]*>\s*<div[^>]*>)', AD_TEMPLATES['header'] + r'\n        \1'),
            (r'(<div[^>]*class="[^"]*container[^"]*"[^>]*>)', AD_TEMPLATES['header'] + r'\n        \1')
        ]
        
        for pattern, replacement in header_patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                break
        
        # 중간 광고 삽입 (질문 섹션 끝)
        middle_patterns = [
            (r'(</div>\s*</div>\s*<!-- 결과 페이지 -->)', AD_TEMPLATES['middle'] + r'\n            \1'),
            (r'(</div>\s*<!-- 결과)', AD_TEMPLATES['middle'] + r'\n            \1'),
            (r'(<!-- 결과 페이지 -->)', AD_TEMPLATES['middle'] + r'\n\n            \1')
        ]
        
        for pattern, replacement in middle_patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                break
        
        # 결과 광고 삽입 (결과 설명 다음)
        result_patterns = [
            (r'(<p id="result-description"></p>)', r'\1\n' + AD_TEMPLATES['result']),
            (r'(<div class="result-content">.*?<p[^>]*>.*?</p>)', r'\1\n' + AD_TEMPLATES['result']),
            (r'(<div class="personality-traits">)', AD_TEMPLATES['result'] + r'\n                    \1')
        ]
        
        for pattern, replacement in result_patterns:
            if re.search(pattern, content, re.DOTALL):
                content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)
                break
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {folder_path.name}/index.html 업데이트 완료")
        return True
        
    except Exception as e:
        print(f"❌ {folder_path.name}/index.html 업데이트 실패: {e}")
        return False

def update_js_file(folder_path):
    """JavaScript 파일의 광고 코드 업데이트"""
    js_file = folder_path / "script.js"
    if not js_file.exists():
        print(f"❌ {folder_path.name}/script.js 파일이 없습니다.")
        return False
    
    # 백업 생성
    backup_file(js_file)
    
    try:
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 기존 AdManager 관련 코드 제거
        content = re.sub(r'// \[광고\].*?(?=\n[^\s/]|\n$)', '', content, flags=re.DOTALL)
        content = re.sub(r'class AdManager.*?(?=\nclass|\n[a-zA-Z]|\n$)', '', content, flags=re.DOTALL)
        content = re.sub(r'const adManager.*?(?=\n[a-zA-Z]|\n$)', '', content, flags=re.DOTALL)
        content = re.sub(r'const setupAdObservers.*?(?=\n[a-zA-Z]|\n$)', '', content, flags=re.DOTALL)
        content = re.sub(r'document\.addEventListener\(\'DOMContentLoaded\'.*?광고.*?\}\);', '', content, flags=re.DOTALL)
        
        # 새 AdManager 코드를 파일 맨 앞에 추가
        content = ADMANAGER_TEMPLATE + '\n\n' + content
        
        # DOMContentLoaded 이벤트 추가 (파일 맨 끝)
        if 'DOMContentLoaded' not in content or '광고' not in content:
            content += DOMCONTENTLOADED_TEMPLATE
        
        # 중간 광고 표시 로직 추가 (3번째 질문 후)
        if 'currentQuestion === 2' in content and 'showMidAd' not in content:
            content = re.sub(r'(currentQuestion === 2.*?nextQuestion\(\);)', 
                           r'\1\n        \n        // [광고] 3번째 질문 후 중간 광고 표시\n        setTimeout(() => {\n            const midAd = document.getElementById(\'adMid\');\n            if (midAd) {\n                midAd.style.display = \'block\';\n            }\n        }, 1000);', 
                           content, flags=re.DOTALL)
        
        # 결과 표시 시 광고 로드
        if 'showResult' in content and 'showResultAd' not in content:
            content = re.sub(r'(function showResult.*?\{)', 
                           r'\1\n    // [광고] 결과 광고 표시\n    setTimeout(() => adManager.showResultAd(), 1000);', 
                           content, flags=re.DOTALL)
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {folder_path.name}/script.js 업데이트 완료")
        return True
        
    except Exception as e:
        print(f"❌ {folder_path.name}/script.js 업데이트 실패: {e}")
        return False

def main():
    """메인 실행 함수"""
    print("🚀 광고 템플릿 일괄 적용을 시작합니다...")
    print(f"📁 작업 디렉토리: {BASE_DIR}")
    print(f"📊 대상 폴더 수: {len(TEST_FOLDERS)}")
    print("-" * 50)
    
    success_count = 0
    failed_folders = []
    
    for folder_name in TEST_FOLDERS:
        folder_path = BASE_DIR / folder_name
        
        if not folder_path.exists():
            print(f"⚠️ {folder_name} 폴더가 존재하지 않습니다.")
            failed_folders.append(folder_name)
            continue
        
        print(f"\n📂 처리 중: {folder_name}")
        
        # HTML 파일 업데이트
        html_success = update_html_file(folder_path)
        
        # JavaScript 파일 업데이트
        js_success = update_js_file(folder_path)
        
        if html_success and js_success:
            success_count += 1
            print(f"✅ {folder_name} 완료")
        else:
            failed_folders.append(folder_name)
            print(f"❌ {folder_name} 실패")
    
    print("\n" + "="*50)
    print("📊 작업 완료 보고서")
    print("="*50)
    print(f"✅ 성공: {success_count}/{len(TEST_FOLDERS)} 폴더")
    print(f"❌ 실패: {len(failed_folders)} 폴더")
    
    if failed_folders:
        print(f"실패한 폴더들: {', '.join(failed_folders)}")
    
    print("\n🎯 적용된 광고 시스템:")
    print("- 상단 광고: data-ad-slot='3201247599' (페이지 로드 시 즉시 표시)")
    print("- 중간 광고: data-ad-slot='1966797795' (3번째 질문 후 표시)")
    print("- 결과 광고: data-ad-slot='4448942166' (결과 페이지에서 표시)")
    print("- AdManager를 통한 중복 로드 방지")
    print("- IntersectionObserver를 통한 효율적 로드")

if __name__ == "__main__":
    main()
