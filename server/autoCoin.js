const {getUsers,saveUsers}=require('./userStore');setInterval(()=>{let users=getUsers();users.forEach(u=>u.coins+=5);saveUsers(users);console.log('⏱ Daily coins added');},86400000);
