const mongoose = require('mongoose')

async function connectToDb(){
   try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected To DB")
   }catch (err){
    console.log(err)
   } 
}

module.exports = connectToDb