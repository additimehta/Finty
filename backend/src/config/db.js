import {neon} from "@neondatabase/serverless";

import "dotenv/config";
// this creates a SQL connetion using our DB url
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
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

