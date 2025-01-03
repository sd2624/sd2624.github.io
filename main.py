# main.py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from datetime import datetime

class BandAutoPost:
    def __init__(self):
        self.setup_driver()
        
    def setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)

    def login(self):
        try:
            print(f"로그인 시도: {datetime.now()}")
            self.driver.get("https://nid.naver.com/nidlogin.login")
            time.sleep(3)
            
            # 로그인 정보 입력
            self.driver.execute_script(
                f"document.getElementsByName('id')[0].value='{os.environ['0815alstj']}'"
            )
            self.driver.execute_script(
                f"document.getElementsByName('pw')[0].value='{os.environ['qweqwe89+']}'"
            )
            
            # 로그인 버튼 클릭
            self.driver.find_element(By.ID, "log.login").click()
            time.sleep(3)
            print("로그인 성공")
            
        except Exception as e:
            print(f"로그인 실패: {str(e)}")
            raise e

    def post_to_band(self, band_url):
        try:
            print(f"밴드 게시 시작: {band_url}")
            self.driver.get(band_url)
            time.sleep(3)
            
            # 글쓰기 버튼 클릭
            write_button = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "button.bandCreatePost"))
            )
            write_button.click()
            time.sleep(2)
            
            # URL 입력
            text_area = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.commentBox"))
            )
            text_area.send_keys("https://testpro.site/%ED%83%80%EB%A1%9C/index.html")
            time.sleep(2)
            
            # URL 삭제
            text_area.send_keys(Keys.CONTROL + "a")
            text_area.send_keys(Keys.DELETE)
            time.sleep(1)
            
            # 게시 버튼 클릭
            post_button = self.driver.find_element(By.CSS_SELECTOR, "button.submitBtn")
            post_button.click()
            
            # 해시태그 선택 팝업 대기
            hashtag_popup = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".hashtag_layer"))
            )
            
            # 첫 번째 해시태그 선택
            first_hashtag = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".hashtag_item:first-child"))
            )
            first_hashtag.click()
            
            # 확인 버튼 클릭
            confirm_button = self.driver.find_element(By.CSS_SELECTOR, ".uButton.-confirm")
            confirm_button.click()
            
            print(f"게시 완료: {band_url}")
            time.sleep(10)
            
        except Exception as e:
            print(f"게시 실패: {str(e)}")
            raise e

    def post_to_all_bands(self):
        try:
            self.login()
            
            # 밴드 메인으로 이동
            self.driver.get("https://band.us/")
            time.sleep(3)
            
            # 가입한 밴드 목록 가져오기
            band_links = WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.link"))
            )
            
            band_urls = []
            for link in band_links:
                href = link.get_attribute('href')
                if href and 'band.us/band/' in href:
                    band_urls.append(href)
            
            print(f"총 {len(band_urls)}개의 밴드를 발견했습니다.")
            
            # 각 밴드에 글쓰기
            for band_url in band_urls:
                self.post_to_band(band_url)
                
        except Exception as e:
            print(f"전체 프로세스 실패: {str(e)}")
        finally:
            self.driver.quit()

if __name__ == "__main__":
    try:
        poster = BandAutoPost()
        poster.post_to_all_bands()
    except Exception as e:
        print(f"프로그램 실행 실패: {str(e)}")