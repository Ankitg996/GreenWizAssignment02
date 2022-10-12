import express from "express";
import getLinksFromURL from "./getLinks.js";
import https from "https"
import fs from "fs";
import path from "path";
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get("/getImage", async(req, res)=>{
    try {
        const baseUrl = req.body.url;
        let homePageLinks = await getLinksFromURL(baseUrl)
        const files = homePageLinks.filter(file => {
            return file.src !== '' && file.src.split(':')[0] === 'https'
        })
        if (files.length === 0) return res.status(200).send({ status: true, message: 'No files found' });
        for (let i = 0; i < files.length; i++) {

            const fileName = path.basename(files[i].src) || Date.now();
// console.log(process.cwd());
            const file = fs.createWriteStream(process.cwd() + '/files/' + fileName);

            https.get(files[i].src, function (response) {
                response.pipe(file);
                // after download completed close filestream
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                });
            });
        }
        res.status(200).send({ status: true, message: "Download complete" });
    } catch (e) {
        console.log(e.message);
        res.status(400).send({ status: false, message: e.message });
    }
})

app.listen(process.env.PORT || 3000, ()=> console.log("Server is Ready to use") )

