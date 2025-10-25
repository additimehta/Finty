import express from "express";
import dotenv from "dotenv"
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js"

dotenv.config();

const app = express();

// midleware 
// fucntion that runs in the middle between request and response 
// maybe some authentication, logging, parsing json body
app.use(rateLimiter);
app.use(express.json()); 


// our custom middleware


app.use ((req, res, next) => {
    console.log("hey we hit a req, the method is", req.method); // every time request hits server this line will run
    next(); //  by calling next u are saying pass controls to the next middleware or route handler


});



const PORT = process.env.PORT 

  
// healtg chwck
app.get("/health", (req, res) => {
    console.log("it's working")
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});