const express = require('express')
const router = express.Router();
const zod = require('zod');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../../middlewares/authMiddleware');
const prisma = new PrismaClient();

const ratingBody = zod.object({
    rating: zod.number()
                .min(0)
                .max(5)
                .multipleOf(0.5)
})

router.post('/rating/:id', authMiddleware, async (req, res) => {
    const response = ratingBody.safeParse(req.body);

    if(!response.success){
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
    }
    const { rating } = req.body;

    try{
        const bookRating = await prisma.rating.create({
            data: {
                rating,
                bookId,
                userId: req.userId
            }
        })

        res.status(201).json({
            message: "Rating added successfully",
            rating: bookRating
        })
    }catch(err){
        return res.status(500).json({
            message: "Error adding a rating",
            error: err.message
        })
    }
})

module.exports = router;