import express from 'express';
import fs from 'fs';
import path from 'path';
import { getMangas } from './scripts/getMangaList.mjs';
import { getChapters } from './test/getChapter.js';
import { downloadScans } from './scripts/scanvf.js';

const app = express();
// const HOSTNAME = "localhost";
const PORT = 3000;
const currentWorkingDirectory = process.cwd();
const mangaDirectory = ""

app.use(express.static(path.join(currentWorkingDirectory, 'public')));
app.use(express.static(path.join(currentWorkingDirectory, 'scripts')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(currentWorkingDirectory, "templates", "index.html"));
    
})

app.get('/mangaList', (req, res) => {
    getMangas()
        .then((mangas) => {
            // console.log(res)
            res.send(mangas);
        })
})

app.post('/writeCache', (req, res) => {
    const cache = req.body;

    fs.writeFileSync("public/cache.json", JSON.stringify(cache), (err) => {
        if (err) throw err;
    })
    
})

app.get("/getChapters", (req, res) => {

    const mangaName = req.query.mangaName;

    if (mangaName === '') {
        res.status(204).send( {message: "No mangaName provided."} );
    }
    
    try {
        getChapters(mangaName)
            .then((chapters) => { // get chapters
                res.status(200).send(chapters); // array of object =>  {chapterTitle: xxx, chapterIndex: xxx, chapterUrl: xxx}, ...
                
            })
    }
    catch (error) {
        res.status(404).send( {message: "manga was not found."} ); // not found
    }

})

let scansToDownload = [];
let downloadState = false;
app.get('/downloadScan', (req, res) => {
    const queryString = req.query;
    const mangaName = queryString['mangaName'];
    const chapterIndex = queryString['chapterIndex'];

    // scansToDownload.push(queryString);

    downloadScans(mangaName, chapterIndex);

    res.send(200);

})



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} -> http://localhost:${PORT}`);
    })