import sys
import tkinter as tk
import pyautogui  # 추가된 import
from tkinter import ttk, messagebox, filedialog  # 파일 선택 대화상자 추가
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains  # 추가된 import
import time
import threading
import json
import os
import datetime
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import shutil  # shutil 모듈 추가
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import random  # 추가된 import
from bs4 import BeautifulSoup  # 새로 추가

class EmailListManager:
    def __init__(self, parent, script_dir):
        self.parent = parent
        # 실행 파일 경로 기준으로 설정
        if getattr(sys, 'frozen', False):
            self.script_dir = os.path.dirname(sys.executable)
        else:
            self.script_dir = script_dir
        self.email_list_path = os.path.join(self.script_dir, 'email_list.json')
        self.email_list = self.load_email_list()

    def load_email_list(self):
        try:
            if os.path.exists(self.email_list_path):
                with open(self.email_list_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"이메일 목록 로드 실패: {str(e)}")
            return []

    def save_email_list(self):
        try:
            with open(self.email_list_path, 'w', encoding='utf-8') as f:
                json.dump(self.email_list, f, ensure_ascii=False, indent=4)
        except Exception as e:
            print(f"이메일 목록 저장 실패: {str(e)}")

    def show_email_manager(self):
        email_window = tk.Toplevel(self.parent)
        email_window.title("이메일 계정 관리")
        email_window.geometry("400x500")

        # 리스트박스
        listbox_frame = ttk.Frame(email_window)
        listbox_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        self.email_listbox = tk.Listbox(listbox_frame)
        self.email_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        scrollbar = ttk.Scrollbar(listbox_frame, orient=tk.VERTICAL, command=self.email_listbox.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.email_listbox.config(yscrollcommand=scrollbar.set)

        # 입력 필드
        input_frame = ttk.Frame(email_window)
        input_frame.pack(fill=tk.X, padx=5, pady=5)

        ttk.Label(input_frame, text="이메일:").grid(row=0, column=0, sticky=tk.W)
        self.email_var = tk.StringVar()
        ttk.Entry(input_frame, textvariable=self.email_var).grid(row=0, column=1, sticky=tk.EW)

        ttk.Label(input_frame, text="비밀번호:").grid(row=1, column=0, sticky=tk.W)
        self.password_var = tk.StringVar()
        ttk.Entry(input_frame, textvariable=self.password_var, show="*").grid(row=1, column=1, sticky=tk.EW)

        # 버튼 프레임
        btn_frame = ttk.Frame(email_window)
        btn_frame.pack(fill=tk.X, padx=5, pady=5)

        ttk.Button(btn_frame, text="추가", command=self.add_email).pack(side=tk.LEFT, padx=2)
        ttk.Button(btn_frame, text="수정", command=self.edit_email).pack(side=tk.LEFT, padx=2)
        ttk.Button(btn_frame, text="삭제", command=self.delete_email).pack(side=tk.LEFT, padx=2)
        ttk.Button(btn_frame, text="선택", command=lambda: self.select_email(email_window)).pack(side=tk.RIGHT, padx=2)

        self.refresh_email_list()
        
        # 리스트박스 선택 이벤트 바인딩
        self.email_listbox.bind('<<ListboxSelect>>', self.on_select_email)

    def refresh_email_list(self):
        self.email_listbox.delete(0, tk.END)
        for email in self.email_list:
            self.email_listbox.insert(tk.END, email['email'])

    def on_select_email(self, event):
        if self.email_listbox.curselection():
            index = self.email_listbox.curselection()[0]
            email_data = self.email_list[index]
            self.email_var.set(email_data['email'])
            self.password_var.set(email_data['password'])

    def add_email(self):
        email = self.email_var.get().strip()
        password = self.password_var.get().strip()
        
        if not email or not password:
            messagebox.showerror("오류", "이메일과 비밀번호를 모두 입력하세요.")
            return
            
        self.email_list.append({'email': email, 'password': password})
        self.save_email_list()
        self.refresh_email_list()
        
        # 입력 필드 초기화
        self.email_var.set('')
        self.password_var.set('')

    def edit_email(self):
        if not self.email_listbox.curselection():
            messagebox.showerror("오류", "수정할 계정을 선택하세요.")
            return
            
        index = self.email_listbox.curselection()[0]
        email = self.email_var.get().strip()
        password = self.password_var.get().strip()
        
        if not email or not password:
            messagebox.showerror("오류", "이메일과 비밀번호를 모두 입력하세요.")
            return
            
        self.email_list[index] = {'email': email, 'password': password}
        self.save_email_list()
        self.refresh_email_list()

    def delete_email(self):
        if not self.email_listbox.curselection():
            messagebox.showerror("오류", "삭제할 계정을 선택하세요.")
            return
            
        if messagebox.askyesno("확인", "선택한 계정을 삭제하시겠습니까?"):
            index = self.email_listbox.curselection()[0]
            del self.email_list[index]
            self.save_email_list()
            self.refresh_email_list()
            
            # 입력 필드 초기화
            self.email_var.set('')
            self.password_var.set('')

    def select_email(self, window):
        if not self.email_listbox.curselection():
            messagebox.showerror("오류", "계정을 선택하세요.")
            return
            
        index = self.email_listbox.curselection()[0]
        selected_email = self.email_list[index]
        
        # GUI의 이메일/비밀번호 필드 업데이트
        self.parent.email_var.set(selected_email['email'])
        self.parent.password_var.set(selected_email['password'])
        
        window.destroy()

class BandAutoGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("밴드 자동 포스팅")
        self.root.geometry("500x900")  # 높이 증가
        
        # 실행 파일 위치 기준으로 경로 설정
        if getattr(sys, 'frozen', False):
            self.script_dir = os.path.dirname(sys.executable)
        else:
            self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 상태 변수 먼저 초기화
        self.status_var = tk.StringVar(value="대기 중...")
        
        self.poster = BandAutoPoster(self)
        self.save_dir = os.path.join(self.script_dir, 'saved_posts')
        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)
        self.email_manager = EmailListManager(self.root, self.script_dir)
        self.email_list_frame = None
        self.email_listbox = None
        self.current_email = None
        self.account_switch_var = tk.BooleanVar(value=False)  # 계정 전환 설정 추가
        self.leave_small_band_var = tk.BooleanVar(value=True)  # 50명 미만 밴드 탈퇴 설정 추가
        self.setup_gui()
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)  # 창 닫기 이벤트 처리기 추가

    def setup_gui(self):
        # 메인 프레임 (좌우 분할)
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True)

        # 왼쪽 프레임 (설정)
        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # 오른쪽 프레임 (이메일 리스트)
        right_frame = ttk.LabelFrame(main_frame, text="이메일 계정 목록")
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, padx=5, pady=5)

        # 이메일 리스트박스
        self.email_listbox = tk.Listbox(right_frame, width=30)
        self.email_listbox.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        self.email_listbox.bind('<Double-Button-1>', self.on_email_select)
        
        # 이메일 목록 로드는 GUI 구성이 완료된 후 호출
        self.root.after(100, self.load_email_list)  # 100ms 후 로드

        # 기존 설정 프레임은 왼쪽 프레임에 배치
        settings_frame = ttk.LabelFrame(left_frame, text="설정", padding=10)
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
        ttk.Label(settings_frame, text="게시 간격(HH:MM):").grid(row=4, column=0, sticky=tk.W)  # 레이블 텍스트만 변경
        self.post_time_var = tk.StringVar(value=self.poster.config.get('post_time', '00:30'))  # 기본값 30분으로 변경
        ttk.Entry(settings_frame, textvariable=self.post_time_var).grid(row=4, column=1, sticky=tk.EW)

        # 간격 설정
        ttk.Label(settings_frame, text="실행 간격(시간):").grid(row=5, column=0, sticky=tk.W)
        self.interval_var = tk.StringVar(value=str(self.poster.config.get('interval_hours', 24)))
        ttk.Entry(settings_frame, textvariable=self.interval_var).grid(row=5, column=1, sticky=tk.EW)

        # 이메일 관리 버튼 추가
        email_manage_btn = ttk.Button(settings_frame, text="이메일 계정 관리", 
                                    command=self.email_manager.show_email_manager)
        email_manage_btn.grid(row=6, column=0, columnspan=2, pady=5)

        # 포스팅 제한 설정 프레임 추가
        posting_limits_frame = ttk.LabelFrame(left_frame, text="포스팅 제한 설정", padding=10)
        posting_limits_frame.pack(fill=tk.X, padx=5, pady=5)

        # 계정당 최대 포스팅 횟수 설정
        ttk.Label(posting_limits_frame, text="계정당 최대 포스팅 횟수:").grid(row=0, column=0, sticky=tk.W)
        self.max_posts_var = tk.StringVar(value=str(self.poster.config.get('max_posts_per_account', 80)))
        ttk.Entry(posting_limits_frame, textvariable=self.max_posts_var).grid(row=0, column=1, sticky=tk.EW)

        # 다음 밴드 대기 시간 설정
        ttk.Label(posting_limits_frame, text="다음 밴드 대기시간(분):").grid(row=1, column=0, sticky=tk.W)
        self.next_band_wait_var = tk.StringVar(value=str(self.poster.config.get('next_band_wait_minutes', 7)))
        ttk.Entry(posting_limits_frame, textvariable=self.next_band_wait_var).grid(row=1, column=1, sticky=tk.EW)

        # 포스팅 제한 설정 프레임 내부에 계정 전환 설정 추가
        ttk.Checkbutton(posting_limits_frame, text="계정 자동 전환", 
                       variable=self.account_switch_var).grid(row=2, column=0, 
                       columnspan=2, sticky=tk.W)

        # 포스팅 제한 설정 프레임 내부에 50명 미만 밴드 탈퇴 설정 추가
        ttk.Checkbutton(posting_limits_frame, text="50명 미만 밴드 자동 탈퇴", 
                       variable=self.leave_small_band_var).grid(row=3, column=0, 
                       columnspan=2, sticky=tk.W)

        # 저장/불러오기 프레임 수정
        save_frame = ttk.LabelFrame(self.root, text="포스팅 저장/불러오기", padding=10)
        save_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # 기본 저장 버튼
        save_btn = ttk.Button(save_frame, text="저장", command=lambda: self.save_posting())
        save_btn.pack(side=tk.LEFT, padx=5)
        
        # 다른 이름으로 저장 버튼
        save_as_btn = ttk.Button(save_frame, text="다른 이름으로 저장", command=lambda: self.save_posting(save_as=True))
        save_as_btn.pack(side=tk.LEFT, padx=5)
        
        # 불러오기 버튼
        load_btn = ttk.Button(save_frame, text="불러오기", command=self.load_posting)
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
        self.log_text.pack(fill=tk.BOTH, expand=True)  # expand=True로 수정
        
        # 스크롤바 추가
        scrollbar = ttk.Scrollbar(log_frame, orient="vertical", command=self.log_text.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        
        # 복사 버튼 추가
        copy_btn = ttk.Button(log_frame, text="로그 복사", command=self.copy_log)
        copy_btn.pack(pady=5)

        # GitHub 관련 프레임 제거하고 Post URL 목록 프레임 추가
        url_list_frame = ttk.LabelFrame(self.root, text="포스팅 URL & 제목 목록", padding=10)
        url_list_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # URL과 제목 입력 필드를 위한 Canvas와 Scrollbar
        canvas = tk.Canvas(url_list_frame)
        scrollbar = ttk.Scrollbar(url_list_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # URL과 제목 입력 필드 생성 (100개)
        self.url_entries = {}
        self.title_entries = {}  # 제목 입력 필드 추가
        for i in range(1, 101):
            url_key = f'post_url_{i}'
            title_key = f'post_title_{i}'  # 제목 키 추가
            frame = ttk.Frame(scrollable_frame)
            frame.pack(fill=tk.X, padx=5, pady=2)
            
            # URL 레이블과 입력 필드
            ttk.Label(frame, text=f"URL {i}:").pack(side=tk.LEFT)
            url_entry = ttk.Entry(frame)
            url_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(5,5))
            url_entry.insert(0, self.poster.config.get(url_key, ''))
            self.url_entries[url_key] = url_entry

            # 제목 레이블과 입력 필드
            ttk.Label(frame, text="제목:").pack(side=tk.LEFT)
            title_entry = ttk.Entry(frame)
            title_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(5,0))
            title_entry.insert(0, self.poster.config.get(title_key, ''))
            self.title_entries[title_key] = title_entry

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Canvas 높이 제한
        canvas.configure(height=300)

    def copy_log(self):
        log_content = self.log_text.get("1.0", tk.END)
        self.root.clipboard_clear()
        self.root.clipboard_append(log_content)
        messagebox.showinfo("알림", "로그가 클립보드에 복사되었습니다.")

    def save_posting(self, save_as=False):
        try:
            title = self.title_var.get()
            email = self.email_var.get()
            
            if not title:
                messagebox.showerror("오류", "포스팅 제목을 입력해주세요.")
                return
            
            if not email and not save_as:
                messagebox.showerror("오류", "이메일 주소를 입력해주세요.")
                return
            
            # 저장할 데이터 준비
            save_data = {
                'email': self.email_var.get(),
                'password': self.email_var.get(),
                'post_url': self.url_var.get(),
                'title': self.title_var.get(),
                'post_time': self.post_time_var.get(),
                'interval_hours': self.interval_var.get(),
                'saved_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            if save_as:
                # 다른 이름으로 저장 - 폴더 선택 대화상자
                save_dir = filedialog.askdirectory(
                    initialdir=self.save_dir,
                    title="저장할 폴더 선택"
                )
                
                if not save_dir:  # 취소한 경우
                    return
                    
                # 파일명 생성
                filename = "".join(x for x in title if x.isalnum() or x in [' ', '-', '_']).strip()
                filename = f"{filename}.json"
                filepath = os.path.join(save_dir, filename)
                
            else:
                # 기본 저장 - 이메일 폴더에 저장
                email_dir = os.path.join(self.save_dir, email)
                if not os.path.exists(email_dir):
                    os.makedirs(email_dir)
                
                filename = "".join(x for x in title if x.isalnum() or x in [' ', '-', '_']).strip()
                filename = f"{filename}.json"
                filepath = os.path.join(email_dir, filename)
            
            # 파일 저장
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
            # URL과 제목 입력값 저장
            url_config = {}
            for key, entry in self.url_entries.items():
                url_config[key] = entry.get().strip()
                
            # 제목 설정 저장 추가
            title_config = {}
            for key, entry in self.title_entries.items():
                title_config[key] = entry.get().strip()
            
            config = {
                'email': self.email_var.get(),
                'password': self.email_var.get(),
                'title': self.title_var.get(),
                'post_time': self.post_time_var.get(),
                'interval_hours': int(self.interval_var.get()),
                'max_posts_per_account': int(self.max_posts_var.get()),  # 추가
                'next_band_wait_minutes': int(self.next_band_wait_var.get()),  # 추가
                'account_switch': self.account_switch_var.get(),  # 계정 전환 설정 저장
                'leave_small_band': self.leave_small_band_var.get(),  # 50명 미만 밴드 탈퇴 설정 저장
                'bands': self.poster.config.get('bands', []),
                **url_config,  # URL 설정
                **title_config  # 제목 설정 추가
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
        """상태 업데이트 및 로그 파일에 기록"""
        # GUI 상태 표시 업데이트
        self.status_var.set(message)
        
        # 로그 텍스트 영역에 메시지 추가 
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        self.log_text.insert(tk.END, log_message)
        self.log_text.see(tk.END)  # 자동 스크롤
        
        # 로그 파일에 저장
        try:
            with open(self.poster.log_file, 'a', encoding='utf-8') as f:
                f.write(log_message)
        except Exception as e:
            print(f"로그 파일 저장 실패: {str(e)}")

    def run(self):
        self.root.mainloop()

    def load_email_list(self):
        """이메일 리스트 로드 및 표시"""
        try:
            email_list_path = os.path.join(self.script_dir, 'email_list.json')  # 수정된 부분
            if os.path.exists(email_list_path):
                with open(email_list_path, 'r', encoding='utf-8') as f:
                    email_list = json.load(f)
                    self.email_listbox.delete(0, tk.END)
                    for account in email_list:
                        self.email_listbox.insert(tk.END, account['email'])
                    self.update_status("이메일 목록 로드 완료")
        except Exception as e:
            self.update_status(f"이메일 목록 로드 실패: {str(e)}")

    def on_email_select(self, event):
        """이메일 더블클릭 시 로그인"""
        if not self.email_listbox.curselection():
            return
            
        selected_index = self.email_listbox.curselection()[0]
        email = self.email_listbox.get(selected_index)
        
        try:
            # 실행 파일과 같은 경로의 email_list.json 파일 사용 
            email_list_path = os.path.join(self.script_dir, 'email_list.json')
                
            self.update_status(f"이메일 리스트 경로: {email_list_path}")
                
            if not os.path.exists(email_list_path):
                raise Exception(f"이메일 리스트 파일을 찾을 수 없습니다: {email_list_path}")
                
            with open(email_list_path, 'r', encoding='utf-8') as f:
                email_list = json.load(f)
                    
            selected_account = next(acc for acc in email_list if acc['email'] == email)
            if selected_account:
                self.email_var.set(selected_account['email'])
                self.password_var.set(selected_account['password'])
                self.current_email = selected_account
                self.update_status(f"계정 선택됨: {email}")
                
        except Exception as e:
            self.update_status(f"계정 선택 실패: {str(e)}")

    def on_closing(self):
        """프로그램 종료 시 처리"""
        if messagebox.askyesno("저장", "설정을 저장하시겠습니까?"):
            try:
                self.save_config()
                self.root.destroy()
            except Exception as e:
                messagebox.showerror("오류", f"설정 저장 실패: {str(e)}")
                if messagebox.askyesno("확인", "저장에 실패했습니다. 그래도 종료하시겠습니까?"):
                    self.root.destroy()
        else:
            self.root.destroy()

class BandAutoPoster:
    def __init__(self, gui):
        self.gui = gui
        self.driver = None
        self.running = False
        self.posting_thread = None
        
        # 실행 파일 위치 기준으로 경로 설정 (임시 폴더 대신 실제 경로 사용)
        if getattr(sys, 'frozen', False):
            self.script_dir = os.path.dirname(sys.executable)
        else:
            self.script_dir = os.path.dirname(os.path.abspath(__file__))
            
        # 각종 파일/폴더 경로를 실행 파일 경로 기준으로 설정
        self.shared_profile_dir = os.path.join(self.script_dir, 'shared_chrome_profile')
        self.individual_profiles_dir = os.path.join(self.script_dir, 'chrome_profiles')
        self.config = self.load_config()
        self.bands_file = os.path.join(self.script_dir, 'band_urls.json')
        self.account_bands_dir = os.path.join(self.script_dir, 'account_bands')
        self.left_bands_file = os.path.join(self.script_dir, 'left_bands.json')
        
        # 필요한 디렉토리 생성
        os.makedirs(self.shared_profile_dir, exist_ok=True)
        os.makedirs(self.individual_profiles_dir, exist_ok=True)
        os.makedirs(self.account_bands_dir, exist_ok=True)

        # 고유 인스턴스 ID 생성 (현재 시간 기반)
        self.instance_id = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        self.random_delays = [1.1, 1.3, 1.5, 1.7, 2.1, 2.3, 2.5]  # 랜덤 지연 시간 추가
        self.current_url_index = 1  # URL 인덱스 추가
        self.current_account = None
        self.selected_email = None  # 선택된 이메일 저장용 변수 추가
        self.email_accounts = []  # 이메일 계정 목록 저장
        self.current_account_index = 0  # 현재 계정 인덱스
        self.post_count = 0  # 현재 계정의 포스팅 횟수
        self.max_posts_per_account = self.config.get('max_posts_per_account', 80)
        self.next_band_wait_minutes = self.config.get('next_band_wait_minutes', 7)
        self.load_left_bands()
        self.initial_account = None  # 초기 계정 저장용

        # 로그 디렉토리 설정
        self.log_dir = os.path.join(self.script_dir, 'logs')
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)

    def save_config(self, config_data):
        """설정 파일을 저장합니다.""" 
        try:
            config_path = os.path.join(self.script_dir, 'config.json')
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config_data, f, ensure_ascii=False, indent=4)
            self.config = config_data
            print(f"설정 파일 저장 완료: {config_path}")
        except Exception as e:
            print(f"설정 파일 저장 실패: {str(e)}")
            raise

    def load_config(self):
        try:
            config_path = os.path.join(self.script_dir, 'config.json')
            if not os.path.exists(config_path):
                # 기본 설정 파일 생성
                default_config = {
                    "email": "your_email@example.com",
                    "password": "your_password",
                    "post_url_1": "https://example.com/content-to-share",  # post_url 대신 post_url_1 사용
                    "title": "포스팅 제목",
                    "post_time": "09:00",
                    "interval_hours": 24,
                    "bands": [],
                    "max_posts_per_account": 80,  # 추가된 설정
                    "next_band_wait_minutes": 7,  # 추가된 설정
                    "leave_small_band": True  # 50명 미만 밴드 탈퇴 기본값 추가
                }
                with open(config_path, 'w', encoding='utf-8') as f:
                    json.dump(default_config, f, ensure_ascii=False, indent=4)
                print(f"설정 파일이 생성되었습니다: {config_path}")
                print("config.json 파일을 수정한 후 다시 실행해주세요.")
                sys.exit(1)  # exit() 대신 sys.exit() 사용
            
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            # 필수 설정 확인 (post_url 대신 post_url_1 확인)
            required_fields = ['email', 'password', 'post_url_1', 'bands']
            for field in required_fields:
                if field not in config:
                    # post_url이 있는 경우 post_url_1로 복사
                    if field == 'post_url_1' and 'post_url' in config:
                        config['post_url_1'] = config['post_url']
                    else:
                        raise ValueError(f"설정 파일에 '{field}' 항목이 없습니다.")
                        
            return config
            
        except Exception as e:
            print(f"설정 파일 로드 중 오류 발생: {str(e)}")
            sys.exit(1)  # exit() 대신 sys.exit() 사용

    def save_band_urls(self, bands):
        """밴드 URL 목록을 파일로 저장"""
        try:
            with open(self.bands_file, 'w', encoding='utf-8') as f:
                json.dump(bands, f, ensure_ascii=False, indent=4)
            self.gui.update_status(f"밴드 URL 저장 완료: {len(bands)}개")
        except Exception as e:
            self.gui.update_status(f"밴드 URL 저장 실패: {str(e)}")

    def load_band_urls(self):
        """저장된 밴드 URL 목록 로드"""
        try:
            if (os.path.exists(self.bands_file)):
                with open(self.bands_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            self.gui.update_status(f"밴드 URL 로드 실패: {str(e)}")
        return []

    def get_profile_dir(self, email=None):
        """계정별 프로필 디렉토리 반환"""
        if self.gui.account_switch_var.get():
            # 계정 전환 활성화 시 공유 프로필 사용
            if not os.path.exists(self.shared_profile_dir):
                os.makedirs(self.shared_profile_dir)
            return self.shared_profile_dir
        else:
            # 계정별 프로필 사용 (인스턴스 ID 제거)
            if not email:
                raise ValueError("계정별 모드에서는 이메일이 필요합니다")
            sanitized_email = email.replace('@', '_at_').replace('.', '_dot_')
            profile_dir = os.path.join(self.individual_profiles_dir, sanitized_email)
            if not os.path.exists(profile_dir):
                os.makedirs(profile_dir)
            return profile_dir

    def cleanup_chrome_processes(self):
        """Chrome 관련 프로세스를 정리합니다.""" 
        if self.driver:  # 현재 인스턴스의 드라이버만 종료
            try:
                self.driver.quit()
                time.sleep(2)
            except:
                pass
        
        # 계정 전환 활성화된 경우만 공유 프로필 정리
        if self.gui.account_switch_var.get():
            try:
                if os.path.exists(self.shared_profile_dir):
                    shutil.rmtree(self.shared_profile_dir)
                    time.sleep(1)
                    os.makedirs(self.shared_profile_dir)
            except:
                pass

    def setup_driver(self):
        try:
            self.gui.update_status("Chrome 드라이버 초기화 시작...")
            
            if not self.current_account:
                raise Exception("계정 정보가 설정되지 않았습니다")
            
            # 프로필 경로 설정
            profile_path = self.get_profile_dir(self.current_account['email'])
            self.gui.update_status(f"Chrome 프로필 경로: {profile_path}")

            options = webdriver.ChromeOptions()
            
            # 1. 기본 옵션 설정
            options.add_argument(f'--user-data-dir={profile_path}')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-gpu')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-extensions')
            options.add_argument('--disable-blink-features=AutomationControlled')
            
            # 2. 자동화 감지 방지
            options.add_experimental_option('excludeSwitches', ['enable-automation'])
            options.add_experimental_option('useAutomationExtension', False)
            
            # 3. 랜덤 User-Agent 설정
            user_agents = [
                # Chrome
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                # Firefox
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
                # Safari
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
            ]
            options.add_argument(f'user-agent={random.choice(user_agents)}')
            
            # 4. 랜덤 언어 및 타임존 설정
            languages = ['ko-KR', 'en-US', 'ja-JP', 'zh-CN']
            timezones = ['Asia/Seoul', 'Asia/Tokyo', 'America/Los_Angeles', 'Europe/London']
            options.add_argument(f'--lang={random.choice(languages)}')
            options.add_argument(f'--timezone={random.choice(timezones)}')
            
            # 5. WebGL 및 Canvas Fingerprint 우회
            options.add_argument('--disable-webgl')
            options.add_argument('--disable-canvas-aa')
            options.add_argument('--disable-2d-canvas-clip-aa')
            
            # 6. 추가 보안 설정
            prefs = {
                'profile.default_content_setting_values': {
                    'plugins': 2,
                    'geolocation': 2,
                    'notifications': 2,
                    'auto_select_certificate': 2,
                    'mouselock': 2,
                    'mixed_script': 2,
                    'media_stream': 2,
                    'media_stream_mic': 2,
                    'media_stream_camera': 2,
                    'protocol_handlers': 2,
                    'ppapi_broker': 2,
                    'automatic_downloads': 2,
                    'midi_sysex': 2,
                    'push_messaging': 2,
                    'ssl_cert_decisions': 2,
                    'metro_switch_to_desktop': 2,
                    'protected_media_identifier': 2,
                    'app_banner': 2,
                    'site_engagement': 2,
                    'durable_storage': 2
                },
                'profile.password_manager_enabled': False,
                'profile.content_settings.exceptions.plugins.*,*.per_resource.adobe-flash-player': 1
            }
            options.add_experimental_option('prefs', prefs)
            
            # 7. 봇 탐지 방지 스크립트
            with_script = """
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            
            // WebGL fingerprint 우회
            const getParameter = WebGLRenderingContext.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) {
                    return 'Intel Inc.';
                }
                if (parameter === 37446) {
                    return 'Intel Iris OpenGL Engine';
                }
                return getParameter(parameter);
            };
            
            // Canvas fingerprint 우회
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, attributes) {
                const context = originalGetContext.apply(this, arguments);
                if (type === '2d') {
                    const originalGetImageData = context.getImageData;
                    context.getImageData = function() {
                        const imageData = originalGetImageData.apply(this, arguments);
                        const pixels = imageData.data;
                        for (let i = 0; i < pixels.length; i += 4) {
                            pixels[i] = pixels[i] + Math.floor(Math.random() * 10) - 5;
                            pixels[i + 1] = pixels[i + 1] + Math.floor(Math.random() * 10) - 5;
                            pixels[i + 2] = pixels[i + 2] + Math.floor(Math.random() * 10) - 5;
                        }
                        return imageData;
                    };
                }
                return context;
            };
            """
            
            service = ChromeService(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=options)
            
            # 8. CDP로 스크립트 주입
            self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
                'source': with_script
            })
            
            # 9. 자연스러운 마우스 움직임 및 스크롤 함수 정의
            def natural_mouse_move():
                action = ActionChains(self.driver)
                x, y = random.randint(100, 700), random.randint(100, 500)
                action.move_by_offset(x, y).pause(random.uniform(0.1, 0.3))
                action.move_by_offset(-50, 30).pause(random.uniform(0.1, 0.2))
                action.move_by_offset(20, -15).perform()
                
            def natural_scroll():
                total_height = self.driver.execute_script("return document.body.scrollHeight")
                current_height = 0
                while current_height < total_height:
                    scroll_amount = random.randint(100, 300)
                    self.driver.execute_script(f"window.scrollTo(0, {current_height + scroll_amount})")
                    current_height += scroll_amount
                    time.sleep(random.uniform(0.3, 0.7))
                    if random.random() < 0.2:  # 20% 확률로 약간 위로 스크롤
                        self.driver.execute_script(f"window.scrollTo(0, {current_height - random.randint(50, 100)})")
                        time.sleep(random.uniform(0.2, 0.5))
                        
            # 10. 이벤트 리스너 추가
            self.driver.execute_script("""
                window.addEventListener('mousemove', function(e) {
                    window._lastMouseMove = Date.now();
                });
                window.addEventListener('scroll', function(e) {
                    window._lastScroll = Date.now();
                });
            """)
            
            self.gui.update_status("Chrome 드라이버 초기화 성공")
            return True

        except Exception as e:
            self.gui.update_status(f"Chrome 드라이버 오류: {str(e)}")
            if "DevToolsActivePort file doesn't exist" in str(e):
                try:
                    shutil.rmtree(profile_path)
                    os.makedirs(profile_path)
                except:
                    pass
            return False

    def safe_file_operation(self, operation, max_retries=3, wait_time=2):
        """안전한 파일 작업을 수행합니다."""
        for attempt in range(max_retries):
            try:
                return operation()
            except (PermissionError, OSError) as e:
                if (attempt == max_retries - 1):
                    raise
                self.gui.update_status(f"파일 작업 재시도 중... ({attempt + 1}/{max_retries})")
                time.sleep(wait_time)

    def wait_for_main_page(self, timeout=600):
        start_time = time.time()
        while (time.time() - start_time < timeout):
            current_url = self.driver.current_url
            if (current_url == "https://band.us/"):
                self.gui.update_status("밴드 메인 페이지 로딩 완료")
                return True
            elif ("auth" in current_url):
                self.gui.update_status("인증 페이지 감지, 메인 페이지 로딩 대기 중...")
                time.sleep(2)
            else:
                self.gui.update_status(f"페이지 로딩 대기 중... ({current_url})")
                time.sleep(2)
        return False

    def human_like_click(self, element):
        """더 자연스러운 마우스 클릭 동작"""
        try:
            # 요소 위치 계산
            location = element.location
            size = element.size
            
            # 요소 내 랜덤한 클릭 위치 설정
            x = location['x'] + size['width'] * random.uniform(0.2, 0.8)
            y = location['y'] + size['height'] * random.uniform(0.2, 0.8)
            
            # 마우스 이동을 여러 단계로 나누어 자연스럽게 처리
            actions = ActionChains(self.driver)
            
            # 현재 마우스 위치에서 중간 경유지점을 거쳐 목표 지점으로 이동
            current_x, current_y = pyautogui.position()
            mid_x = current_x + (x - current_x) * random.uniform(0.3, 0.7)
            mid_y = current_y + (y - current_y) * random.uniform(0.3, 0.7)
            
            # 중간 지점으로 이동
            actions.move_by_offset(mid_x - current_x, mid_y - current_y)
            actions.pause(random.uniform(0.1, 0.3))
            
            # 목표 지점으로 이동
            actions.move_by_offset(x - mid_x, y - mid_y)
            actions.pause(random.uniform(0.05, 0.15))
            
            # 클릭 전 미세 조정
            actions.move_by_offset(random.uniform(-2, 2), random.uniform(-2, 2))
            actions.pause(random.uniform(0.05, 0.1))
            
            # 클릭
            actions.click()
            actions.perform()
            actions.reset_actions()
            
            # 클릭 후 짧은 대기
            time.sleep(random.uniform(0.3, 0.7))
        except:
            # 기본 클릭으로 폴백
            element.click()
            time.sleep(random.choice([0.8, 1.2, 1.5, 1.8]))

    def human_like_type(self, element, text):
        """더 자연스러운 타이핑 동작"""
        try:
            element.click()
            time.sleep(random.uniform(0.3, 0.7))
            
            for char in text:
                # 기본 타이핑 속도
                base_delay = random.uniform(0.1, 0.3)
                
                # 특수한 상황에서 추가 딜레이
                if char in ['.', ',', '!', '?']:
                    base_delay *= 1.5  # 문장 부호 후 더 긴 딜레이
                elif char == ' ':
                    base_delay *= 1.2  # 스페이스 후 약간 긴 딜레이
                elif random.random() < 0.1:
                    base_delay *= 2  # 10% 확률로 "생각하는" 듯한 긴 딜레이
                
                element.send_keys(char)
                time.sleep(base_delay)
                
                # 가끔 백스페이스로 오타 수정
                if random.random() < 0.05:  # 5% 확률
                    element.send_keys(Keys.BACKSPACE)
                    time.sleep(random.uniform(0.3, 0.6))
                    element.send_keys(char)
                    time.sleep(random.uniform(0.2, 0.4))
                    
            # 입력 완료 후 잠시 대기
            time.sleep(random.uniform(0.5, 1.0))
            
        except:
            # 기본 입력으로 폴백
            element.send_keys(text)
            time.sleep(random.uniform(0.5, 1.0))

    def relogin(self, account):
        """선택된 계정으로 재로그인"""
        try:
            self.current_account = account
            self.gui.update_status(f"[로그인 시작] {account['email']} 계정으로 전환 중...")
            
            # 현재 페이지에서 로그아웃
            self.driver.get('https://band.us/logout')
            time.sleep(2)
            
            # 새 계정으로 로그인
            self.login()
            
        except Exception as e:
            self.gui.update_status(f"계정 전환 실패: {str(e)}")

    def login(self):
        try:
            if not self.current_account:
                raise Exception("로그인할 계정이 선택되지 않았습니다")
                
            self.gui.update_status("[로그인] 이메일 로그인 페이지로 이동 중...")
            self.driver.get('https://auth.band.us/email_login?keep_login=false')
            time.sleep(3)
            
            # 이메일 입력
            try:
                self.gui.update_status("[로그인] 이메일 입력 필드 찾는 중...")
                email_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.ID, 'input_email'))
                )
                self.gui.update_status(f"[로그인] 이메일 입력: {self.current_account['email']}")
                email_input.clear()
                self.human_like_type(email_input, self.current_account['email'])
                time.sleep(2)
                
                email_confirm = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uBtn.-tcType.-confirm'))
                )
                self.human_like_click(email_confirm)
                time.sleep(2)
                
            except Exception as e:
                self.gui.update_status("[로그인 실패] 이메일 입력 필드를 찾을 수 없습니다")
                raise

            # 비밀번호 입력
            try:
                self.gui.update_status("[로그인] 비밀번호 입력 필드 찾는 중...")
                pw_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.ID, 'pw'))
                )
                self.gui.update_status("[로그인] 비밀번호 입력 중...")
                pw_input.clear()
                self.human_like_type(pw_input, self.current_account['password'])
                time.sleep(2)
                
                pw_confirm = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uBtn.-tcType.-confirm'))
                )
                self.human_like_click(pw_confirm)
                
            except Exception as e:
                self.gui.update_status("[로그인 실패] 비밀번호 입력 필드를 찾을 수 없습니다")
                raise

            # 로그인 성공 확인 및 밴드 목록 가져오기
            try:
                self.gui.update_status("[로그인] 내 밴드 탭 나올 때까지 최대 5분 대기...")
                myband_tab = None
                start_time = time.time()
                
                while time.time() - start_time < 300:  # 5분(300초) 대기
                    try:
                        myband_tab = self.driver.find_element(By.CSS_SELECTOR, 'a[href="/"]._tabMyBandList.tab.-active')
                        if myband_tab.is_displayed():
                            self.gui.update_status("[로그인 성공] 내 밴드 탭 감지됨. 피드로 이동...")

                            break
                    except:
                        time.sleep(5)  # 5초마다 체크
                        continue
                
                if not myband_tab:
                    raise Exception("5분 동안 내 밴드 탭이 나타나지 않았습니다")
                    
            except Exception as e:
                self.gui.update_status(f"[로그인 실패] {str(e)}")
                raise
                
        except Exception as e:
            error_msg = str(e)
            self.gui.update_status(f"[치명적 오류] 로그인 프로세스 실패: {error_msg}")
            raise e

    def get_band_list(self):
        try:
            self.driver.get('https://band.us/feed')
            time.sleep(5)
            
            # "내 밴드 더보기" 버튼 찾고 클릭
            try:
                for _ in range(1):
                    try:
                        more_btn = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.myBandMoreView._btnMore'))
                        )
                        self.driver.execute_script("arguments[0].scrollIntoView(true);", more_btn)
                        time.sleep(2)
                        more_btn.click()
                        self.gui.update_status("내 밴드 더보기 버튼 클릭 성공")
                        time.sleep(3)
                        break
                    except:
                        self.driver.execute_script("window.scrollBy(0, 300);")
                        time.sleep(1)
            except Exception as e:
                self.gui.update_status(f"더보기 버튼 찾기/클릭 실패 (무시됨): {str(e)}")
            
            # 밴드 목록 로딩
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
                            'name': band_name,
                            'url': band_url
                        })
                        self.gui.update_status(f"밴드 발견: {band_name} ({band_url})")
                except:
                    continue
            
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
            # 자연스러운 대기 시간
            time.sleep(random.uniform(1.5, 3.0))
            
            # 밴드 URL로 직접 이동
            self.driver.get(band_info['url'])
            time.sleep(random.uniform(2.0, 3.0))
            
            # 자연스러운 스크롤
            self.driver.execute_script("""
                window.scrollBy({
                    top: Math.random() * 300,
                    left: 0,
                    behavior: 'smooth'
                });
            """)
            time.sleep(random.uniform(0.5, 1.5))
            
            # 페이지 확인
            if band_info['url'].split("/")[-1] in self.driver.current_url:
                self.gui.update_status(f"'{band_info['name']}' 밴드 페이지 로딩 완료")
                return True
                
            raise Exception("밴드 페이지 로딩 실패") 
            
        except Exception as e:
            self.gui.update_status(f"밴드 이동 실패: {str(e)}")
            return False

    def get_next_post_url(self):
        """다음 포스팅 URL과 제목을 가져옵니다."""
        try:
            # config.json에서 직접 URL 가져오기
            url_key = f'post_url_{self.current_url_index}'
            url = self.config.get(url_key, '').strip()
            
            if not url:
                self.current_url_index = 1
                url = self.config.get('post_url_1', '').strip()
            
            current_index = self.current_url_index
            self.current_url_index += 1
            if self.current_url_index > 100:
                self.current_url_index = 1
            
            if url:
                # URL에서 제목 추출 (도메인과 확장자 제외)
                title = url
                return url, title, current_index
                
            if self.current_url_index == 1:
                raise Exception("사용 가능한 URL이 없습니다")
                
        except Exception as e:
            self.gui.update_status(f"URL/제목 가져오기 실패: {str(e)}")
            return None, None, None

    def post_to_band(self, band_info):
        """밴드에 포스팅합니다."""
        try:
            # 탈퇴한 밴드 체크
            left_bands = self.load_left_bands()
            if any(b['url'] == band_info['url'] for b in left_bands):
                self.gui.update_status(f"탈퇴한 밴드이므로 건너뜀: {band_info['name']}")
                return "skip"
            
            # 밴드로 이동
            if (not self.navigate_to_band(band_info)):
                return False

            # 글쓰기 버튼 존재 여부 먼저 체크
            write_btn_selectors = [
                'button._btnPostWrite',
                'button.uButton.-sizeL.-confirm.sf_bg',
                'button[type="button"][class*="_btnPostWrite"]'
            ]
            
            write_btn = None
            for selector in write_btn_selectors:
                try:
                    write_btn = WebDriverWait(self.driver, 3).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    if write_btn.is_displayed():
                        break
                except:
                    continue
                    
            if not write_btn or not write_btn.is_displayed():
                self.gui.update_status(f"[글쓰기 불가] {band_info['name']} 밴드에서 글쓰기 버튼을 찾을 수 없습니다 → 탈퇴 처리 시작")
                if self.leave_band(band_info):
                    self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드에서 탈퇴")
                    return "skip"
                else:
                    self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패") 
                    return False

            # 글쓰기 버튼이 있는 경우에만 아래 로직 진행
            # 자연스러운 스크롤 처리
            def natural_scroll():
                total_height = self.driver.execute_script("return document.body.scrollHeight")
                current_height = 0
                while current_height < total_height:
                    scroll_amount = random.randint(100, 300)
                    self.driver.execute_script(f"window.scrollTo(0, {current_height + scroll_amount})")
                    current_height += scroll_amount
                    time.sleep(random.uniform(0.3, 0.7))
                    if random.random() < 0.2:  # 20% 확률로 약간 위로 스크롤
                        self.driver.execute_script(f"window.scrollTo(0, {current_height - random.randint(50, 100)})")
                        time.sleep(random.uniform(0.2, 0.5))
                        
            natural_scroll()
            time.sleep(random.uniform(1.0, 2.0))

            # 케이스 1: 소개 입력 팝업이 있는 경우
            try:
                intro_input = WebDriverWait(self.driver, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'input._profileDescForm[placeholder="소개 입력"]'))
                )
                
                if intro_input.is_displayed():
                    self.gui.update_status("[소개 입력] 팝업 감지됨. 처리 시작...")
                    self.human_like_click(intro_input)
                    intro_input.send_keys("네")
                    time.sleep(1)
                    
                    # 완료 버튼 클릭
                    confirm_btn = WebDriverWait(self.driver, 3).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-confirm._confirm'))
                    )
                    self.human_like_click(confirm_btn)
                    time.sleep(2)
                    
                    self.gui.update_status("[소개 입력] 처리 완료")

                    # 멤버 수 확인
                    member_count_element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, 'a._memberLink._memberCountText'))
                    )
                    member_text = member_count_element.text.strip()
                    member_count = int(''.join(filter(str.isdigit, member_text)))
                    
                    if member_count <= 50:
                        self.gui.update_status(f"[멤버 수 부족] {band_info['name']} 밴드의 멤버 수가 {member_count}명으로 50명 이하입니다")
                        
                        # 50명 미만 밴드 탈퇴 설정이 활성화된 경우에만 탈퇴 진행
                        if self.gui.leave_small_band_var.get():
                            self.gui.update_status("자동 탈퇴 설정이 활성화되어 있어 탈퇴를 진행합니다")
                            if self.leave_band(band_info):
                                self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드에서 탈퇴")
                                return "skip"
                            else:
                                self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패")
                                return False
                        else:
                            self.gui.update_status("자동 탈퇴 설정이 비활성화되어 있어 탈퇴하지 않고 진행합니다")

            # 케이스 2: 소개 입력 팝업이 없는 경우
            except:
                self.gui.update_status("[소개 입력] 팝업이 없습니다. 멤버 수 확인...")
                
                # 게시물 분석 로직 추가
                try:
                    # 현재 페이지의 HTML 가져오기
                    page_html = self.driver.page_source
                    
                    # BeautifulSoup으로 게시물 분석
                    if check_for_leaving_band(page_html, self.gui.update_status):
                        self.gui.update_status(f"[자동 탈퇴] {band_info['name']} 밴드의 상위 3개 게시물 모두 조회수 없음")
                        self.gui.update_status("Left the band due to missing postCount in top 3 posts.")
                        
                        if self.leave_band(band_info):
                            self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드 탈퇴 완료")
                            return "skip"
                        else:
                            self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패")
                            return False
                            
                except Exception as e:
                    self.gui.update_status(f"[게시물 분석 오류] {str(e)}")

                # 멤버 수 확인 코드...
                try:
                    member_count_element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, 'a._memberLink._memberCountText'))
                    )
                    member_text = member_count_element.text.strip()
                    member_count = int(''.join(filter(str.isdigit, member_text)))
                    
                    if member_count <= 50:
                        self.gui.update_status(f"[멤버 수 부족] {band_info['name']} 밴드의 멤버 수가 {member_count}명으로 50명 이하입니다")
                        
                        # 50명 미만 밴드 탈퇴 설정이 활성화된 경우에만 탈퇴 진행
                        if self.gui.leave_small_band_var.get():
                            self.gui.update_status("자동 탈퇴 설정이 활성화되어 있어 탈퇴를 진행합니다")
                            if self.leave_band(band_info):
                                self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드에서 탈퇴")
                                return "skip"
                            else:
                                self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패")
                                return False
                        else:
                            self.gui.update_status("자동 탈퇴 설정이 비활성화되어 있어 탈퇴하지 않고 진행합니다")
                    
                    self.gui.update_status(f"[멤버 수 확인] {band_info['name']} 밴드의 멤버 수: {member_count}명")
                except Exception as e:
                    self.gui.update_status(f"[경고] 멤버 수 확인 실패: {str(e)}")
                    return False

            # 다음 URL과 제목 가져오기
            post_url, post_title, current_index = self.get_next_post_url()
            self.gui.update_status(f"'{band_info['name']}' 밴드에 URL 포스팅 시작: {post_url}")
            self.gui.update_status(f"포스팅 제목: {post_title}")

            # 글쓰기 버튼 찾기
            write_btn_selectors = [
                'button._btnPostWrite',
                'button.uButton.-sizeL.-confirm.sf_bg',
                'button[type="button"][class*="_btnPostWrite"]'
            ]
            
            write_btn = None
            for selector in write_btn_selectors:
                try:
                    write_btn = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    break
                except:
                    continue
                    
            if (not write_btn):
                self.gui.update_status(f"[글쓰기 실패] {band_info['name']} 밴드에서 글쓰기 버튼을 찾을 수 없습니다 → 탈퇴 처리 시작")
                if self.leave_band(band_info):
                    self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드에서 탈퇴")
                    return "skip"  # 탈퇴 완료 후 skip 반환
                else:
                    self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패") 
                    return False
                
            # 첫 번째 글쓰기 버튼 클릭
            self.human_like_click(write_btn)
            time.sleep(random.uniform(2.0, 3.0))
            
            # 미션 인증글 팝업 확인 및 처리
            try:
                mission_popup = WebDriverWait(self.driver, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div.modalBody'))
                )
                
                if "혹시 미션 인증글을 쓰실 건가요?" in mission_popup.text:
                    self.gui.update_status("[팝업 감지] 미션 인증글 관련 팝업 처리 중...")
                    
                    # 확인 버튼 클릭
                    confirm_btn = WebDriverWait(self.driver, 3).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-confirm._btnConfirm'))
                    )
                    self.human_like_click(confirm_btn)
                    time.sleep(1)
                    
                    # 다시 글쓰기 버튼 클릭
                    self.gui.update_status("[글쓰기] 다시 글쓰기 버튼 클릭")
                    write_btn = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    self.human_like_click(write_btn)
                    time.sleep(random.uniform(2.0, 3.0))
            except:
                self.gui.update_status("[팝업 없음] 미션 인증글 팝업이 없습니다. 계속 진행...")
            
            # 글 작성 영역 찾기
            try:
                editor = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div[contenteditable="true"]'))
                )
                self.gui.update_status("[글쓰기] 에디터 영역 찾음")

                # URL 입력 및 미리보기 로딩
                self.gui.update_status("[글쓰기] URL 입력 시작") 
                editor.send_keys(post_url)
                time.sleep(1)
                
                self.gui.update_status("[글쓰기] 미리보기 로딩 시작")
                ActionChains(self.driver).send_keys(Keys.ENTER).perform()
                time.sleep(7)  # 미리보기 로딩 대기 시간

  
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
                
                # 게시 버튼 클릭
                self.gui.update_status("[글쓰기] 게시 버튼 찾는 중")
                submit_btn = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-sizeM._btnSubmitPost.-confirm'))
                )
                self.human_like_click(submit_btn)
                self.gui.update_status("[글쓰기] 게시 버튼 클릭 완료")

                # 케이스 1: 알림창(alert) 처리
                try:
                    alert = WebDriverWait(self.driver, 3).until(EC.alert_is_present())
                    alert_text = alert.text
                    self.gui.update_status(f"[알림창 감지] 내용: {alert_text}")
                    
                    if "본문을 입력해주세요" in alert_text:
                        alert.accept()
                        time.sleep(1)
                        
                        # 취소 버튼 클릭
                        cancel_btn = WebDriverWait(self.driver, 3).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.btnLyClose._btnCancel'))
                        )
                        self.human_like_click(cancel_btn)
                        time.sleep(2)
                        
                        # 다시 URL과 제목 준비
                        retry_count = 0
                        while retry_count < 3:  # 최대 3번 재시도
                            try:
                                post_url, post_title, current_index = self.get_next_post_url()
                                editor = WebDriverWait(self.driver, 10).until(
                                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div[contenteditable="true"]'))
                                )
                                
                                # URL 입력 및 미리보기 로딩
                                editor.clear()
                                editor.send_keys(post_url)
                                time.sleep(1)
                                ActionChains(self.driver).send_keys(Keys.ENTER).perform()
                                time.sleep(7)  # 미리보기 로딩 대기
                                
                                    
                                submit_btn = WebDriverWait(self.driver, 5).until(
                                    EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-sizeM._btnSubmitPost.-confirm'))
                                )
                                self.human_like_click(submit_btn)
                                break
                                
                            except Exception as e:
                                retry_count += 1
                                self.gui.update_status(f"[재시도 {retry_count}/3] URL 재입력 실패: {str(e)}")
                                time.sleep(2)
                                
                        if retry_count >= 3:
                            return False
                    
                    elif "리더의 승인" in alert_text or "글이 등록되면 새소식으로" in alert_text:
                        self.gui.update_status("[알림창 처리] 리더 승인 필요 → 탈퇴 처리 시작")
                        alert.accept()
                        time.sleep(1)
                        
                        if self.leave_band(band_info):
                            self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드에서 탈퇴")
                            return "skip"  # 탈퇴 완료 후 skip 반환
                        else:
                            self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패")
                            return False

                except:
                    self.gui.update_status("[알림창 없음] 게시판 선택 여부 확인")

                # 케이스 2: 게시판 선택 팝업 처리
                try:
                    board_header = WebDriverWait(self.driver, 3).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, 'header.modalHeader'))
                    )
                    
                    if "게시판 선택" in board_header.text:
                        self.gui.update_status("[게시판 선택] 팝업 감지됨")
                        
                        # 첫 번째 게시판 선택
                        first_board = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, 'label.flexList'))
                        )
                        self.human_like_click(first_board)
                        self.gui.update_status("[게시판 선택] 첫 번째 게시판 선택됨")
                        
                        # 확인 버튼 클릭
                        confirm_btn = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-confirm._btnConfirm'))
                        )
                        self.human_like_click(confirm_btn)
                        self.gui.update_status("[게시판 선택] 확인 버튼 클릭")
                        
                        # 최종 게시 버튼 클릭
                        final_submit = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-sizeM._btnSubmitPost.-confirm'))
                        )
                        self.human_like_click(final_submit)
                        self.gui.update_status("[게시판 선택] 최종 게시 버튼 클릭")

                        # 리더 승인 알림창 확인
                        try:
                            approval_popup = WebDriverWait(self.driver, 3).until(
                                EC.presence_of_element_located((By.CSS_SELECTOR, 'div.modalLayer._uploadCompleteLayer'))
                            )
                            popup_text = approval_popup.text.strip()
                            self.gui.update_status(f"[승인 알림] 팝업 감지: {popup_text}")
                            
                            if "리더의 승인" in popup_text or "글이 등록되면 새소식으로" in popup_text:
                                self.gui.update_status("[승인 알림] 리더 승인 필요 → 탈퇴 처리 시작")
                                ActionChains(self.driver).send_keys(Keys.ENTER).perform()
                                time.sleep(2)
                                
                                if self.leave_band(band_info):
                                    self.gui.update_status(f"[탈퇴 완료] {band_info['name']} 밴드에서 탈퇴")
                                    return "skip"  # 탈퇴 완료 후 "skip" 반환
                                else:
                                    self.gui.update_status(f"[탈퇴 실패] {band_info['name']} 밴드 탈퇴 실패")
                                    return False
                        except:
                            self.gui.update_status("[승인 알림] 리더 승인 알림 없음 → 게시 완료")

                except:
                    self.gui.update_status("[게시판 선택] 게시판 선택 팝업 없음 → 바로 게시됨")

                self.gui.update_status(f"[게시 완료] {band_info['name']} 밴드에 성공적으로 게시")
                return True

            except Exception as e:
                self.gui.update_status(f"[오류] 글 작성 중 실패: {str(e)}")
                return False

        except Exception as e:
            self.gui.update_status(f"[치명적 오류] {band_info['name']} 밴드 처리 실패: {str(e)}")
            return False

    def handle_board_selection_popup(self, wait):
        """게시판 선택 팝업 처리"""
        try:
            self.gui.update_status("[게시판 선택] 첫 번째 게시판을 선택합니다.")
            first_flex_list = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'label.flexList'))
            )
            self.human_like_click(first_flex_list)
            self.gui.update_status("[게시판 선택] 게시판 선택 완료")
            
            self.gui.update_status("[게시판 선택] 확인 버튼 클릭")
            confirm_btn = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-confirm._btnConfirm'))
            )
            self.human_like_click(confirm_btn)
            
            self.gui.update_status("[게시판 선택] 최종 게시 버튼 클릭")
            final_submit_btn = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-sizeM._btnSubmitPost.-confirm'))
            )
            time.sleep(2)
            self.human_like_click(final_submit_btn)
            self.gui.update_status("[게시판 선택] 게시판 선택 프로세스 완료")
            return True
            
        except Exception as e:
            self.gui.update_status(f"[오류] 게시판 선택 처리 실패: {str(e)}")
            return False

    def run_posting(self):
        try:
            # Chrome 프로필 초기화
            profile_path = os.path.join(self.script_dir, 'chrome_profile')
            if (os.path.exists(profile_path)):
                try:
                    shutil.rmtree(profile_path)
                    time.sleep(2)
                    os.makedirs(profile_path)
                except:
                    pass

            retry_count = 0
            while (retry_count < 3):
                if (self.setup_driver()):
                    break
                retry_count += 1
                time.sleep(5)
                
            if (not self.driver):
                raise Exception("브라우저를 시작할 수 없습니다")
                
            self.login()
            
            # 밴드 목록 가져오기
            bands = self.get_band_list()
            if (not bands):
                raise Exception("작성할 밴드가 없습니다.")
            
            self.gui.update_status(f"총 {len(bands)}개의 밴드에 순차적으로 글을 작성합니다.")
            success_count = 0
            
            for i, band in enumerate(bands, start=1):
                self.gui.update_status(f"[{i}/{len(bands)}] {band['name']} ({band['url']}) 밴드 작성 시작...")
                if (self.post_to_band(band)):
                    success_count += 1
                time.sleep(300)
            
            self.gui.update_status(f"모든 밴드 작성 완료 (성공: {success_count}, 실패: {len(bands)-success_count})")
            
        except Exception as e:
            self.gui.update_status(f"실행 중 오류 발생: {str(e)}")
            if (self.driver):
                self.driver.quit()
            raise

    def start_posting(self):
        self.running = True
        
        # 로그 파일 생성
        current_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_file = os.path.join(self.log_dir, f'log_{current_time}.txt')
        
        # 시작 로그 기록
        with open(self.log_file, 'w', encoding='utf-8') as f:
            f.write(f"=== 밴드 자동 포스팅 시작 - {current_time} ===\n\n")

        # 선택된 이메일 정보 저장
        selected_email = self.gui.email_var.get().strip()
        selected_password = self.gui.password_var.get().strip()

        if not selected_email or not selected_password:
            self.gui.update_status("이메일과 비밀번호를 먼저 선택해주세요.")
            self.stop_posting()
            return

        # 선택된 계정 정보 저장
        self.selected_email = selected_email
        self.current_account = {
            'email': selected_email,
            'password': selected_password
        }
        
        threading.Thread(target=self._start_with_band_list, daemon=True).start()

    def _start_with_band_list(self):
        try:
            if not self.load_email_accounts():
                raise Exception("이메일 계정 목록을 불러올 수 없습니다")
                
            # 선택된 이메일과 일치하는 계정 찾기
            if self.selected_email:
                matching_account = next(
                    (acc for acc in self.email_accounts if acc['email'] == self.selected_email),
                    None
                )
                if matching_account:
                    self.current_account = matching_account
                    self.current_account_index = self.email_accounts.index(matching_account)
                else:
                    self.current_account = self.email_accounts[0]
                    self.current_account_index = 0
            else:
                self.current_account = self.email_accounts[0]
                self.current_account_index = 0
            
            # 최초 로그인 시 계정 정보 저장
            if not self.initial_account:
                self.initial_account = self.current_account.copy()

            self.gui.update_status(f"시작 계정: {self.current_account['email']}")

            while self.running:
                self.cleanup_chrome_processes()
                if not self.setup_driver():
                    raise Exception("브라우저 설정 실패")

                self.login()
                
                # 밴드 목록 가져오기
                all_bands = self.get_band_list()
                if not all_bands:
                    raise Exception("밴드 목록을 가져올 수 없습니다")

                # 기존 작성 이력을 유지하면서 밴드 목록 업데이트
                _, posted_bands = self.load_account_bands(self.current_account['email'])
                self.save_account_bands(self.current_account['email'], all_bands, posted_bands)

                # 미작성 밴드 필터링
                remaining_bands = self.get_remaining_bands(self.current_account['email'], all_bands)
                
                if not remaining_bands:
                    self.gui.update_status(f"계정 {self.current_account['email']}의 모든 밴드에 작성 완료. 목록 초기화")
                    self.save_account_bands(self.current_account['email'], all_bands, [])
                    remaining_bands = all_bands

                self.gui.update_status(f"작성 가능한 밴드 수: {len(remaining_bands)}")
                success_count = 0
                
                # 설정값 업데이트 (랜덤값 적용)
                max_posts_base = int(self.gui.max_posts_var.get())
                wait_minutes_base = int(self.gui.next_band_wait_var.get())
                
                # 포스팅 횟수: 기본값 ± 5
                self.max_posts_per_account = max_posts_base + random.randint(-5, 5)
                # 최소값 보정
                if self.max_posts_per_account < 1:
                    self.max_posts_per_account = 1
                    
                # 대기 시간: 기본값 ± 1분
                self.next_band_wait_minutes = wait_minutes_base + random.randint(-1, 1)
                # 최소값 보정 
                if self.next_band_wait_minutes < 1:
                    self.next_band_wait_minutes = 1
                    
                self.gui.update_status(f"[랜덤 설정] 이번 회차 포스팅 횟수: {self.max_posts_per_account}회")
                self.gui.update_status(f"[랜덤 설정] 이번 회차 대기 시간: {self.next_band_wait_minutes}분")

                for i, band in enumerate(remaining_bands[:self.max_posts_per_account], start=1):
                    if not self.running:
                        break
                        
                    self.gui.update_status(f"[{i}/{len(remaining_bands)}] {band['name']} ({band['url']}) 밴드 작성 시작...")
                    result = self.post_to_band(band)
                    
                    if result == "skip":
                        # 탈퇴한 밴드는 카운트하지 않고 대기 시간 없이 다음으로
                        continue
                        
                    if result:  # True인 경우만 카운트
                        success_count += 1
                        self.post_count += 1
                        self.update_posted_bands(self.current_account['email'], band)
                        
                    if self.post_count >= self.max_posts_per_account:
                        if self.gui.account_switch_var.get():
                            # 1. 로그아웃 먼저 실행
                            self.gui.update_status(f"계정 {self.current_account['email']}의 포스팅 완료. 로그아웃 시작...")
                            
                            try:
                                if self.do_logout():  # 새로운 로그아웃 메서드 호출
                                    self.gui.update_status("로그아웃 성공")
                                    
                                    # 2. 대기 시간 계산
                                    post_interval = self.gui.post_time_var.get()
                                    try:
                                        hours, minutes = map(int, post_interval.split(':'))
                                        wait_minutes = hours * 60 + minutes
                                        self.gui.update_status(f"{wait_minutes}분 후 다음 계정으로 전환...")
                                        time.sleep(wait_minutes * 60)
                                    except ValueError:
                                        self.gui.update_status("잘못된 시간 형식. 기본 30분 후 전환...")
                                        time.sleep(1800)
                                        
                                    # 3. 드라이버 종료
                                    if self.driver:
                                        self.driver.quit()
                                        self.driver = None
                                        time.sleep(2)
                                        
                                    # 4. 다음 계정으로 전환
                                    self.switch_to_next_account()
                                else:
                                    self.gui.update_status("로그아웃 실패, 강제 종료 후 다음 계정으로 전환")
                                    if self.driver:
                                        self.driver.quit()
                                        self.driver = None
                                        time.sleep(2)
                                    self.switch_to_next_account()
                            except Exception as e:
                                self.gui.update_status(f"계정 전환 중 오류 발생: {str(e)}")
                            break
                        else:
                            # 계정 전환 비활성화된 경우 처음 계정으로 재로그인
                            self.gui.update_status(f"계정 전환 비활성화됨. 초기 계정으로 재로그인: {self.initial_account['email']}")
                            self.post_count = 0  # 포스팅 카운트 초기화
                            self.current_account = self.initial_account.copy()
                            if self.do_logout():
                                self.gui.update_status("로그아웃 성공")
                                # 대기 시간 계산 및 적용
                                post_interval = self.gui.post_time_var.get()
                                try:
                                    hours, minutes = map(int, post_interval.split(':'))
                                    wait_minutes = hours * 60 + minutes
                                    self.gui.update_status(f"{wait_minutes}분 후 초기 계정으로 재로그인...")
                                    time.sleep(wait_minutes * 60)
                                except ValueError:
                                    self.gui.update_status("잘못된 시간 형식. 기본 30분 후 전환...")
                                    time.sleep(1800)
                                # 재로그인
                                self.relogin(self.initial_account)
                            else:
                                self.gui.update_status("로그아웃 실패, 강제 종료 후 재시작")
                                if self.driver:
                                    self.driver.quit()
                                    self.driver = None
                                    time.sleep(2)
                                self.relogin(self.initial_account)
                        break
                        
                    # 성공/실패한 경우에만 대기 시간 적용
                    if result is not None:  # skip이 아닌 경우
                        self.gui.update_status(f"다음 밴드로 이동 전 {self.next_band_wait_minutes}분 대기...")
                        time.sleep(self.next_band_wait_minutes * 60)

                self.gui.update_status(f"현재 계정 작업 완료 (성공: {success_count})")

        except Exception as e:
            self.gui.update_status(f"시작 실패: {str(e)}")
            self.stop_posting()

    def do_logout(self):
        """로그아웃 프로세스 실행"""
        try:
            if not self.driver:
                return False
                
            self.gui.update_status("[로그아웃] 프로필 버튼 찾는 중...")
            wait = WebDriverWait(self.driver, 10)
            
            # 1. 프로필 버튼 클릭
            profile_button = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button.btnMySetting._btnMySetting._btnWidgetIcon"))
            )
            self.gui.update_status("[로그아웃] 프로필 버튼 클릭")
            self.driver.execute_script("arguments[0].click();", profile_button)
            time.sleep(2)
            
            # 2. 로그아웃 메뉴 클릭
            self.gui.update_status("[로그아웃] 로그아웃 메뉴 찾는 중...")
            logout_link = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "a.menuModalLink._btnLogout"))
            )
            self.gui.update_status("[로그아웃] 로그아웃 메뉴 클릭")
            self.driver.execute_script("arguments[0].click();", logout_link)
            time.sleep(2)
            
            # 3. 로그아웃 확인 버튼 클릭
            self.gui.update_status("[로그아웃] 확인 버튼 찾는 중...")
            logout_selectors = [
                "button.uButton._btnLogout.-confirm",
                "button._btnLogout.-confirm",
                "button[class*='_btnLogout'][class*='-confirm']"
            ]

            for selector in logout_selectors:
                try:
                    confirm_logout = wait.until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))  # 수정
                    )
                    self.gui.update_status("[로그아웃] 확인 버튼 클릭")
                    self.driver.execute_script("arguments[0].click();", confirm_logout)
                    time.sleep(3)
                    return True
                except:
                    continue
                    
            return False

        except Exception as e:
            self.gui.update_status(f"[로그아웃 실패] {str(e)}")
            return False

    def switch_to_next_account(self):
        """다음 계정으로 전환"""
        try:
            if not self.email_accounts:
                return False
                
            # 다음 계정 선택
            self.current_account_index = (self.current_account_index + 1) % len(self.email_accounts)
            next_account = self.email_accounts[self.current_account_index]
            self.post_count = 0
            
            self.gui.update_status(f"[계정 전환] 다음 계정으로 전환: {next_account['email']}")
            return self.relogin(next_account)

        except Exception as e:
            self.gui.update_status(f"[계정 전환 실패] {str(e)}")
            return False

    def _posting_loop(self):
        while (self.running):
            try:
                # Check if stopped
                if (not self.running):
                    break

                # 현재 시간과 설정된 시간 비교
                now = datetime.datetime.now()
                post_time = self.gui.post_time_var.get()
                try:
                    hour, minute = map(int, post_time.split(':'))
                    target_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                    # 설정 시간이 지났다면 다음 날로 설정
                    if (now > target_time):
                        target_time += datetime.timedelta(days=1)
                    
                    wait_seconds = (target_time - now).total_seconds()
                    while (wait_seconds > 0 and self.running):
                        self.gui.update_status(f"다음 게시 시간({post_time})까지 {int(wait_seconds/60)}분 대기")
                        time.sleep(min(60, wait_seconds))  # 최대 1분씩 대기
                        wait_seconds -= 60
                        if (not self.running):
                            break
                except ValueError:
                    self.gui.update_status("잘못된 시간 형식입니다. HH:MM 형식으로 입력해주세요.")
                    break

                if (not self.running):
                    break

                self.gui.update_status("포스팅 시작...")
                self.run_posting()
                
                if (self.running):
                    remaining_hours = int(self.gui.interval_var.get())
                    while (remaining_hours > 0 and self.running):
                        self.gui.update_status(f"다음 포스팅까지 {remaining_hours}시간 대기")
                        time.sleep(3600)  # 1시간씩 대기
                        remaining_hours -= 1
            except Exception as e:
                if (not self.running):
                    break
                self.gui.update_status(f"오류 발생: {str(e)}\n1분 후 재시도합니다.")
                time.sleep(60)

    def stop_posting(self):
        self.gui.update_status("중지 요청됨...")
        self.running = False
        
        # 드라이버 종료
        if (self.driver):
            try:
                self.driver.quit()
                time.sleep(2)
            except:
                pass
        
        # 프로세스 정리
        self.cleanup_chrome_processes()
        
        if (self.posting_thread and self.posting_thread.is_alive()):
            self.posting_thread.join(timeout=5)
        
        self.gui.update_status("중지됨")

    def __del__(self):
        """소멸자에서 리소스 정리"""
        if (hasattr(self, 'driver') and self.driver):
            try:
                self.driver.quit()
            except:
                pass
        try:
            self.cleanup_chrome_processes()
        except:
            pass

    def load_email_accounts(self):
        """email_list.json에서 계정 목록을 로드합니다.""" 
        try:
            # 실행 파일과 같은 경로의 email_list.json 파일 사용
            email_list_path = os.path.join(self.script_dir, 'email_list.json')
            if os.path.exists(email_list_path):
                with open(email_list_path, 'r', encoding='utf-8') as f:
                    self.email_accounts = json.load(f)
                self.gui.update_status(f"이메일 계정 {len(self.email_accounts)}개 로드됨")
                return True
        except Exception as e:
            self.gui.update_status(f"이메일 계정 로드 실패: {str(e)}")
            return False

    def save_account_bands(self, email, new_bands, posted_bands=None):
        """계정별 밴드 목록 및 작성 이력 저장"""
        try:
            # 기존 데이터 로드
            existing_bands, existing_posted = self.load_account_bands(email)
            
            # posted_bands가 None이면 기존 이력 유지 (작성 시간 포함)
            if posted_bands is None:
                posted_bands = existing_posted
                
            filename = f"{email.replace('@', '_at_')}.json"
            filepath = os.path.join(self.account_bands_dir, filename)
            
            data = {
                'bands': new_bands,
                'posted_bands': posted_bands,
                'last_updated': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'account_email': email  # 계정 식별을 위한 추가 정보
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            
            # 로그에 작성 시간 정보 포함
            recent_posts = [f"{band['name']} ({band.get('posted_time', '시간 없음')})" 
                           for band in posted_bands[-5:]]  # 최근 5개 포스팅만 표시
            self.gui.update_status(
                f"계정 {email}의 밴드 목록 저장됨\n"
                f"작성완료: {len(posted_bands)}개\n"
                f"최근 작성: {', '.join(recent_posts)}"
            )
        except Exception as e:
            self.gui.update_status(f"계정 밴드 목록 저장 실패: {str(e)}")

    def load_account_bands(self, email):
        """계정별 밴드 목록 및 작성 이력 로드"""
        try:
            filename = f"{email.replace('@', '_at_')}.json"
            filepath = os.path.join(self.account_bands_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get('bands', []), data.get('posted_bands', [])
            return [], []
        except Exception as e:
            self.gui.update_status(f"계정 밴드 목록 로드 실패: {str(e)}")
            return [], []

    def get_remaining_bands(self, email, bands):
        """아직 작성하지 않은 밴드 목록 반환 (탈퇴한 밴드 제외)"""
        _, posted_bands = self.load_account_bands(email)
        posted_urls = [band['url'] for band in posted_bands]
        left_bands = self.load_left_bands()
        left_urls = [band['url'] for band in left_bands]
        
        # 탈퇴하지 않았고 아직 포스팅하지 않은 밴드만 반환
        return [band for band in bands 
                if band['url'] not in posted_urls 
                and band['url'] not in left_urls]

    def update_posted_bands(self, email, band):
        """작성 완료된 밴드 추가"""
        bands, posted_bands = self.load_account_bands(email)
        if not any(pb['url'] == band['url'] for pb in posted_bands):
            # 밴드 정보에 작성 시간 추가
            band_with_time = band.copy()
            band_with_time['posted_time'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            posted_bands.append(band_with_time)
            self.save_account_bands(email, bands, posted_bands)
            self.gui.update_status(f"[작성 시간 기록] {band['name']} - {band_with_time['posted_time']}")

    def load_left_bands(self):
        """탈퇴한 밴드 목록 로드"""
        try:
            if os.path.exists(self.left_bands_file):
                with open(self.left_bands_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            self.gui.update_status(f"탈퇴 밴드 목록 로드 실패: {str(e)}")
            return []

    def save_left_band(self, band_info):
        """탈퇴한 밴드 정보 저장"""
        try:
            left_bands = self.load_left_bands()
            if not any(b['url'] == band_info['url'] for b in left_bands):
                band_info['left_date'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                left_bands.append(band_info)
                with open(self.left_bands_file, 'w', encoding='utf-8') as f:
                    json.dump(left_bands, f, ensure_ascii=False, indent=4)
                self.gui.update_status(f"밴드 탈퇴 목록에 추가됨: {band_info['name']}")
        except Exception as e:
            self.gui.update_status(f"밴드 탈퇴 정보 저장 실패: {str(e)}")

    def leave_band(self, band_info):
        """밴드 탈퇴 처리"""
        try:
            # 밴드 설정 페이지로 이동
            settings_link = WebDriverWait(self.driver, 7).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'a.bandSettingLink'))  # 수정
            )
            self.human_like_click(settings_link)
            time.sleep(5)

            # 탈퇴하기 버튼 클릭
            try:
                leave_btn = WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'button._btnLeaveBand'))
                )
                self.driver.execute_script("arguments[0].scrollIntoView(true);", leave_btn)
                time.sleep(5)

                try:
                    self.human_like_click(leave_btn)  # 일반 클릭 시도
                except:
                    self.driver.execute_script("arguments[0].click();", leave_btn)  # 강제 클릭 fallback

                time.sleep(3)
            except Exception as e:
                self.gui.update_status(f"[오류] 탈퇴하기 버튼 클릭 실패: {str(e)}")
                return False

            # 체크박스 클릭
            checkbox = WebDriverWait(self.driver, 7).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'input#delete._checkBandLeave'))  # 수정
            )
            self.human_like_click(checkbox)
            time.sleep(1)

            # 최종 탈퇴하기 버튼 클릭
            final_leave_btn = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.uButton.-confirm._btnLeaveBand'))  # 수정
            )
            self.human_like_click(final_leave_btn)
            time.sleep(5)

            # 탈퇴 정보 저장
            self.save_left_band(band_info)
            self.gui.update_status(f"밴드 탈퇴 완료: {band_info['name']}")
            return True

        except Exception as e:
            self.gui.update_status(f"밴드 탈퇴 실패: {str(e)}")
            return False

    def update_status(self, message):
        """상태 업데이트 및 로그 파일에 기록"""
        self.gui.update_status(message)
        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                f.write(f"[{timestamp}] {message}\n")
        except:
            pass

def check_for_leaving_band(html, log_func):
    """환영 게시물을 제외한 최근 3개 게시물의 조회수 표시 여부 확인"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # 모든 게시물 가져오기
    posts = soup.select('div.cCard.gContentCardShadow article.cContentsCard')
    
    # 일반 게시물만 필터링 (환영 메시지 제외)
    normal_posts = []
    for post in posts:
        text = post.get_text()
        if '환영' not in text and '가입' not in text:
            normal_posts.append(post)
        if len(normal_posts) >= 3:
            break
    
    # 최근 3개 게시물 분석
    missing_count = 0
    analyzed_count = 0
    
    for idx, post in enumerate(normal_posts[:3], 1):
        if not post.select_one('div.postCount'):
            log_func(f"[게시물 분석] {idx}번째 일반 게시물: 조회수 표시 없음")
            missing_count += 1
        else:
            log_func(f"[게시물 분석] {idx}번째 일반 게시물: 조회수 표시 있음")
        analyzed_count += 1
    
    # 분석된 모든 게시물에 조회수가 없으면 탈퇴 대상
    if analyzed_count > 0 and missing_count == analyzed_count:
        log_func(f"[탈퇴 결정] 분석된 {analyzed_count}개 게시물 모두 조회수 표시 없음")
        return True
    
    log_func(f"[유지 결정] 조회수 없는 게시물: {missing_count}/{analyzed_count}")
    return False

if __name__ == "__main__":
    gui = BandAutoGUI()
    gui.run()