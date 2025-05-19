const express = require('express')
const router = express.Router()
const zod = require('zod')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const signupBody = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6)
})

router.post('/signup', async (req, res) => {
    const response = signupBody.safeParse(req.body)

    if(!response.success){
        return res.status(400).json({
            message: "Incorrect inputs",
        })
    }

    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                {email: email},
                {username: username}
            ]
        }
    }) 

    if(existingUser){
        return res.status(409).json({
            message: "Email or username already exists"
        })
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email : email,
                username : username,
                password : hashedPassword
            }
        })

        return res.status(201).json({
            message: "Signup successful"
        })
    }catch(err){
        return res.status(500).json({
            message: "Error creating user", 
            error: err.message
        })
    }
})


const loginBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})

router.post('/login', async (req, res) => {
    const response = loginBody.safeParse(req.body);

    if(!response.success){
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    const { email, password } = req.body;

    try{
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(403).json({
                message: "Incorrect password"
            })
        }

        const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "2d"});

        return res.status(201).json({
            token,
            message: "Login successful"
        })
    }catch(err){
        return res.status(500).json({
            message: "Error logging user", 
            error: err.message
        })
    }
})

module.exports = router