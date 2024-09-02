import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("API Key:", process.env.OPENAI_API_KEY);
    console.log("Request body:", req.body);

    if (!process.env.OPENAI_API_KEY) {
        return res
            .status(500)
            .json({ error: "OpenAI API 키가 설정되지 않았습니다." });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "허용되지 않는 메소드입니다." });
    }

    try {
        const { messages } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // 또는 사용하고자 하는 모델
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                ...messages // 클라이언트에서 전송한 메시지들
            ],
        });

        res.status(200).json({ message: completion.choices[0].message });
    } catch (error: any) {
        console.error("Detailed error:", error);
        res.status(500).json({ error: error.message });
    }
}
