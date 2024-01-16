// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const secret=process.env.JWT_SECRET;



// module.exports=async(req,res,next)=>{

//     try{
//         const token=req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ message: 'No token provided' });
//           }
//           // console.log(token);
//           jwt.verify(token, "secret", (err, decoded) => {
//             if (err) {
                
//               return res.status(403).json({ message: 'Invalid token' });
//             }
//             // req.userId = decoded.user._id;
//             if (decoded.user && decoded.user._id) {
//               req.userId = decoded.user._id;
//               // Add decoded data to the request object
//               next();
//             } else {
//               return res.status(403).json({ message: 'Invalid token format' });
//             }
//             // console.log( req.userId);
//              // Add decoded data to the request object
//             // next();
//           })
//         }
    
//     catch(error){
//         // console.log(err2);
//         console.log(error);
//         return res.status(401).send({error:"not authorized"});
//     }
// }


const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // console.log('Received Token:', token);

    //ok

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log('Verification Error:', err);
        return res.status(403).json({ message: 'Invalid token' });
      }

      // console.log('Decoded Token:', decoded);

      if (decoded.userId) {
        req.userId = decoded.userId;
        // Add decoded data to the request object
        next();
      } else {
        console.log('Invalid Token Format');
        return res.status(403).json({ message: 'Invalid token format' });
      }
    });
  } catch (error) {
    console.log('Catch Block Error:', error);
    return res.status(401).send({ error: 'Not authorized' });
  }
};


