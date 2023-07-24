const express = require('express')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const upload = multer({ dest: 'C:\\Users\\SANJAI\\OneDrive\\Documents\\Example_folder\\Reciever' })
const filePath = "C:\\Users\\SANJAI\\OneDrive\\Documents\\Example_folder\\Reciever\\1af65ed6e7b277c43d4cd7bcef984f19"
// 2649612723.jpg"
console.log(__dirname)
console.log(__filename)
app.post('/upload', function (req, res, next) {
    
    console.log(req.url)
    console.log(req.file,req.body)
})

app.get('/download', async function (req, res, next) {
   try {
        console.log(req.url)
        const fileExixst = fs.existsSync(filePath)
    if(fileExixst){
       const contents = await fsPromises.readFile(filePath, {encoded : 'utf8'});
       console.log(contents);
       res.send(contents)
    }
   } catch (err) {
        console.log(err)
   }
});

app.get('/delete', async function (req, res, next) {
    try {
         console.log(req.url)
         const fileExixst = fs.existsSync(filePath)
     if(fileExixst){
        const contents = fs.unlink(filePath, (err) => {
            if(err){
                throw err
            }
        });
        res.send("file deleted success fully")
     }
    } catch (err) {
         console.log(err)
    }
 });

 

app.listen("3000", () =>{
    console.log(`Server is running on port 4000`)
})
