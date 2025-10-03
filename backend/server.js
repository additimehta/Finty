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
    console.log("hey we hit a req, the method is", req.method); // every time request hits server this line will run
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
        console.log("DB initalized successfully");

    } catch(error) {
        console.log("Error creating table:", error);
        process.exit(1); // 1 indicates failure
        
    }
}

app.get("/", (req, res) => {
    console.log("it's working")
});




app.get("/api/transactions/:userId", async (req, res) => {

    try{
        const {userId} = req.params;




        const transactions = await sql `
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `

        res.status(200).json(transactions);


    } catch(error){
        console.log("Error getting the transaction", error)
        res.status(500).json({error: "Internal server error"});

    }

});

app.post("/api/transactions", async (req, res) => {
    // title, amount, category, user_id
    try{
        const{title, amount, category, user_id} = req.body;
        if(!title || amount == undefined || !category || !user_id){
            return res.status(400).json({error: "Missing required fields"});
        }

        const transaction = await sql
        `INSERT INTO transactions (user_id, title, amount, category)
         VALUES (${user_id}, ${title}, ${amount}, ${category})
         RETURNING *
         `


        console.log(transaction);
        res.status(201).json(transaction[0]);


        

    }catch (error){
        console.log("Error creating the transaction", error)
        res.status(500).json({error: "Internal server error"});



    }
});


app.delete("/api/transactions/:id", async (req, res) => {

    try{
        // grab id from url
        const {id} = req.params;

        
        // if id is not a number because id cannot be a string
        // note that even if the id was string it would still work but the request would be invalid 
        if(isNaN(parseInt(id))){
            return res.status(400).json({message: "Invalid user ID"});
        }

        

        const transaction = await sql `
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `

        // no transaction found 
        if(transaction.length === 0){
            return res.status(404).json({error: "Transaction not found"});
        }

        res.status(200).json({message: "Transaction deleted successfully"});

    }catch (error){
        console.log("Error deleting the transaction", error)
        res.status(500).json({error: "Internal server error"});

    }

});


app.get("/api/transactions/summary/:userId", async (req, res) => {
    try{
        const {userId} = req.params;

        const balanceResult =  await sql `

        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `

    }catch (error){
        console.log("Error getting the transaction summary", error)
        res.status(500).json({error: "Internal server error"});

    }

});



console.log("my port is: " ,process.env.PORT)
    


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});