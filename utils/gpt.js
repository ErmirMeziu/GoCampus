
export async function askGPT(prompt) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_KEY}`,
        "HTTP-Referer": "https://gocampus.app", 
        "X-Title": "GoCampus",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    const data = await res.json();

    console.log("🔥 OpenRouter Response:", data);

    return data.choices?.[0]?.message?.content || "No response.";
  } catch (err) {
    console.error("❌ OpenRouter Error:", err);
    return "Error: Unable to generate response.";
  }
}