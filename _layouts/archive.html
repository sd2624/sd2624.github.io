window.onload = function() {
  if (!shouldShowPopup()) return;

  let randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
  setTimeout(showPopup, randomDelay);
};

function showPopup() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('popup').style.display = 'block';
  document.body.style.overflow = 'hidden';

  let counter = 5;
  let popupCounter = document.getElementById('popupCounter');
  let countdown = setInterval(function() {
      popupCounter.textContent = `${counter}초 후 이동합니다...`;
      counter--;

      if (counter < 0) {
          clearInterval(countdown);
          redirectToRandomPage();
      }
  }, 1000);
}

function closePopup() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('popup').style.display = 'none';
  document.body.style.overflow = '';
}

function shouldShowPopup() {
  const currentTime = new Date().getTime();
  const ipVisitKey = 'ipVisitData';
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const clientIp = 'user-ip-address'; // 실제 IP는 서버 사이드에서 받아와야 합니다.

  let ipVisitData = JSON.parse(localStorage.getItem(ipVisitKey)) || {};

  function resetData() {
      Object.keys(ipVisitData).forEach(ip => {
          if (currentTime - ipVisitData[ip].lastVisit > ONE_DAY) {
              delete ipVisitData[ip];
          }
      });
      localStorage.setItem(ipVisitKey, JSON.stringify(ipVisitData));
  }

  resetData();

  const visitData = ipVisitData[clientIp] || { count: 0, lastVisit: 0 };
  visitData.lastVisit = currentTime;

  if (visitData.count >= 40) {
      return false; // 5번째 접속 시 팝업 표시하지 않음
  }

  visitData.count += 1;
  ipVisitData[clientIp] = visitData;
  localStorage.setItem(ipVisitKey, JSON.stringify(ipVisitData));

  return true;
}

function redirectToRandomPage() {
  if (postUrls.length > 0) {
      const randomPage = postUrls[Math.floor(Math.random() * postUrls.length)];
      window.location.href = randomPage;
  } else {
      console.error("postUrls 배열이 비어 있습니다.");
  }
}
