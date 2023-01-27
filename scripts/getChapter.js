import cheerio from 'cheerio';
import fetch from 'node-fetch';

async function getChapters(mangaName) { // Make sure that the manga name is raw, ex: black-clover (GOOD) != Black Clover (NOT GOOD, error)
   
    let url = `https://www.scan-vf.net/${mangaName}`
    let headers = {
        authority: "www.scan-vf.net",
        // path: `/uploads/manga/one_piece/chapters/chapitre-${chapter}/01.webp`,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "sec-ch-ua": 'Opera GX";v="93", "Not/A)Brand";v="8", "Chromium";v="107"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': "Windows",
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/93.0.0.0 (Edition std-1)'
    }
    let chaptersJSON = [];

    return fetch(url, headers)
        .then((res) => {
            if (res.ok) {
                return res.text();
            }
        })
        .then((data) => {
            const $ = cheerio.load(data);
            const chapters = $('ul.chapters');

            chapters.find('li').each((i, elem) => {
                const chapter = $(elem).children('h5');

                const chapterUrl = chapter.children('a').attr('href');
                const chapterIndex = chapter.children('a').text();
                const chapterTitle = chapter.children('em').text();
                // const chapterTitleComplete = chapterIndex + ": " + chapterTitle;

                chaptersJSON.push({chapterTitle: chapterTitle, chapterIndex: chapterIndex, chapterUrl: chapterUrl});
            })

        })
        .then(() => {
            return chaptersJSON;
        })

}

export { getChapters };
