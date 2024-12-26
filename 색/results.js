document.addEventListener('DOMContentLoaded', function() {
    const color = localStorage.getItem('colorTestResult');
    const detailedResultDiv = document.getElementById('detailedResult');
    const nextBtn = document.getElementById('nextBtn');
    let currentStep = 0;
    let sections = [];

    if (color) {
        // colors.json 파일에서 데이터 불러오기
        fetch('colors.json')
            .then(response => response.json())
            .then(data => {
                if (data[color]) {
                    const colorData = data[color];
                    // 섹션 데이터 구성
                    sections = [
                        {
                            id: 'section1',
                            title: `1. ${colorData.title}의 정의`,
                            content: `
                                <p>${colorData.description}</p>
                                <ul>
                                    ${colorData.psychological_traits.map(trait => `<li><strong>${trait}</strong></li>`).join('')}
                                </ul>
                            `
                        },
                        {
                            id: 'section2',
                            title: `2. ${colorData.title}의 주요 감정`,
                            content: `
                                <p>${colorData.title}이 느끼는 주요 감정은 다음과 같습니다:</p>
                                <ul>
                                    ${colorData.psychological_traits.map(trait => `<li>${trait}</li>`).join('')}
                                </ul>
                            `
                        },
                        {
                            id: 'section3',
                            title: `3. ${colorData.title}의 행동 패턴`,
                            content: `
                                <p>${colorData.title}은 감정 표현을 최소화하며 다음과 같은 행동을 보입니다:</p>
                                <ul>
                                    <li>일상에서의 안정성과 지속적인 노력</li>
                                    <li>타인과의 조화로운 협력</li>
                                    <li>감정을 솔직하게 표현하려 하지 않음</li>
                                    <li>신중하고 체계적인 문제 해결</li>
                                </ul>
                            `
                        },
                        {
                            id: 'section4',
                            title: `4. ${colorData.title}의 심리적 특징`,
                            content: `
                                <p>${colorData.title}의 심리는 다음과 같은 특징을 가지고 있습니다:</p>
                                <ul>
                                    ${colorData.psychological_traits.map(trait => `<li>${trait}</li>`).join('')}
                                </ul>
                            `
                        },
                        {
                            id: 'section5',
                            title: `5. ${colorData.title}의 생활 속 조언`,
                            content: `
                                <p>${colorData.advice}</p>
                            `
                        },
                        {
                            id: 'section6',
                            title: `6. ${colorData.title}의 결론`,
                            content: `
                                <p>${colorData.description.slice(0, 200)}...</p>
                            `
                        }
                    ];

                    // 섹션 생성 및 추가
                    sections.forEach((section, index) => {
                        const sectionElement = document.createElement('section');
                        sectionElement.classList.add('section');
                        if (index === 0) sectionElement.classList.add('active'); // 첫 번째 섹션만 표시
                        sectionElement.id = section.id;
                        sectionElement.innerHTML = `
                            <h2>${section.title}</h2>
                            ${section.content}
                        `;
                        detailedResultDiv.appendChild(sectionElement);
                    });
                } else {
                    detailedResultDiv.innerHTML = `<p>상세 결과를 불러올 수 없습니다.</p>`;
                    nextBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading colors.json:', error);
                detailedResultDiv.innerHTML = `<p>상세 결과를 불러오는 중 오류가 발생했습니다.</p>`;
                nextBtn.style.display = 'none';
            });
    } else {
        detailedResultDiv.innerHTML = `<p>결과가 없습니다. 테스트를 먼저 완료해주세요.</p>`;
        nextBtn.style.display = 'none';
    }

    // 다음 버튼 클릭 시
    nextBtn.addEventListener('click', () => {
        if (currentStep < sections.length - 1) {
            // 현재 섹션 숨기기
            const currentSection = document.getElementById(sections[currentStep].id);
            currentSection.classList.remove('active');
            
            // 다음 섹션 표시
            currentStep++;
            const nextSection = document.getElementById(sections[currentStep].id);
            nextSection.classList.add('active');

            // 스크롤 이동
            nextSection.scrollIntoView({ behavior: 'smooth' });

            // 마지막 섹션일 경우 버튼 숨기기
            if (currentStep === sections.length - 1) {
                nextBtn.style.display = 'none';
            }
        }
    });
});
