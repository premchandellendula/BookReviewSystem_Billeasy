const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// GET /search?query=someText

router.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query parameter is required." });
    }

    try {
        const books = await prisma.book.findMany({
        where: {
            OR: [
            {
                title: {
                contains: query,
                mode: "insensitive"
                }
            },
            {
                author: {
                username: {
                    contains: query,
                    mode: "insensitive"
                }
                }
            }
            ]
        },
        select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
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
        });

        res.status(200).json({
            message: "Book fetched successfully",
            books
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching book",
            error: err.message
        })
    }
});

module.exports = router;