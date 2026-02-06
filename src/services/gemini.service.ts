import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    // In a real app, API_KEY comes from env. 
    // Here we assume process.env.API_KEY is available in the environment as per instructions.
    this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeImage(base64Image: string, userPrompt: string, systemInstruction: string): Promise<string> {
    try {
      const model = 'gemini-2.5-flash';
      // Clean base64 string if it has prefix
      const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

      const response = await this.genAI.models.generateContent({
        model: model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            },
            {
              text: userPrompt
            }
          ]
        },
        config: {
          systemInstruction: systemInstruction
        }
      });
      return response.text;
    } catch (error) {
      console.error('Gemini Image Error:', error);
      return 'خطا در ارتباط با هوش مصنوعی. لطفا مجدد تلاش کنید.';
    }
  }

  async getProtocol(species: string, condition: string): Promise<string> {
    try {
      const prompt = `
        You are an expert veterinarian. 
        Provide a detailed treatment protocol for "${condition}" in a "${species}".
        Include:
        1. Diagnosis confirmation methods.
        2. Drug dosage and administration (names, mg/kg, frequency).
        3. Supportive care.
        4. Prognosis.
        Output formatted in Markdown.
        If the language is Persian/Farsi, respond in Persian.
      `;
      
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      return response.text;
    } catch (error) {
      console.error('Gemini Protocol Error:', error);
      return 'خطا در دریافت پروتکل.';
    }
  }
}
