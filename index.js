let catDiv = document.getElementById('catDiv');
let inputType = document.getElementById('inputType');

async function setType() {
    loadingImg();

동    //겹치는 url 확인용
    const imgUrlArray = [];
    const type = inputType.value;

    if (!type) {
        catDiv.innerHTML = '고양이 종류를 입력해주세요.';
        return;
    }

    console.log(type);

    try {
        // IntersectionObserver 를 등록한다.
        const observer = makeInterOb;

        // json 호출
        const jsonResult = await getJson(type);
        addImgLoop(0, jsonResult.length, imgUrlArray, jsonResult);

        // 일치하는 리스트 얻기
        const images = document.querySelectorAll('.lazy');
        // 속성 관찰
        images.forEach((el) => {
            //등록=관찰 할때 사용
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
    const searchUrl = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + url;

    console.log('start fetch');
    const json = await fetch(searchUrl).then(res => res.json());
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

function makeInterOb() {
    // intersection observer 만들어서 내보내기
    const options = {
        root: null,
        rootMargin: '0px 0px 10px 0px', //(top, right, bottom, left)
        threshold: 1.0 //100% 보여질때 실행
    }

    let callback = (entries, observer) => {
        entries.forEach(entry => {
            // 관찰 대상이 viewport 안에 들어온 경우 image 로드
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                // 관찰을 멈추고 싶을 때 (이미 이미지 로드 완료)
                observer.unobserve(entry.target);
            }
        })
    }

    return new IntersectionObserver(callback, options)
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

        // 똑같은거 제외
        if (imgUrlArray.includes(imgUrl)) continue;
        imgUrlArray.push(imgUrl);

        if (i < 10) {
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