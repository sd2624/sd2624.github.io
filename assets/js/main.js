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
          popupCounter.textContent = "이동 중입니다...";
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
  let currentDate = new Date().toISOString().split('T')[0];
  let clickData = JSON.parse(localStorage.getItem('clickData')) || { date: currentDate, count: 0 };
  return clickData.count < 20;
}

function redirectToRandomPage() {
  if (postUrls.length > 0) {
      const randomPage = postUrls[Math.floor(Math.random() * postUrls.length)];
      window.location.href = randomPage;
  } else {
      console.error("postUrls 배열이 비어 있습니다.");
  }
}
