// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// require('dotenv').config({ path: './config.env'});
// const config = process.env;
// const verifyToken = (req,res,next) => {
//   authHeader = req.headers.cookie;
//   if(authHeader)
//   {
//     const token =
//     authHeader.split('=')[1]

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, process.config.JWT_SECRET);

//     req.user = decoded;// here in decoded we get the verified token.
//      console.log(decoded)
//     res.status.json({
//      status:"success"
      
//     })
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };
// }


// module.exports = verifyToken; 
