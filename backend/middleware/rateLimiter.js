import ratelimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) => {
    try{

        // for production have some type of user_id, ip address etc
        const {success} = await ratelimit.limit("my-rate-limit")
        if(!success) {
            return res.status(429).json(
                {error: "Too many requests. Please try again later."}
            )
        }

        next()

    }catch(error) {
        console.loge("Rate limit error", error)
        next(error)
    }
}
  
export default rateLimiter;