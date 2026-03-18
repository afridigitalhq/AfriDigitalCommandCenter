const fs=require('fs'); const forumFile='server/data/forum.json';
function loadForum(){return fs.existsSync(forumFile)?JSON.parse(fs.readFileSync(forumFile)):[];}
function saveForum(forum){fs.writeFileSync(forumFile,JSON.stringify(forum,null,2));}
module.exports={loadForum,saveForum};
