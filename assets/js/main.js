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
      popupCounter.textContent = `${counter}초 후 광고 시청이 시작됩니다...`;
      counter--;

      if (counter < 0) {
          clearInterval(countdown);
          popupCounter.textContent = "광고를 시작할 준비가 되었습니다.";
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
