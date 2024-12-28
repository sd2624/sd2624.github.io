document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('colorTestForm');
    const sections = document.querySelectorAll('.question-section');
    const nextButtons = document.querySelectorAll('.next-btn');
    const loadingPopup = document.getElementById('loadingPopup');
    const adContainer = document.getElementById('adContainer');
    let currentSection = 0;

    // 초기 섹션 활성화
    sections[currentSection].classList.add('active');

    // '다음' 버튼 클릭 시 섹션 전환
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // 현재 섹션 숨기기
            sections[currentSection].classList.remove('active');
            // 다음 섹션 활성화
            currentSection++;
            if (currentSection < sections.length) {
                sections[currentSection].classList.add('active');
                // 스크롤 이동
                sections[currentSection].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 폼 제출 시 결과 계산
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // 질문에 대한 응답 수집
        const responses = [];
        for (let i = 1; i <= 5; i++) {
            const answer = document.querySelector(`input[name="q${i}"]:checked`)?.value;
            if (answer) {
                responses.push(answer);
            }
        }

        // 모든 질문에 답했는지 확인
        if (responses.length < 5) {
            alert('모든 질문에 답해주세요!');
            return;
        }

        // 색상별 선택 횟수 계산
        const colorCounts = {};
        responses.forEach(color => {
            if (colorCounts[color]) {
                colorCounts[color]++;
            } else {
                colorCounts[color] = 1;
            }
        });

        // 가장 많이 선택된 색상 찾기
        let dominantColor = '';
        let maxCount = 0;
        for (const color in colorCounts) {
            if (colorCounts[color] > maxCount) {
                maxCount = colorCounts[color];
                dominantColor = color;
            } else if (colorCounts[color] === maxCount) {
                // 동점인 경우, 먼저 나온 색상을 우선
            }
        }

        // 결과 해석
        let result = '';
        switch(dominantColor) {
            case 'red':
                result = '빨강';
                break;
            case 'blue':
                result = '파랑';
                break;
            case 'yellow':
                result = '노랑';
                break;
            case 'green':
                result = '녹색';
                break;
            case 'purple':
                result = '보라';
                break;
            case 'black':
                result = '검정';
                break;
            case 'white':
                result = '흰색';
                break;
            default:
                result = '알 수 없음';
        }

        // 결과 표시
        document.getElementById('resultText').innerText = `${result} 색상이 당신의 주요 색상입니다!`;
        document.getElementById('result').classList.remove('hidden');

        // 상세 결과 버튼에 dominantColor 저장
        document.getElementById('detailedResultBtn').dataset.color = dominantColor;

        // 스크롤 이동
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    });

    // 상세 결과 보기 버튼 클릭 시
    document.getElementById('detailedResultBtn').addEventListener('click', function() {
        const color = this.dataset.color;
        if (color) {
            // 결과 저장 (로컬 스토리지 사용)
            localStorage.setItem('colorTestResult', color);

            // 로딩 팝업과 광고 표시
            loadingPopup.style.display = 'flex';
            adContainer.style.display = 'block';

            // 7초 후 결과 페이지로 이동
            setTimeout(() => {
                loadingPopup.style.display = 'none';
                adContainer.style.display = 'none';
                window.location.href = 'results.html';
            }, 7000);
        } else {
            alert('결과가 없습니다. 테스트를 먼저 완료해주세요.');
        }
    });
});