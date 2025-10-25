import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) { 
    try {
      const { userId } = req.params;
  
      const transactions = await sql`
        SELECT * FROM transactions 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
      `;
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error getting the transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}
  

export async function createTransaction(req, res) {
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

}


export async function deleteTransaction(req, res) {
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
}

export async function getSummaryByUserId(req, res) {
    try{
        const {userId} = req.params;

        const balanceResult =  await sql `

        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await sql
        `
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions
            WHERE user_id = ${userId} AND amount > 0
        
        `

        const expenseResult = await sql
        `
            SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
            WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses,
            
        })


        // income + expense - amount 
        

    }catch (error){
        console.log("Error getting the transaction summary", error)
        res.status(500).json({error: "Internal server error"});

    }

}