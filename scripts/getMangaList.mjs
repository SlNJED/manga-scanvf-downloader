import cheerio from 'cheerio'

let headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/93.0.0.0 (Edition std-1)'
}

let pageIndex = 1;
let mangas = []

async function getMangas() {
    let mangasUrl = `https://www.scan-vf.net/filterList?page=${pageIndex}&cat=&alpha=&sortBy=name&asc=true&author=&artist=&tag=`;

    return fetch(mangasUrl, headers)
        .then((res) => {     
            if (res.ok) {return res.text();}
        })
        .then((html) => {
            if (html.includes("Aucun Manga trouvé !")) {
                return mangas;
            }

            const $ = cheerio.load(html);
            $('.thumbnail').each((i, elem) => {
                var mangaName = elem.attribs['href'].replace("https://www.scan-vf.net/", ""); // retrieve manga name
                var thumbnails = elem.children.values();
                
                for (const thumbnail of thumbnails) {
                    try {
                        const url = thumbnail.attribs['src'];
                        mangas.push({"mangaName": mangaName, "thumbnail": url});
                    } 
                    catch (error) {}
                }
            })
            pageIndex++;
            return getMangas();
        })
        .catch((err) => {
            console.error(`Error. ` + err);
        })

        
}

/*
getMangas()
    .then((mangas) => {
        console.log(mangas);
    })
*/

export { getMangas };
