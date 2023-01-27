

window.addEventListener('load', (event) => {
    fetch("cache.json")
        .then(response => response.json())
        .then(mangas => {
            // console.log(data);
            addToDiv(mangas);
        })
        .catch((reason) => {});
})

function addEventToDivs() {
    document.querySelectorAll('.mangaDiv').forEach((div) => {
        div.addEventListener('mouseenter', (event) => {
            div.style.width = "20%";
            div.style.height = "73%";
        })
    })
    

    document.querySelectorAll('.mangaDiv').forEach((div) => {
        div.addEventListener('mouseleave', (event) => {
            div.style.width = "17%";
            div.style.height = "70%";
        })
    })

    document.querySelectorAll('.mangaDiv').forEach((div) => {

        div.addEventListener('click', (event) => {
            
            const mangaName =  event.target.id; // manga-name

            fetch(`/getChapters?mangaName=${mangaName}`)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((chapters) => { // array of object (chapters)
                    const chapterList = document.getElementById('chapterList'); 
                    chapterList.innerHTML = "";

                    chapters.forEach((chap, i) => {
                        
                        const chapterTitle = chap['chapterTitle'];
                        const chapterIndex = chap['chapterIndex'];
                        if (chapterIndex.match(/\./)) { // has dot
                            var index = chapterIndex.match(/\d+\.\d+/);
                        }
                        else {
                            var index = chapterIndex.match(/\d+$/);
                        }

                        // const chapterUrl = chap['chapterUrl'];
                        
                        chapterList.innerHTML += (
                            '<div id="chapter-display">' +
                                '<div id="chapter-title">' + 
                                    `<a id=${mangaName} class="chapterLink" href="#chapter-title"> <h2 id=${index}>${chapterIndex}: ${chapterTitle}</h2> </a>` +
                                '</div>' +
                            '</div>'
                        );

                    })
                })
                .then(() => {
                    var scansDlDiv = document.getElementById('downloadedScansDiv');

                    document.querySelectorAll('.chapterLink').forEach((elem, i) => {
                        elem.addEventListener('click', (ev) => {
                            
                            //console.log(elem);
                            elem.style.color = "red";
                            const mangaName = elem.id;
                            const chapterIndex = elem.children[0].id;
                            const chapterTitle = elem.children[0].outerText;
                            // fetch(`/downloadScan?mangaName=${mangaName}&chapterIndex=${chapterIndex}`);

                            scansDlDiv.innerHTML += (
                                '<div id="chapter-display">' +
                                    '<div id="chapter-title">' + 
                                        `<h2>${chapterTitle}</h2>` +
                                    '</div>' +
                                '</div>'
                            )

                        })

                    })
                })
        })
    })
}


function writeToCache(data) {
    fetch('/writeCache', {
        method: "POST",
        body: data, // JSON data
        headers: {
            "Content-Type": "application/json"
        }
    });
}

function addToDiv(array) {
    var div = document.getElementById('mangaDisplay');
    div.innerHTML = "";

    for (var i = 0; i < 25; i++) {
        var manga = array[i];
        var newMangaName = manga.mangaName.replace(/[-|_]/g, ' ');

        div.innerHTML += (
            `<div class="mangaDiv">` +
                '<a href="#">' +
                    `<div class=\"mangaDivThumbnail\">` +
                        `<img id="${manga.mangaName}" class="mangaThumbnail" src=${manga.thumbnail} />` +
                    "</div>" +
                    `<h3 id="${manga.mangaName}" class="mangaDisplayName">${newMangaName}</h3>` +
                '</a>' +
            "</div>"
        )
    }

    addEventToDivs(); // RE-add event to the new divs.

}

document.getElementById('btn-refresh').addEventListener('click', async (ev) => {
    const data = await fetch('/mangaList');
    const mangas = await data.json();
    const mangasJSON = JSON.stringify(mangas);
    writeToCache(mangasJSON);
    addToDiv(mangas);

})

let inputBar = document.getElementById('searchBar')
inputBar.addEventListener('input', (event) => {
    console.log(inputBar.value);
})

/*
document.getElementById('btn-caca').addEventListener('click', (ev) => {
    const mangaName = "black-clover";

    fetch(`/getChapters?mangaName=${mangaName}`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((chapters) => { // array of object (chapters)
            const chapterList = document.getElementById('chapterList'); 

            chapters.forEach((elem, i) => {
                const chapterTitle = elem['chapterTitle'];
                const chapterIndex = elem['chapterIndex'];
                const chapterUrl = elem['chapterUrl'];
                

                chapterList.innerHTML += (
                    '<div id="chapter-display">' +
                        '<div id="chapter-title">' + 
                            `<a id=${mangaName} class="chapterLink" href="#"> <h2>${chapterIndex}: ${chapterTitle}</h2> </a>` +
                        '</div>' +
                    '</div>'
                );

                // add event to listen when click to downlaod

            })
        })
})
*/

