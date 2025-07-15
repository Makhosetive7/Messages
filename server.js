import express from "express"
import app from "./app.js"

const server = express()
const PORT = process.env.PORT || 5001


server.use(app);


server.listen(PORT, () => {
    console.log(`server running on Port ${PORT}`)
});