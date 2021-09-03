let catDiv = document.getElementById('catDiv');
let inputType = document.getElementById('inputType');

async function setType() {
    let imgUrlArray = [];
    catDiv.innerHTML = '';

    const type = inputType.value;
    const searchUrl = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + type;
    console.log(type);
    // console.log(searchUrl);

    try {
        const res = await fetch(searchUrl);
        const json = await res.json();

        if (json.message) {
            // 결과를 받지 못한 경우
            catDiv.append('None');
        } else {
            const dataArray = json['data'];
            if (Object.keys(dataArray).length === 0) {
                // 안에 아무것도 없는 경우
                catDiv.append('None');
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

                    catDiv.append(img);
                }
            }
        }
    } catch (e) {
        // 에러
        catDiv.append('Error');
    }

}


let timer;

function debounce() {
    if (timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        setType()
    }, 500)
}

