import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide code to analyze." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (code.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Code is too long. Please limit to 10,000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert algorithm analyst. Analyze the given code and determine its time and space complexity. Return a JSON response with these exact fields:
- "timeComplexity": an object with "best", "average", and "worst" as Big-O notation strings
- "spaceComplexity": a Big-O notation string
- "explanation": a clear 2-3 sentence explanation of WHY the code has this complexity, referencing specific parts of the code (loops, recursion, data structures)
- "suggestions": a short suggestion for optimization if applicable, or "Already optimal" if it can't be improved

Be precise and educational. Only return valid JSON, no markdown.`,
          },
          {
            role: "user",
            content: `Analyze the time and space complexity of this code:\n\n${code}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_complexity",
              description: "Return the complexity analysis of the given code",
              parameters: {
                type: "object",
                properties: {
                  timeComplexity: {
                    type: "object",
                    properties: {
                      best: { type: "string" },
                      average: { type: "string" },
                      worst: { type: "string" },
                    },
                    required: ["best", "average", "worst"],
                  },
                  spaceComplexity: { type: "string" },
                  explanation: { type: "string" },
                  suggestions: { type: "string" },
                },
                required: ["timeComplexity", "spaceComplexity", "explanation", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_complexity" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No analysis returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-code error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
