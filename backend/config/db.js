import {neon} from "@neondatabase/serverless";

import "dotenv/config";
// this creates a SQL connetion using our DB url
export const sql = neon(process.env.DATABASE_URL);

