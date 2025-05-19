const express = require('express')
const router = express.Router()
const zod = require('zod')
const authMiddleware = require('../../middlewares/authMiddleware')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bookBody = zod.object({
    title: zod.string(),
    description: zod.string(),
    numOfPages: zod.number(),
    genre: zod.string()
})

router.post('/books', authMiddleware, async (req, res) => {
    const response = bookBody.safeParse(req.body)
    
    if(!response.success){
        return res.status(400).json({
            message: "Incorrect inputs",
        })
    }

    const { title, description, numOfPages, genre } = req.body

    try{
        const book = await prisma.book.create({
            data: {
                title,
                description,
                numOfPages,
                genre,
                authorId: req.userId
            }
        })

        return res.status(201).json({
            message: "Book added successfully",
            book
        })
    }catch(err){
        return res.status(500).json({
            message: "Error adding a book", 
            error: err.message
        })
    }
})

/*
/books
/books?page=2&limit=10
/books?author=authorName&genre=genre
/books?author=authorName
/books?genre=genre
*/
router.get('/books', async (req, res) => {
    try{
        const { page = 1, limit = 10, author, genre } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        
        const books = await prisma.book.findMany({
            where: {
                AND: [
                    genre ? { 
                        genre: { 
                            equals: genre, mode: 'insensitive' 
                        } 
                    } : {},
                    author ? {
                        author: {
                            is: {
                                username: { equals: author, mode: 'insensitive' }
                            }
                        }
                    } : {}
                ]
            },
            skip,
            take,
            select: {
                id: true,
                title: true,
                description: true,
                numOfPages: true,
                genre: true,
                author: {
                    select: {
                        username: true
                    }
                },
                ratings: {
                    select: {
                        rating: true
                    }
                },
                reviews: {
                    select: {
                        comment: true
                    }
                }
            }
        })

        res.status(200).json({
            message: "Books fetched successfully",
            books,
            currentPage: Number(page),
            pageSize: Number(limit)
        })
    }catch(err){
        return res.status(500).json({
            message: "Error fetching books",
            error: err.message
        })
    }
})

router.get('/books/:id', async (req, res) => {
    try{
        const { page = 1, limit = 5 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const book = await prisma.book.findFirst({
            where: {
                id: parseInt(req.params.id, 10)
            },
            select: {
                id: true,
                title: true,
                description: true,
                numOfPages: true,
                genre: true,
                author: {
                    select: {
                        username: true
                    }
                }
            }
        })

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const ratingAgg = await prisma.rating.aggregate({
            where: { 
                bookId: parseInt(req.params.id, 10)
            },
            _avg: { 
                rating: true 
            }
        });

        const reviews = await prisma.review.findMany({
            where: { 
                bookId: parseInt(req.params.id, 10)
            },
            skip,
            take,
            select: {
                comment: true,
                user: {
                    select: { username: true }
                }
            }
        });

        res.status(200).json({
            message: "Book fetched successfully",
            ...book, 
            averageRating: ratingAgg._avg.rating ?? 0,
            reviews
        })
    }catch(err){
        return res.status(500).json({
            message: "Error fetching book",
            error: err.message
        })
    }
})

module.exports = router;