import os
import json
from pathlib import Path

# 현재 스크립트의 절대 경로 기준으로 디렉토리 설정
script_dir = Path(__file__).parent
directory = script_dir

# HTML 파일 찾기
html_files = {}
index = 1
for file in sorted(directory.glob("*.html")):
    if 'humor_' not in file.name:  # humor_ 문자열이 포함되지 않은 파일만 처리
        post_key = f"post_url_{index}"
        html_files[post_key] = f"https://testpro.site/vvv/{file.name}"
        index += 1

# JSON 파일로 저장
output_file = directory / "0-1.json"

# 디렉토리가 없으면 생성
directory.mkdir(parents=True, exist_ok=True)

# JSON 파일로 저장
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(html_files, f, ensure_ascii=False, indent=4)

print(f"총 {len(html_files)}개의 HTML 파일명이 {output_file}에 JSON 형식으로 저장되었습니다.")
