async function setType() {
    let imgUrlArray = [];
    document.getElementById('catDiv').innerHTML = '';

    const type = document.getElementById('inputType').value;
    const searchUrl = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + type;
    console.log(type);
    // console.log(searchUrl);

    try {
        const res = await fetch(searchUrl);
        const json = await res.json();

        if (json.message) {
            // 결과를 받지 못한 경우
            document.getElementById('catDiv').append('None');
        } else {
            const dataArray = json['data'];
            if (Object.keys(dataArray).length === 0) {
                // 안에 아무것도 없는 경우
                document.getElementById('catDiv').append('None');
            } else {
                let imgUrl;

                for (let i = 0; i < Object.keys(dataArray).length; i++) {
                    imgUrl = dataArray[i]['url'];
                    if (imgUrlArray.includes(imgUrl)) continue; // 똑같은거 제외
                    const img = document.createElement("img");
                    img.src = imgUrl;
                    img.width = 200;
                    img.height = 200;
                    imgUrlArray.push(imgUrl);

                    document.getElementById('catDiv').append(img);
                }
            }
        }
    } catch (e) {
        // 에러
        document.getElementById('catDiv').append('error');
    }

}

let perTime = 0;
let timer;

let debouncing;
function debounce () {
    if (debouncing) {
        clearTimeout(debouncing)
    }
    debouncing = setTimeout(() => {
        setType()
    }, 500)
}

function getTime() {
    // 타이핑이 끝난 경우 결과 도출
    let word = document.getElementById('inputType').value; // 타이핑한 글자
    let nowTime = Date.now();       //타이핑 시간
    let abTime = nowTime - perTime; //이전 타이핑과의 시간차
    // console.log(abTime);

    if (abTime > 100000) {
        // 처음 입력하는 경우
        perTime = nowTime;
        startTimer();
        // console.log("first");
    } else if (abTime > 600) {
        // 덧붙이는 작업을 하는 경우
        perTime = nowTime;
        startTimer();
        // console.log("start");
    } else if (word === "") {
        // 입력창에 아무 글이 없는 경우
        perTime = nowTime;
        clearInterval(timer);
        console.log('no word');
    } else if (abTime > 500 && abTime < 599) {
        // 입력한지 일정이상 이면 결과 도출
        perTime = nowTime;
        clearInterval(timer);
        console.log('enter');
        setType().then(r => r);
    } else {
        // 빠르게 단어 입력
        perTime = nowTime;
    }
}

function startTimer() {
    // 일정주기로 시간 측정
    timer = setInterval(getTime, 500);
}

