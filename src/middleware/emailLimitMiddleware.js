import { rateLimit } from "express-rate-limit";

const Limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: {
        message: "Wait 60 seconds before trying again",
        success: false,
        err: "Rate limit reached"
    }
});

export default Limiter;