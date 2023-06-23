import express from 'express'
import jwt from 'jsonwebtoken'
import authantication from '../auth/auth.js'
import path from 'path'
import Registers from '../schema/register.js'
import Users from '../schema/schema.js'
const router = express.Router()

router.get('/api', async (req, res) => {
    try {
        const user = new Users({
            name: "DHAVAL PATEL",
            surname: "MORLIYA",
            age: 37,
            occupation: "CLOUD NETWORKING",
        })


        const data = await Users.insertMany(user)

        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }


})


router.get('/', (req, res) => {
    res.sendFile(path.join( 'index.html'))
  })
router.get('/home',(req,res)=>{
    res.send('<h1 style= "margin-left:40%; margin-top:10vh; padding:3rem;">404 page not found<br/> <a style="text-decoration:none; font-size:2rem; "  href=/><p style="border:1px solid  black; font-size:1rem; padding:1rem; width:5rem;">GO BACK</p></a><h1>')
})
router.get('/about',(req,res)=>{
    res.send('<h1 style= "margin-left:40%; margin-top:10vh; padding:3rem;">404 page not found<br/> <a style="text-decoration:none; font-size:2rem; "  href=/><p style="border:1px solid  black; font-size:1rem; padding:1rem; width:5rem;">GO BACK</p></a><h1>')

})
router.get('/services',(req,res)=>{
    res.send('<h1 style= "margin-left:40%; margin-top:10vh; padding:3rem;">404 page not found<br/> <a style="text-decoration:none; font-size:2rem; "  href=/><p style="border:1px solid  black; font-size:1rem; padding:1rem; width:5rem;">GO BACK</p></a><h1>')

})
router.get('/contact',(req,res)=>{
    res.send('<h1 style= "margin-left:40%; margin-top:10vh; padding:3rem;">404 page not found<br/> <a style="text-decoration:none; font-size:2rem; "  href=/><p style="border:1px solid  black; font-size:1rem; padding:1rem; width:5rem;">GO BACK</p></a><h1>')

})

router.post('/register', async (req, res, next) => {
    const { name, email, number } = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!name || !email || !number) {
        return res.status(422).send('invalid registration user has to blank field email or name')
    }

    try {
        if (!emailRegex.test(email)) {

            res.status(422).send('you have to fill correct email')
        }


        else if (number.length !== 10) {
            alert('your number should be exect 10 number')
            res.status(422).send('this is invalid number')
        
        }
    
        else {



            const register = new Registers({
                name,
                email,
                //    message,  
                number
            })
            const token = await register.generateAuthToken()
            console.log(token)

            res.cookie("jwtToken", token, {
                expires: new Date(Date.now() + 3000000),
                httpOnly: true,
                secure: true,
                
            })
             
            console.log(register)
           await register.save()
            res.status(200).json({"message":"data send successfully"})
        }
    } catch (error) {
        res.status(422).send('Invalid Registration')
    }
    next()

})



router.post('/login', authantication,async (req, res , next) => {
 try{
    const { message } = req.body
    const findUser = await Registers.findOne({_id : req.userId})
    
  if(findUser){
           
            const getMessage = await findUser.isMessageAuth(message)
           
            console.log(getMessage)
         res.status(200).json({"save":"successfuly"}) 
        }
      
 }catch(error){
    console.log(error)
 }
      next()
   
})

router.get('/router',(req,res)=>{
    res.status(200).send('welcome to route')
})

router.get('/getUserData',authantication,  async (req, res) => {
    console.log(req.rootUser)
 
    const data = req.rootUser

    res.send({ data: [data] })
    next()
})

export default router   
