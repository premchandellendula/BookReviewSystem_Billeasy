const express = require('express');
const router = express.Router();
const zod = require('zod');
const authMiddleware = require('../../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// this is added here, coz of easy to read as the books.js file long to read and it has the required routes

const reviewBody = zod.object({
    comment: zod.string()
})

router.post('/books/reviews/:id', authMiddleware, async (req, res) => {
    const response = reviewBody.safeParse(req.body);

    if(!response.success){
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    const { comment } = req.body;

    try{
        const review = await prisma.review.create({
            data: {
                comment: comment,
                userId: req.userId,
                bookId: parseInt(req.params.id, 10)
            }
        })

        res.status(201).json({
            message: "review added successfully",
            review
        })
    }catch(err){
        return res.status(500).json({
            message: "Error adding a review",
            error: err.message
        })
    }
})

const reviewPutBody = zod.object({
    comment: zod.string()
})

router.put('/reviews/:id', authMiddleware, async (req, res) => {
    const response = reviewPutBody.safeParse(req.body);

    if(!response.success){
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    const { comment } = req.body;

    try{
        const review = await prisma.review.update({
            where: {
                id: parseInt(req.params.id, 10),
                userId: req.userId
            },
            data: {
                comment: comment,
                userId: req.userId
            }
        })

        res.status(201).json({
            message: "review updated successfully",
            review
        })
    }catch(err){
        return res.status(500).json({
            message: "Error adding a review",
            error: err.message
        })
    }
})

router.delete('/reviews/:id', authMiddleware, async (req, res) => {
    try{
        const review = await prisma.review.delete({
            where: {
                id: parseInt(req.params.id, 10),
                userId: req.userId
            }
        })

        res.status(200).json({
            message: "Deleted the review successfully",
            review
        })
    }catch(err){
        return res.status(500).json({
            message: "Error deleting the review",
            error: err.message
        })
    }
})

module.exports = router;