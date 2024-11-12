---
layout: archive
---

<!-- 상단 광고-->
<div class="ad-container" style="text-align: center; padding-bottom: 20px;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-format="autorelaxed"
       data-ad-client="ca-pub-9374368296307755"
       data-ad-slot="4454543532"></ins>
  <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>

{{ content }}

<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% if paginator %}
  {% assign posts = paginator.posts %}
{% else %}
  {% assign posts = site.posts %}
{% endif %}

{% assign entries_layout = page.entries_layout | default: 'list' %}
<div class="entries-{{ entries_layout }}">
  {% include documents-collection.html entries=posts type=entries_layout %}
</div>

{% include paginator.html %}

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">


  <style>
    /* 팝업 및 오버레이 스타일 */
    #overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    #popup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 400px;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        z-index: 1000;
        text-align: center;
    }
  </style>

  <script>
    // _posts 폴더의 포스트 URL 목록을 Jekyll을 사용해 JavaScript 배열로 생성
    const postUrls = [
      {% for post in site.posts %}
        "{{ post.url }}"{% if forloop.last == false %},{% endif %}
      {% endfor %}
    ];

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
            popupCounter.textContent = `${counter}초 후 페이지로 이동합니다...`;
            if (counter <= 0) {
                clearInterval(countdown);
                // postUrls 배열에서 무작위 페이지 선택 및 이동
                const randomPage = postUrls[Math.floor(Math.random() * postUrls.length)];
                window.location.href = randomPage;
            }
        }, 1000);
    }

    function closePopup() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
        document.body.style.overflow = ''; // 스크롤 활성화
    }

    function shouldShowPopup() {
        let currentDate = new Date().toISOString().split('T')[0];
        let clickData = JSON.parse(localStorage.getItem('clickData')) || { date: currentDate, count: 0 };
        return clickData.count < 2;
    }
  </script>
</head>
<body>


  <!-- 오버레이 및 팝업 콘텐츠 -->
  <div id="overlay" onclick="closePopup()"></div>
  <div id="popup">
      <h2>kkdamoa에 오신 것을 환영합니다</h2>
      <p>5초 후 페이지로 이동합니다.</p>
      <p id="popupCounter">5초 후 페이지로 이동합니다...</p>
      <button onclick="closePopup()">닫기</button>
  </div>
  
</body>
</html>
