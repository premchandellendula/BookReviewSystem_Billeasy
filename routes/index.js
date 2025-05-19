const express = require('express')
const router = express.Router()
const authRouter = require('./auth/auth')
const bookRouter = require('./books/books')
const reviewRouter = require('./reviews/review')
const searchRouter = require('./search/search')
const ratingRouter = require('./ratings/ratings')

router.use('/auth', authRouter)
router.use('/books', bookRouter)
router.use('/reviews', reviewRouter)
router.use('/search', searchRouter)
router.use('/ratings', ratingRouter)

module.exports = router