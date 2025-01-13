import tkinter as tk
from tkinter import ttk, messagebox, filedialog  # 파일 선택 대화상자 추가
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains  # 추가된 import
import pyperclip  # 추가된 import
import time
import threading
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup
import json
import os
import datetime
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class BandAutoGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("밴드 자동 포스팅")
        self.root.geometry("500x700")  # 높이 증가
        self.poster = BandAutoPoster(self)
        self.save_dir = os.path.join(self.poster.script_dir, '저장')
        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)
        self.setup_gui()

    def setup_gui(self):
        # 설정 프레임
        settings_frame = ttk.LabelFrame(self.root, text="설정", padding=10)
        settings_frame.pack(fill=tk.X, padx=5, pady=5)

        # 이메일 설정
        ttk.Label(settings_frame, text="이메일:").grid(row=0, column=0, sticky=tk.W)
        self.email_var = tk.StringVar(value=self.poster.config.get('email', ''))
        ttk.Entry(settings_frame, textvariable=self.email_var).grid(row=0, column=1, sticky=tk.EW)

        # 비밀번호 설정
        ttk.Label(settings_frame, text="비밀번호:").grid(row=1, column=0, sticky=tk.W)
        self.password_var = tk.StringVar(value=self.poster.config.get('password', ''))
        ttk.Entry(settings_frame, textvariable=self.password_var, show="*").grid(row=1, column=1, sticky=tk.EW)

        # URL 설정
        ttk.Label(settings_frame, text="포스팅 URL:").grid(row=2, column=0, sticky=tk.W)
        self.url_var = tk.StringVar(value=self.poster.config.get('post_url', ''))
        ttk.Entry(settings_frame, textvariable=self.url_var).grid(row=2, column=1, sticky=tk.EW)

        # 제목 설정 (추가)
        ttk.Label(settings_frame, text="포스팅 제목:").grid(row=3, column=0, sticky=tk.W)
        self.title_var = tk.StringVar(value=self.poster.config.get('title', ''))
        ttk.Entry(settings_frame, textvariable=self.title_var).grid(row=3, column=1, sticky=tk.EW)

        # 게시 시간 설정 (추가)
        ttk.Label(settings_frame, text="게시 시간(HH:MM):").grid(row=4, column=0, sticky=tk.W)
        self.post_time_var = tk.StringVar(value=self.poster.config.get('post_time', '09:00'))
        ttk.Entry(settings_frame, textvariable=self.post_time_var).grid(row=4, column=1, sticky=tk.EW)

        # 간격 설정
        ttk.Label(settings_frame, text="실행 간격(시간):").grid(row=5, column=0, sticky=tk.W)
        self.interval_var = tk.StringVar(value=str(self.poster.config.get('interval_hours', 24)))
        ttk.Entry(settings_frame, textvariable=self.interval_var).grid(row=5, column=1, sticky=tk.EW)

        # 저장/불러오기 프레임 추가
        save_frame = ttk.LabelFrame(self.root, text="포스팅 저장/불러오기", padding=10)
        save_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # 저장 버튼
        save_btn = ttk.Button(save_frame, text="현재 내용 저장", command=self.save_posting)
        save_btn.pack(side=tk.LEFT, padx=5)
        
        # 불러오기 버튼
        load_btn = ttk.Button(save_frame, text="저장된 내용 불러오기", command=self.load_posting)
        load_btn.pack(side=tk.LEFT, padx=5)

        # 상태 표시
        self.status_var = tk.StringVar(value="대기 중...")
        ttk.Label(self.root, textvariable=self.status_var).pack(pady=5)

        # 버튼 프레임
        btn_frame = ttk.Frame(self.root)
        btn_frame.pack(fill=tk.X, padx=5, pady=5)

        # 시작/중지 버튼
        self.start_btn = ttk.Button(btn_frame, text="시작", command=self.start_posting)
        self.start_btn.pack(side=tk.LEFT, padx=5)
        self.stop_btn = ttk.Button(btn_frame, text="중지", command=self.stop_posting, state=tk.DISABLED)
        self.stop_btn.pack(side=tk.LEFT, padx=5)

        # 설정 저장 버튼
        ttk.Button(btn_frame, text="설정 저장", command=self.save_config).pack(side=tk.RIGHT, padx=5)

        # 로그 영역 추가
        log_frame = ttk.LabelFrame(self.root, text="로그", padding=10)
        log_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 로그 텍스트 영역
        self.log_text = tk.Text(log_frame, height=10, wrap=tk.WORD)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        # 스크롤바 추가
        scrollbar = ttk.Scrollbar(log_frame, orient="vertical", command=self.log_text.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        
        # 복사 버튼 추가
        copy_btn = ttk.Button(log_frame, text="로그 복사", command=self.copy_log)
        copy_btn.pack(pady=5)

    def copy_log(self):
        log_content = self.log_text.get("1.0", tk.END)
        self.root.clipboard_clear()
        self.root.clipboard_append(log_content)
        messagebox.showinfo("알림", "로그가 클립보드에 복사되었습니다.")

    def save_posting(self):
        try:
            title = self.title_var.get()
            email = self.email_var.get()
            
            if not title:
                messagebox.showerror("오류", "포스팅 제목을 입력해주세요.")
                return
                
            if not email:
                messagebox.showerror("오류", "이메일 주소를 입력해주세요.")
                return
            
            # 이메일 주소로 폴더 생성
            email_dir = os.path.join(self.save_dir, email)
            if not os.path.exists(email_dir):
                os.makedirs(email_dir)
                
            # 제목으로 파일명 생성 (특수문자 제거)
            filename = "".join(x for x in title if x.isalnum() or x in [' ', '-', '_']).strip()
            filename = f"{filename}.json"
            filepath = os.path.join(email_dir, filename)
            
            # 저장할 데이터
            save_data = {
                'email': self.email_var.get(),
                'password': self.password_var.get(),
                'post_url': self.url_var.get(),
                'title': self.title_var.get(),
                'post_time': self.post_time_var.get(),
                'interval_hours': self.interval_var.get(),
                'saved_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(save_data, f, ensure_ascii=False, indent=4)
                
            messagebox.showinfo("알림", f"저장 완료:\n{filepath}")
            
        except Exception as e:
            messagebox.showerror("오류", f"저장 실패: {str(e)}")

    def load_posting(self):
        try:
            # Windows 스타일 파일 선택 대화상자
            filepath = filedialog.askopenfilename(
                initialdir=self.save_dir,
                title="저장된 포스팅 불러오기",
                filetypes=(("JSON 파일", "*.json"), ("모든 파일", "*.*")),
                parent=self.root
            )
            
            if filepath:
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # 모든 설정값 복원
                    self.email_var.set(data.get('email', ''))
                    self.password_var.set(data.get('password', ''))
                    self.url_var.set(data.get('post_url', ''))
                    self.title_var.set(data.get('title', ''))
                    self.post_time_var.set(data.get('post_time', '09:00'))
                    self.interval_var.set(data.get('interval_hours', '24'))
                    
                    saved_date = data.get('saved_date', '알 수 없음')
                    messagebox.showinfo("알림", f"포스팅 내용을 불러왔습니다.\n저장 날짜: {saved_date}")
                    
                except Exception as e:
                    messagebox.showerror("오류", f"파일 읽기 실패: {str(e)}")
            
        except Exception as e:
            messagebox.showerror("오류", f"불러오기 실패: {str(e)}")

    def save_config(self):
        try:
            config = {
                'email': self.email_var.get(),
                'password': self.password_var.get(),
                'post_url': self.url_var.get(),
                'title': self.title_var.get(),  # 추가
                'post_time': self.post_time_var.get(),  # 추가
                'interval_hours': int(self.interval_var.get()),
                'bands': self.poster.config.get('bands', [])
            }
            self.poster.save_config(config)
            messagebox.showinfo("알림", "설정이 저장되었습니다.")
        except Exception as e:
            messagebox.showerror("오류", f"설정 저장 실패: {str(e)}")

    def start_posting(self):
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        threading.Thread(target=self.poster.start_posting, daemon=True).start()

    def stop_posting(self):
        self.poster.stop_posting()
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)

    def update_status(self, message):
        self.status_var.set(message)
        # 로그에 타임스탬프와 함께 메시지 추가
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        self.log_text.insert(tk.END, log_message)
        self.log_text.see(tk.END)  # 자동 스크롤

    def run(self):
        self.root.mainloop()

class BandAutoPoster:
    def __init__(self, gui):
        self.gui = gui
        self.driver = None
        self.running = False
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.config = self.load_config()

    def load_config(self):
        try:
            config_path = os.path.join(self.script_dir, 'config.json')
            if not os.path.exists(config_path):
                # 기본 설정 파일 생성
                default_config = {
                    "email": "your_email@example.com",
                    "password": "your_password",
                    "post_url": "https://example.com/content-to-share",
                    "title": "포스팅 제목",  # 추가
                    "post_time": "09:00",  # 추가
                    "interval_hours": 24,
                    "bands": [
                        {
                            "name": "첫번째 밴드",
                            "url": "https://band.us/band/your_first_band_id"
                        }
                    ]
                }
                with open(config_path, 'w', encoding='utf-8') as f:
                    json.dump(default_config, f, ensure_ascii=False, indent=4)
                print(f"설정 파일이 생성되었습니다: {config_path}")
                print("config.json 파일을 수정한 후 다시 실행해주세요.")
                exit(1)
                
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            # 필수 설정 확인
            required_fields = ['email', 'password', 'post_url', 'bands']
            for field in required_fields:
                if field not in config:
                    raise ValueError(f"설정 파일에 '{field}' 항목이 없습니다.")
                    
            return config
            
        except Exception as e:
            print(f"설정 파일 로드 중 오류 발생: {str(e)}")
            exit(1)

    def setup_driver(self):
        try:
            # Chrome 프로필 경로 설정
            profile_path = os.path.join(self.script_dir, 'chrome_profile')
            if not os.path.exists(profile_path):
                os.makedirs(profile_path)

            options = webdriver.ChromeOptions()
            options.add_argument('--start-maximized')
            options.add_argument('--disable-gpu')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument(f'--user-data-dir={profile_path}')  # 프로필 경로 추가
            options.add_argument('--profile-directory=Default')
            options.add_experimental_option('excludeSwitches', ['enable-logging'])
            
            # 2단계 인증 관련 설정
            options.add_argument('--enable-features=NetworkService,NetworkServiceInProcess')
            options.add_experimental_option('prefs', {
                'credentials_enable_service': True,
                'profile.password_manager_enabled': True
            })
            
            # 드라이버 설정
            service = Service()
            self.driver = webdriver.Chrome(service=service, options=options)
            
            # 드라이버 시작 확인
            self.driver.get('https://band.us')
            time.sleep(2)
            
            return True
            
        except Exception as e:
            error_msg = str(e)
            self.gui.update_status(f"Chrome 드라이버 오류: {error_msg}")
            if "chromedriver" in error_msg.lower():
                self.gui.update_status("Chrome 드라이버를 재설치합니다...")
                os.system('setup_chrome.bat')
            return False

    def login(self):
        try:
            self.driver.get('https://auth.band.us/login')
            time.sleep(3)
            
            # 이메일로 로그인 버튼 찾기 및 클릭
            try:
                email_login_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, '.uButtonRound.-h56.-icoType.-email'))
                )
                self.gui.update_status("이메일 로그인 버튼 찾음")
                email_login_btn.click()
                time.sleep(2)
            except Exception as e:
                self.gui.update_status(f"이메일 로그인 버튼을 찾을 수 없습니다: {str(e)}")
                raise

            # 이메일 입력
            try:
                email_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.ID, 'input_email'))
                )
                email_input.clear()
                self.gui.update_status("이메일 입력 중...")
                email_input.send_keys(self.config['email'])
                
                # 이메일 확인 버튼 클릭 (새로운 셀렉터)
                email_confirm_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, '.uBtn.-tcType.-confirm'))
                )
                email_confirm_btn.click()
                self.gui.update_status("이메일 확인")
                time.sleep(2)
            except Exception as e:
                self.gui.update_status(f"이메일 입력 또는 확인 버튼 클릭 실패: {str(e)}")
                raise

            # 비밀번호 입력 (수정된 셀렉터)
            try:
                # 비밀번호 입력창이 나타날 때까지 대기
                pw_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.ID, 'pw'))
                )
                pw_input.clear()
                self.gui.update_status("비밀번호 입력 중...")
                pw_input.send_keys(self.config['password'])
                
                # 비밀번호 확인 버튼 클릭
                pw_confirm_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, '.uBtn.-tcType.-confirm'))
                )
                pw_confirm_btn.click()
                self.gui.update_status("비밀번호 확인")
                time.sleep(3)
            except Exception as e:
                self.gui.update_status(f"비밀번호 입력 또는 확인 버튼 클릭 실패: {str(e)}")
                raise

            # 로그인 성공 여부 확인
            if 'auth.band.us/login' in self.driver.current_url:
                raise Exception("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
            
            self.gui.update_status("로그인 성공")
            
        except Exception as e:
            error_msg = str(e)
            self.gui.update_status(f"로그인 중 오류 발생: {error_msg}")
            raise e

    def get_url_content(self, url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # meta 태그에서 description 추출
        description = soup.find('meta', {'name': 'description'})
        if (description):
            return description.get('content', '')
        return url

    def get_band_list(self):
        """피드 페이지에서 밴드 목록을 가져오고 URL 기준으로 정렬합니다."""
        try:
            self.driver.get('https://band.us/feed')
            time.sleep(3)
            
            # 밴드 목록 가져오기
            band_list = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ul[data-viewname="DMyGroupBandBannerView.MyGroupBandListView"]'))
            )
            
            # 모든 밴드 항목 찾기
            band_items = band_list.find_elements(By.CSS_SELECTOR, 'li[data-viewname="DMyGroupBandListItemView"]')
            band_elements = []
            
            for item in band_items:
                try:
                    band_link = item.find_element(By.CSS_SELECTOR, 'a.itemMyBand')
                    band_name = item.find_element(By.CSS_SELECTOR, 'span.body strong.ellipsis').text.strip()
                    band_url = band_link.get_attribute('href')
                    
                    if band_url and band_name:
                        band_elements.append({
                            'url': band_url,
                            'name': band_name,
                            'element': band_link
                        })
                        self.gui.update_status(f"밴드 발견: {band_name} ({band_url})")
                except Exception as e:
                    continue
            
            # URL 기준으로 내림차순 정렬 (높은 숫자가 먼저 오도록)
            band_elements.sort(key=lambda x: int(x['url'].split('/')[-1]), reverse=True)
            
            total = len(band_elements)
            if total > 0:
                self.gui.update_status(f"총 {total}개의 밴드를 찾았습니다.")
                self.gui.update_status(f"첫 번째 밴드: {band_elements[0]['name']} ({band_elements[0]['url']})")
                self.gui.update_status(f"마지막 밴드: {band_elements[-1]['name']} ({band_elements[-1]['url']})")
            else:
                self.gui.update_status("밴드를 찾을 수 없습니다.")
            
            return band_elements
            
        except Exception as e:
            self.gui.update_status(f"밴드 목록 가져오기 실패: {str(e)}")
            return []

    def navigate_to_band(self, band_info):
        """밴드로 이동합니다."""
        try:
            self.driver.get('https://band.us/feed')
            time.sleep(3)
            
            # 밴드 목록 찾기
            band_list = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'ul[data-viewname="DMyGroupBandBannerView.MyGroupBandListView"]'))
            )
            
            # 특정 밴드 항목 찾기
            band_item = band_list.find_element(By.CSS_SELECTOR, 
                f'li[data-viewname="DMyGroupBandListItemView"] a.itemMyBand[href="{band_info["url"].replace("https://band.us", "")}"]'
            )
            
            self.gui.update_status(f"'{band_info['name']}' 밴드로 이동 중...")
            self.driver.execute_script("arguments[0].click();", band_item)  # JavaScript로 클릭 실행
            time.sleep(3)
            
            # 밴드 페이지 로딩 확인
            if band_info["url"].split("/")[-1] in self.driver.current_url:
                self.gui.update_status(f"'{band_info['name']}' 밴드 페이지 로딩 완료")
                return True
            else:
                raise Exception("밴드 페이지 이동 실패")
            
        except Exception as e:
            self.gui.update_status(f"밴드 이동 실패: {str(e)}")
            return False

    def post_to_band(self, band_info):
        try:
            # 밴드로 이동
            if not self.navigate_to_band(band_info):
                return False
                
            # 현재 GUI에서 설정된 URL 가져오기 (수정된 부분)
            post_url = self.gui.url_var.get()
            if not post_url:
                raise Exception("포스팅 URL이 설정되지 않았습니다")
            
            self.gui.update_status(f"포스팅 URL: {post_url}")
                
            # 글쓰기 버튼 찾기
            write_selectors = [
                'button._btnPostWrite',
                'button.uButton.-sizeL.-confirm.sf_bg',
                'button[type="button"][class*="_btnPostWrite"]'
            ]
            
            write_btn = None
            for selector in write_selectors:
                try:
                    write_btn = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    break
                except:
                    continue
                    
            if not write_btn:
                raise Exception("글쓰기 버튼을 찾을 수 없습니다")
                
            self.driver.execute_script("arguments[0].click();", write_btn)
            time.sleep(2)
            
            # 글 작성 영역 찾기 (수정된 부분)
            try:
                self.gui.update_status("에디터 찾는 중...")
                editor = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div[contenteditable="true"]'))
                )
                
                # 제목 입력 (추가)
                title = self.gui.title_var.get()
                if title:
                    editor.send_keys(title)
                    ActionChains(self.driver).send_keys(Keys.ENTER).perform()
                    time.sleep(1)
                
                # URL 입력 과정
                post_url = self.gui.url_var.get()
                self.gui.update_status(f"URL 입력 시작: {post_url}")
                
                # 에디터 클릭 및 URL 붙여넣기
                editor.click()
                editor.clear()  # 기존 내용 클리어
                editor.send_keys(post_url)
                time.sleep(1)
                
                # 엔터 입력
                ActionChains(self.driver).send_keys(Keys.ENTER).perform()
                self.gui.update_status("URL 입력 및 엔터 완료")
                
                # 7초 대기
                self.gui.update_status("미리보기 로딩 대기 중 (7초)...")
                time.sleep(7)
                
                # URL 텍스트만 정확히 삭제 (수정된 부분)
                self.gui.update_status("URL 텍스트 삭제 중...")
                editor.click()
                
                # JavaScript로 정확한 URL 텍스트만 삭제
                self.driver.execute_script("""
                    var editor = arguments[0];
                    var url = arguments[1];
                    
                    // 현재 내용에서 URL 텍스트만 찾아서 삭제
                    editor.innerHTML = editor.innerHTML.replace(url, '');
                    
                    // 줄바꿈 문자도 삭제
                    editor.innerHTML = editor.innerHTML.replace(/^\\n|\\n$/g, '');
                    editor.innerHTML = editor.innerHTML.trim();
                    
                    // 변경 이벤트 발생
                    editor.dispatchEvent(new Event('input', { bubbles: true }));
                """, editor, post_url)
                
                time.sleep(1)
                
                # 게시 버튼 클릭
                submit_btn = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-sizeM._btnSubmitPost.-confirm'))
                )
                
                submit_btn.click()
                self.gui.update_status("게시 완료")
                time.sleep(3)
                
                return True
                
            except Exception as e:
                self.gui.update_status(f"글 작성 실패: {str(e)}")
                raise
                
        except Exception as e:
            self.gui.update_status(f"{band_info['name']} 밴드 글 작성 실패: {str(e)}")
            try:
                self.driver.get('https://band.us/feed')
                time.sleep(3)
            except:
                pass
            return False

    def run_posting(self):
        try:
            retry_count = 0
            while retry_count < 3:
                if self.setup_driver():
                    break
                retry_count += 1
                time.sleep(5)
                
            if not self.driver:
                raise Exception("브라우저를 시작할 수 없습니다")
                
            self.login()
            
            # 밴드 목록 가져오기
            bands = self.get_band_list()
            if not bands:
                raise Exception("작성할 밴드가 없습니다.")
            
            self.gui.update_status(f"총 {len(bands)}개의 밴드에 순차적으로 글을 작성합니다.")
            success_count = 0
            
            # URL 번호가 큰 순서대로 글 작성
            for i, band in enumerate(bands, 1):
                self.gui.update_status(f"[{i}/{len(bands)}] {band['name']} ({band['url']}) 밴드 작성 시작...")
                if self.post_to_band(band):
                    success_count += 1
                    self.gui.update_status(f"밴드 작성 완료: {band['name']}")
                time.sleep(10)  # 다음 밴드로 넘어가기 전 10초 대기
            
            self.gui.update_status(f"모든 밴드 작성 완료 (성공: {success_count}, 실패: {len(bands)-success_count})")
            
        except Exception as e:
            self.gui.update_status(f"실행 중 오류 발생: {str(e)}")
            if self.driver:
                self.driver.quit()
            raise e

    def save_config(self, config):
        config_path = os.path.join(self.script_dir, 'config.json')
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=4)
        self.config = config

    def start_posting(self):
        self.running = True
        while self.running:
            try:
                # 현재 시간과 설정된 시간 비교
                now = datetime.datetime.now()
                post_time = self.gui.post_time_var.get()
                try:
                    hour, minute = map(int, post_time.split(':'))
                    target_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                    
                    # 설정 시간이 지났다면 다음 날로 설정
                    if now > target_time:
                        target_time += datetime.timedelta(days=1)
                    
                    # 설정 시간까지 대기
                    wait_seconds = (target_time - now).total_seconds()
                    if wait_seconds > 0:
                        self.gui.update_status(f"다음 게시 시간({post_time})까지 {int(wait_seconds/60)}분 대기")
                        time.sleep(wait_seconds)
                except ValueError:
                    self.gui.update_status("잘못된 시간 형식입니다. HH:MM 형식으로 입력해주세요.")
                    return

                self.gui.update_status("포스팅 시작...")
                self.run_posting()
                
                if self.running:
                    self.gui.update_status(f"다음 포스팅까지 {self.config['interval_hours']}시간 대기")
                    time.sleep(self.config['interval_hours'] * 3600)
            except Exception as e:
                self.gui.update_status(f"오류 발생: {str(e)}\n1분 후 재시도합니다.")
                time.sleep(60)

    def stop_posting(self):
        self.running = False
        self.gui.update_status("중지됨")
        if self.driver:
            self.driver.quit()

if __name__ == "__main__":
    gui = BandAutoGUI()
    gui.run()
