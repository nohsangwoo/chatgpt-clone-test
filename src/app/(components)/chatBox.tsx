"use client";
import { FormEvent, useState } from "react";

export default function Chat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        Array<{ role: string; content: string }>
    >([]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            console.log("data: ", data);
            setMessages([
                ...newMessages,
                { role: "assistant", content: data.message.content },
            ]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.role}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
}
