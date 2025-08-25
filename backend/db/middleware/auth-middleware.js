const jwt=require("jsonwebtoken");

function verifyToken(req,res,next){
    if (req.method === "OPTIONS") {
    return next();
  }
    const token=req.header("Authorization");
    if(!token){
        return res.status(401).send({
            error:"access denied",
        });
    }
    try{
        const decode=jwt.verify(token,"secret");
        console.log(decode);
        req.user=decode;
        next();
    }catch(err){
        return res.status(401).send({
            error:"invalid token"
        });

    }
}

function isAdmin(req,res,next){
    console.log('isAdmin middleware:', {
      user: req.user,
      isAdminType: typeof req.user?.isAdmin,
      isAdminValue: req.user?.isAdmin
    });
    if(req.user && req.user.isAdmin === true){
        next();
    }else{
        return res.status(403).send({
            error:"forbidden",
        });
    }
}

module.exports={verifyToken,isAdmin};