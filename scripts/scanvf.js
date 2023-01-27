import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
// import { getMangas } from "."

// let mangaName = "one_piece";
// let chapter = "157";
let period = 1100;

let showMs = true;
let beforeMs = 0;
let nowMs = 0;

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

async function downloadScans(mangaName, chapter) {
    var url = `https://www.scan-vf.net/${mangaName}/chapitre-${chapter}/1`;
    fetch(url, headers)
        .then(function(res) {
            if (res.ok) {
                return res.text();
            }

        }).then(function(response){
            return parsingHtml(response);

        }).then(function(pages) { // here we get the variables pages.
            
            getAllScans(pages, mangaName, chapter);

        }).catch(function(error) {
            console.error('error. [downloadScans]', error);
            return null;
    })
}

function parsingHtml(res) {
    // parse the HTML response using cheerio module
    const $ = cheerio.load(res);
    var data = $('div.container-fluid', res).children('script').text(); // to change

    // get the index of the variabels in the script;
    var firstIndexStr = "var pages =";
    var firstIndex = data.indexOf(firstIndexStr);

    var secondIndexStr = 'external":0}]';
    var secondIndex = data.indexOf(secondIndexStr);

    // parsing the variables pages from the script using substring and .parse 
    var content = data.substring(firstIndex + firstIndexStr.length + 1, secondIndex + secondIndexStr.length);
    //console.log(content);
    var pages = JSON.parse(content);
    //console.log(pages);
    return pages;
}

async function getAllScans(pages, mangaName, chapter) {
    var url = `https://www.scan-vf.net/uploads/manga/${mangaName}/chapters/chapitre-${chapter}/`; // 01.webp
    let index = 1;

    for (var page of pages) {
        await new Promise(resolve => setTimeout(resolve, period * index));
            
            var scanUrl = url + page['page_image'];
            
            await fetch(scanUrl, headers)
                .then(function(res){
                    if (showMs) {
                        beforeMs = Date.now(); // return epoch time
                    }

                    if (res.ok) {                        
                        return getBinaryData(res);
                    }
                })

                .then(function(image) {

                    var mangaNamePath = mangaName.replace('_', ' ').replace(/\b[a-z]/g, char => char.toUpperCase()); // attaque-des-titans => Attaque Des Titans

                    //Create folder if not exists;
                    if (!fs.existsSync("MANGAS")) {
                        fs.mkdirSync("MANGAS");
                    }
                    if (!fs.existsSync(`MANGAS/${mangaNamePath}`)) {
                        fs.mkdirSync(`MANGAS/${mangaNamePath}`);
                    }
                    if (!fs.existsSync(`MANGAS/${mangaNamePath}/${chapter}`)) {
                        fs.mkdirSync(`MANGAS/${mangaNamePath}/${chapter}`);
                    }

                    // Define the path of the current scan.
                    var fileName = page['page_image'].replace("webp", "jpg").replace("-fweb", "");
                    var imagePath = `MANGAS/${mangaNamePath}/${chapter}/${fileName}`;

                    // console.log(image); --> when using blob: Blob { size: 1377620, type: 'image/webp' }
                    
                    // we write the binary data into a file.
                    writeBinaryDataToFile(image, imagePath)
                        .then(() => {
                            // msg dl successfulyl dl...
                            if (showMs) {
                                nowMs = Date.now() - beforeMs;
                                console.log(`[${nowMs} ms] ${fileName} has been downloaded.`);
                            }
                            else {
                                console.log(`${fileName} has been downloaded.`);
                            }
                        })
                    
                })
                .catch(function(error){
                    console.error('Error.', error);
                    return null;
                })
        
        index++;
        
    }

    console.log('DONE!');

    
    
}

async function writeBinaryDataToFile(binaryData, path) {
    const writeStream = fs.createWriteStream(path);
    writeStream.write(binaryData);
    writeStream.end();
}

async function getBinaryData(res) {
    return Buffer.from(await res.arrayBuffer()); // Buffer.from() : transform anything into a buffer, in my case ArrayBuffer to Buffer.
}

async function getBinaryDataFromUrl(url) {
    const res = await fetch(url);
    const buffer = Buffer.from(res.arrayBuffer());
    return buffer;
}



//downloadScans();
export { downloadScans }