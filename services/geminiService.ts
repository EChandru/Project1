import { GoogleGenAI } from "@google/genai";
import { PatientData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function constructPrompt(data: PatientData): string {
  return `
    You are an expert Ayurvedic nutritional consultant and a web designer. Your task is to generate a detailed, personalized, and professional diet plan for a patient and format it as clean HTML using TailwindCSS classes for a dark theme.

    **Patient Details:**
    - **Full Name:** ${data.patientName}
    - **Age:** ${data.age}
    - **Gender:** ${data.gender}
    - **Prakriti (Natural Constitution):** ${data.prakriti}
    - **Vikriti (Current Imbalance):** ${data.vikriti}
    - **Digestive Strength (Agni):** ${data.digestion}
    - **Known Allergies:** ${data.allergies || 'None specified'}
    - **Primary Health Goals:** ${data.healthGoals}

    **Instructions for the HTML Diet Plan (Dark Theme):**
    1.  **Structure:** Generate a complete HTML structure within a single parent \`<div>\`. Do not include \`<html>\`, \`<head>\`, or \`<body>\` tags.
    2.  **Styling (Dark Theme):** Use TailwindCSS classes for all styling. Examples:
        -   Headings: \`<h2 class="text-2xl font-bold text-indigo-400 mb-4 border-b border-slate-700 pb-2">Introduction</h2>\`
        -   Subheadings: \`<h3 class="text-xl font-semibold text-indigo-300 mt-6 mb-3">Foods to Favor</h3>\`
        -   Paragraphs: \`<p class="mb-3 text-slate-300 leading-relaxed">...</p>\`
        -   Lists: \`<ul class="list-disc list-inside pl-4 mb-4 space-y-2 text-slate-300">\`
        -   List Items: \`<li><strong class="font-semibold text-slate-100">Grains:</strong> Quinoa, Basmati Rice</li>\`
        -   Emphasis: Use \`<strong class="font-medium text-white">\` for important terms.
    3.  **Content Sections:** The HTML must include the following sections, each with appropriate dark theme styling:
        -   **Introduction:** A brief, encouraging paragraph explaining the Ayurvedic approach.
        -   **General Dietary Principles:** An unordered list of 5-7 key principles.
        -   **Foods to Favor:** A section with subheadings for categories (e.g., Vegetables, Fruits, Grains) and lists of foods.
        -   **Foods to Reduce or Avoid:** Similar structure to "Foods to Favor".
        -   **Sample Daily Meal Plan:** A structured plan for Breakfast, Lunch, and Dinner. Use headings for each meal.
        -   **Lifestyle Recommendations:** An unordered list of 2-3 simple tips.
        -   **Disclaimer:** A final paragraph in smaller, italicized text. e.g., \`<p class="mt-8 text-sm text-slate-500 italic">This diet plan is a general recommendation based on the provided information and is not a substitute for a direct consultation with a qualified Ayurvedic practitioner or medical doctor.</p>\`.

    Ensure the final output is a single string of clean, well-formatted HTML for a dark background.
  `;
}

export const generateDietPlan = async (patientData: PatientData): Promise<string> => {
  const prompt = constructPrompt(patientData);
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    // Clean up potential markdown code fences if the model wraps the HTML
    let htmlContent = response.text.trim();
    if (htmlContent.startsWith('```html')) {
        htmlContent = htmlContent.substring(7);
    }
    if (htmlContent.endsWith('```')) {
        htmlContent = htmlContent.slice(0, -3);
    }
    return htmlContent.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate diet plan from AI service.");
  }
};