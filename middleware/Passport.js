const jwt=require('jsonwebtoken')
module.exports=passport=(req,res,next)=>{
    try{
        const token=req.header('x-token');
        console.log(token)
        if(!token){
            // res.send('token invalid')
            console.log('token invalid')
        }
        
        const decode=jwt.verify(token,'GGSQHGYDQq');
        req.user=decode.user;
        next();
    }catch(err){
        res.send(err);
    }
}