// 팝업 광고 기능

window.onload = function() {
  if (!shouldShowPopup()) return;

  // 5초에서 10초 사이의 랜덤 딜레이 설정
  let randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

  setTimeout(showPopup, randomDelay);
};

function showPopup() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('popup').style.display = 'block';
  document.body.style.overflow = 'hidden'; // 스크롤 비활성화

  let counter = 5;
  let popupCounter = document.getElementById('popupCounter');
  let countdown = setInterval(function() {
      counter--;
      popupCounter.textContent = `${counter}초 후 광고 시청이 시작됩니다...`;
      if (counter <= 0) {
          clearInterval(countdown);
          popupCounter.textContent = "광고를 시작할 준비가 되었습니다.";
          showAd(); // 카운터 후 광고를 자동으로 표시
      }
  }, 1000);
}

function closePopup() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('popup').style.display = 'none';
  document.body.style.overflow = ''; // 스크롤 활성화
}

function showAd() {
  document.getElementById('popup').style.display = 'none'; // 팝업을 닫음
  document.getElementById('adContainer').style.display = 'block'; // 광고 컨테이너 표시
  document.body.style.overflow = 'hidden'; // 스크롤 비활성화

  try {
      (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
      console.error("Google Ads 스크립트 로드 오류:", e);
  }

  let adCounter = document.getElementById('adCounter');
  let closeButton = document.querySelector('.close-btn');
  closeButton.style.display = 'none'; // 초기에는 닫기 버튼 숨김

  // 5초 광고 닫기 카운터
  let counter = 1;
  let countdown = setInterval(function() {
      counter--;
      adCounter.textContent = `광고가 ${counter}초 후에 닫힐 수 있습니다...`;
      if (counter <= 0) {
          clearInterval(countdown);
          adCounter.textContent = "광고를 닫을 수 있습니다.";
          closeButton.style.display = 'inline';

          // 페이지 이동 7초 카운터
          let redirectCounter = document.getElementById('redirectCounter');
          let redirectTime = 1;
          let redirectCountdown = setInterval(function() {
              redirectTime--;
              redirectCounter.textContent = `${redirectTime}초 후 페이지를 이동합니다...`;
              if (redirectTime <= 0) {
                  clearInterval(redirectCountdown);
                  
                  // postUrls 배열에서 무작위 페이지 선택 및 이동
                  if (postUrls.length > 0) {
                      const randomPage = postUrls[Math.floor(Math.random() * postUrls.length)];
                      window.location.href = randomPage;
                  } else {
                      console.error("postUrls 배열이 비어 있습니다.");
                  }
              }
          }, 1000);
      }
  }, 1000);
}

function closeAd() {
  document.getElementById('adContainer').style.display = 'none';
  document.body.style.overflow = '';
  alert('광고 시청이 완료되었습니다.');
  incrementClickCount();
}

function incrementClickCount() {
  let currentDate = new Date().toISOString().split('T')[0];
  let clickData = JSON.parse(localStorage.getItem('clickData')) || { date: currentDate, count: 0 };

  if (clickData.date !== currentDate) {
      clickData = { date: currentDate, count: 0 };
  }

  clickData.count++;
  localStorage.setItem('clickData', JSON.stringify(clickData));
}

function shouldShowPopup() {
  let currentDate = new Date().toISOString().split('T')[0];
  let clickData = JSON.parse(localStorage.getItem('clickData')) || { date: currentDate, count: 0 };
  return clickData.count < 20;
}