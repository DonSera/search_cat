let catDiv = document.getElementById('catDiv');
let inputType = document.getElementById('inputType');

async function setType() {
    catDiv.innerHTML = `<span class="loading" id="spinLoadDiv">
                            <div class="spinner-loading"></div>
                            <div class="text-loading">Loading</div>
                        </span>`;

    const imgUrlArray = []; //겹치는 url 확인용
    const type = inputType.value;

    if (!type) {
        catDiv.innerHTML = '고양이 종류를 입력해주세요.';
        return;
    }

    const searchUrl = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + type;
    console.log(type);

    try {
        const jsonResult = await getJson(searchUrl); // json 호출
        addImgLoop(0, jsonResult.length, imgUrlArray, jsonResult)
    } catch (e) {
        // 에러
        console.log(e);
        catDiv.append('Error');
    }

}

async function getJson(url) {
    // api에 url를 불러서 json으로 날린다
    console.log('start fetch');
    const json = await fetch(url).then(res => res.json());
    console.log('end fetch');
    if (json.message) {
        // 결과를 받지 못한 경우
        catDiv.innerHTML = 'Message None';
        return [];
    } else {
        const jsonData = json.data;
        if (jsonData.length === 0) {
            catDiv.innerHTML = 'Get None';
            return [];
        }  // 입력된 글자가 없는 경우
        else return jsonData;
    }
}

function addImgLoop(start, end, imgUrlArray, dataArray) {
    // 이미지&종류 loop를 div에 넣기
    let imgUrl;
    let name;
    let htmlString = ``;
    catDiv.innerHTML = ''; // clear
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