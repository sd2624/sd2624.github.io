import os
import json
from bs4 import BeautifulSoup

def update_config():
    base_path = '2025'
    config_path = 'config.json'
    # HTML 파일 수집 (humor.html과 humor_*.html 제외)
    html_files = [f for f in os.listdir(base_path) 
                 if f.endswith('.html') and f != 'humor.html' 
                 and not f.startswith('humor_')]
    html_files.sort()  # 파일명 순으로 정렬
    
    # config.json 읽기
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
        
    # 기본 설정 유지
    base_config = {k: v for k, v in config.items() 
                  if not k.startswith('post_url_') 
                  and not k.startswith('post_title_')}
    
    # 새로운 config 구성
    new_config = base_config.copy()
    
    # 각 HTML 파일 처리
    for i, html_file in enumerate(html_files, 1):
        file_path = os.path.join(base_path, html_file)
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            title = soup.select_one('.entry-title').text.strip()
            
        new_config[f'post_url_{i}'] = f'https://testpro.site/2025/{html_file}'
        new_config[f'post_title_{i}'] = title
    
    # 설정 파일 저장
    with open(config_path, 'w', encoding='utf-8', newline='') as f:
        json.dump(new_config, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    update_config()
