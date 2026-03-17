const validate=require('./shopValidation');const test=[{type:'ebook',price:100},{type:'premium_media',price:200}];test.forEach(p=>console.log(p,validate(p)));
