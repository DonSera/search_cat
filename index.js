let catDiv = document.getElementById('catDiv');
let inputType = document.getElementById('inputType');

async function setType() {
    loadingImg();

    const imgUrlArray = []; //겹치는 url 확인용
    const type = inputType.value;

    if (!type) {
        catDiv.innerHTML = '고양이 종류를 입력해주세요.';
        return;
    }

    const searchUrl = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + type;
    console.log(type);

    try {
        const options = {
            root: null,
            rootMargin: '0px 0px 10px 0px', //(top, right, bottom, left)
            threshold: 1.0 //100% 보여질때 실행
        }

        let callback = (entries, observer) => {
            entries.forEach( entry => {
                // 관찰 대상이 viewport 안에 들어온 경우 image 로드
                if (entry.isIntersecting) {
                    console.log(entry);
                    entry.target.src = entry.target.dataset.src;
                    observer.unobserve(entry.target);
                }
            })
        }

        // IntersectionObserver 를 등록한다.
        const observer = new IntersectionObserver(callback, options)

        const jsonResult = await getJson(searchUrl); // json 호출
        addImgLoop(0, jsonResult.length, imgUrlArray, jsonResult);

        // 관찰할 대상을 선언하고, 해당 속성을 관찰시킨다.
        const images = document.querySelectorAll('.lazy');
        images.forEach((el) => {
            observer.observe(el);
        })

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

function loadingImg() {
    // 로딩 동그라미가 나오게
    catDiv.innerHTML = `<span class="loading" id="spinLoadDiv">
                            <div class="spinner-loading"></div>
                            <div class="text-loading">Loading</div>
                        </span>`;
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
        if (i < 15) {
            htmlString += `<div class="cat-card">
                            <img src="${imgUrl}" alt="고양이" width="200" height="200">
                            <p>${nameArray[0]}</p>
                            <p>${nameArray[1]}</p>
                        </div>`;
        } else {
            htmlString += `<div class="cat-card">
                            <img data-src="${imgUrl}" class="lazy" alt="고양이" width="300" height="300">
                            <p>${nameArray[0]}</p>
                            <p>${nameArray[1]}</p>
                        </div>`;
        }

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