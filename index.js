const express = require('express')
const PORT = process.env.PORT || 3000;
const app = express()
app.use(express.json())

const rootRouter = require('./routes/index')

app.use('/api/v1', rootRouter)

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`)
})