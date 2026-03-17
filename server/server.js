const http=require('http');
const fs=require('fs');
const WebSocket=require('ws');

const PORT=process.env.PORT||3000;

// Load users
function getUsers(){
  return JSON.parse(fs.readFileSync('server/shop/data/users.json'));
}
function saveUsers(users){
  fs.writeFileSync('server/shop/data/users.json',JSON.stringify(users,null,2));
}

// HTTP API
const server=http.createServer((req,res)=>{
  if(req.url==='/users'){
    res.writeHead(200,{'Content-Type':'application/json'});
    return res.end(fs.readFileSync('server/shop/data/users.json'));
  }
  res.end("AfriDigital Command Center LIVE");
});

// WebSocket
const wss=new WebSocket.Server({server});
wss.on('connection',ws=>{
  ws.send(JSON.stringify({msg:'Connected to AfriDigital WS'}));
});

// Daily coin system (every 24h)
setInterval(()=>{
  let users=getUsers();
  users.forEach(u=>u.coins+=5);
  saveUsers(users);
  console.log('⏱ Daily coins added');
},86400000);

// Start server
server.listen(PORT,()=>console.log('🚀 Server running on port '+PORT));
