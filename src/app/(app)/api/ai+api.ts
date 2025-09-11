import OpenAI from "openai/index.js";
//import { OPENAI_API_KEY } from '@env';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
   const { exerciseName } = await request.json();

  
   

    if (!exerciseName) {
      return Response.json(
        { error: "Exercise name is required" }, 
        { status: 404 }
        
        
      );
    }

    const prompt = `You are a fitness coach.
        You are given an exercise.
        
        Provide a brief, friendly, and informative description and instructions on 
        
        how to perform the exercise.
        
        Include tips for proper form and common mistakes to avoid. Keep it under 100 words.
        
        Explain in detail and for a beginner.

        The exercise name is  ${exerciseName}

        Keep it short and concise. Use markdown formatting.
       
        Use the following format:
        ## Equipment required
        
        ## Instructions
        
        ## Tips
        
        ## Variations
       
        ## Safety
        
        Keep spacing between the headings and the content.
       
        Always use headings and the content.
        
        Always use headings and subheadings`;


console.log(prompt)

try {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(response);
  return Response.json({ message: response.choices[0].message.content });

} catch ( error ) {
  console.error("Error fetching AI guidance:", error);
  return Response.json(
    { error: "Error fetching AI guidance" },
    { status: 500 }
  );
}


}

 
