function startMBTITest() {
    // index.html로 이동하면서 테스트 시작 파라미터 전달
    sessionStorage.setItem('startTest', 'true');
    window.location.href = 'index.html';
}
