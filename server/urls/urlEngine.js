const fs=require('fs'); const urlsFile='server/data/urls.json';
function loadUrls(){return fs.existsSync(urlsFile)?JSON.parse(fs.readFileSync(urlsFile)):[];}
function saveUrls(urls){fs.writeFileSync(urlsFile,JSON.stringify(urls,null,2));}
module.exports={loadUrls,saveUrls};
