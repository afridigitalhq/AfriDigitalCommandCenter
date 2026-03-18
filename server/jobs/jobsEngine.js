const fs=require('fs'); const jobsFile='server/data/jobs.json';
function loadJobs(){return fs.existsSync(jobsFile)?JSON.parse(fs.readFileSync(jobsFile)):[];}
function saveJobs(jobs){fs.writeFileSync(jobsFile,JSON.stringify(jobs,null,2));}
module.exports={loadJobs,saveJobs};
