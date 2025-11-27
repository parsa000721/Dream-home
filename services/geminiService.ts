import { GoogleGenAI } from "@google/genai";
import { ProjectState } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDesignAdvice = async (
  prompt: string, 
  projectState: ProjectState
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment.";
  }

  const floorCounts = projectState.walls.reduce((acc, wall) => {
    acc[wall.floor] = (acc[wall.floor] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const maxFloor = Math.max(...Object.keys(floorCounts).map(Number), 0);
  
  const projectSummary = `
    The project is a multi-level design with ${maxFloor + 1} floors.
    Total Walls: ${projectState.walls.length}.
    Total Furniture/Objects: ${projectState.furniture.length}.
    Key items include: ${projectState.furniture.map(f => f.name).join(', ')}.
    Currently viewing Floor ${projectState.activeFloor + 1}.
  `;

  const fullPrompt = `
    You are an expert architect specializing in guest houses, homestays, and residential renovations.
    The user is designing a property layout using an app similar to Sweet Home 3D.
    
    Context: ${projectSummary}
    User Query: "${prompt}"
    
    Provide a professional, creative, and practical answer (max 150 words). 
    If the user asks about layout, consider flow, light, and space optimization for guests.
    If they ask about style, suggest materials or arrangements fitting a modern hospitality vibe.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while consulting the AI architect.";
  }
};