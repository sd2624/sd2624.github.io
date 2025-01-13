@echo off
echo 파이썬 환경 설정을 시작합니다...

python -m pip install --upgrade pip
pip install selenium==4.9.0
pip install beautifulsoup4==4.11.2
pip install requests==2.28.2
pip install webdriver-manager==4.0.0

echo 설치가 완료되었습니다.
pause
