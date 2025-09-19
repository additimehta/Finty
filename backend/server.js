import express from "express";
import dotenv from "dotenv"
import { sql } from "./config/db.js";


dotenv.config();

const app = express();

// midleware 
// fucntion that runs in the middle between request and response 
// maybe some authentication, logging, parsing json body
app.use(express.json()); 


// our custom middleware


app.use ((req, res, next) => {
    console.log("hey we hit a req, the methd is", req.method); // every time request hits server this line will run
    next(); //  by calling next u are saying pass controls to the next middleware or route handler


});



const PORT = process.env.PORT 

async function initDB() {
    try {
        await sql `CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        // DECIMAl(10,2) means total 10 digits, 2 after decimal point
        console.log("Table created successfully");
    } catch(error) {
        console.log("Error creating table:", error);
        process.exit(1); // 1 indicates failure
        
    }
}

 

app.post("/api/transactions", async (req, res) => {
    // title, amount, category, user_id
    try{
        const{title, amount, category, user_id} = req.body;
        if(!title || amount == undefined || !category || !user_id){
            return res.status(400).json({error: "Missing required fields"});
        }

    }catch (error){

    }
});
console.log("my port is: " ,process.env.PORT)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});