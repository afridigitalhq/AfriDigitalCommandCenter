module.exports=function validateProduct(p){
const rules={ebook:100,template:50,script:200,light_media:[10,20],premium_media:[100,200,300,400,500]};
if(!p.type||!p.price)return {ok:false};
return {ok:true};
};
