import { invokeAi } from "../services/ai.service.js";

const receiver = async (req, res) => {
    const { query } = req.body;

    if (!query) return res.status(404).json({
        message: "No query found",
        success: false,
        err: "No query found"
    })

    const AiResponse = await invokeAi({ query });


    res.json({
        Ai: (AiResponse)
    })
}


export default { receiver }
