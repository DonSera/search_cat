let catDiv = document.getElementById('catDiv');
let inputType = document.getElementById('inputType');
let loadingDiv = document.getElementById('loadDiv');

async function setType() {
    loadingDiv.innerHTML = 'Loading'; // 로딩 띄우기
    const imgUrlArray = []; //겹치는 url 확인용
    const type = inputType.value;
    const searchUrl = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + type;
    console.log(type);

    try {
        console.log('start fetch');
        const res = await fetch(searchUrl);
        const json = await res.json();
        console.log('end fetch');
        loadingDiv.innerHTML = ''; // 로딩 삭제
        catDiv.innerHTML = ''; // 이미지 화면에서 지우기

        if (json.message) {
            // 결과를 받지 못한 경우
            catDiv.append('Message None');
        } else {
            const dataArray = json.data;
            const arrayLen = Object.keys(dataArray).length;

            if (arrayLen === 0) {
                // 입력된 글자가 없는 경우
                catDiv.append('Get None');
            } else {
                const standLoop = 15; //한번에 로딩할 크기
                if (arrayLen > standLoop) {
                    const loopDivision = arrayLen / standLoop;
                    for (let loop = 0; loop < loopDivision; loop++) {
                        addImgLoop(0, standLoop, imgUrlArray, dataArray);
                    }
                    addImgLoop(loopDivision * standLoop, arrayLen, imgUrlArray, dataArray);
                } else {
                    addImgLoop(0, arrayLen, imgUrlArray, dataArray);
                }
            }
        }
    } catch (e) {
        // 에러
        catDiv.append('Error');
    }

}

function addImgLoop(start, end, imgUrlArray, dataArray) {
    // 이미지를 div에 넣기
    let imgUrl;
    let name;
    let htmlString = ``;
    for (let i = start; i < end; i++) {
        imgUrl = dataArray[i].url;
        name = dataArray[i].name;
        const nameArray = name.split(' / ');
        if (imgUrlArray.includes(imgUrl)) continue; // 똑같은거 제외
        imgUrlArray.push(imgUrl);
        htmlString += `<div class="cat-card">
                            <img src="${imgUrl}" alt="고양이" width="200" height="200">
                            <p>${nameArray[0]}</p>
                            <p>${nameArray[1]}</p>
                        </div>`;
    }
    const divImg = document.createElement("div");
    divImg.innerHTML = htmlString;
    catDiv.append(divImg);
}

let timer;

function debounce() {
    // 단어 단위로 검색정갱신
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        setType();
    }, 500);
}