import OpenAI from 'openai';
import env from '../../config';
import { CustomError } from '../../middleware/error-handler';
import logger from 'backend/src/utils/logger';

// This is your correctly configured client for OpenRouter
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': env.APP_URL, // Let OpenRouter know where the request is from
    'X-Title': env.APP_NAME, // Identify your app in OpenRouter's dashboard
  },
});

/**
 * Creates a system prompt based on the enhancement context.
 * @param context The type of text to enhance (e.g., 'bullet_point').
 * @returns A string containing the system prompt.
 */
const getSystemPrompt = (
  context: 'bullet_point' | 'summary' | 'job_title'
): string => {
  const baseInstruction =
    "You are a world-class professional resume writing assistant. Your task is to rewrite the user's input to make it more professional, impactful, and compliant with Applicant Tracking Systems (ATS).";

  switch (context) {
    case 'bullet_point':
      return `${baseInstruction} Rewrite the following resume bullet point. Use a strong action verb to start the sentence. Focus on quantifiable achievements and results, not just duties. Keep it to a single, concise sentence.`;
    case 'summary':
      return `${baseInstruction} Rewrite the following professional summary. It should be a brief, 3-4 sentence paragraph highlighting the user's key skills, experience, and career goals.`;
    case 'job_title':
      return `${baseInstruction} Suggest 3-5 alternative, more professional or specific job titles based on the user's input. Return them as a comma-separated list.`;
    default:
      return baseInstruction;
  }
};

/**
 * Enhances a given piece of text using the specified AI model.
 * @param text The user-provided text to enhance.
 * @param context The context for enhancement (e.g., 'bullet_point').
 * @returns The AI-generated enhanced text.
 */
export const enhanceTextWithAI = async (
  text: string,
  context: 'bullet_point' | 'summary' | 'job_title'
): Promise<string> => {
  try {
    const systemPrompt = getSystemPrompt(context);

    logger.info(
      `Sending request to OpenRouter for model: ${env.OPENROUTER_MODEL}`
    );

    const completion = await openrouter.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.7, // Balances creativity and determinism
      max_tokens: 150, // Limit the response length to prevent runaway costs
    });

    const enhancedText = completion.choices[0]?.message?.content?.trim();

    if (!enhancedText) {
      throw new Error('AI service returned an empty response.');
    }

    logger.info('Successfully received response from OpenRouter.');
    return enhancedText;
  } catch (error: any) {
    logger.error({ error }, 'Failed to enhance text with OpenRouter AI');
    // Provide a more specific error message
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred with the AI service.';
    throw new CustomError(errorMessage, 'AI_SERVICE_ERROR', 502); // 502 Bad Gateway is appropriate here
  }
};

/**
 * Generates multiple resume bullet points based on a job title and company.
 * @param jobTitle The user's job title.
 * @param company The user's company.
 * @returns An array of AI-generated bullet point strings.
 */
export const generateBulletPoints = async (
  jobTitle: string,
  company: string
): Promise<string[]> => {
  try {
    const prompt = `Generate 3-4 professional, achievement-oriented resume bullet points for a ${jobTitle} at ${company}. Each bullet point should start with a strong action verb and be a separate line. Do not add any introductory text.`;

    const response = await openrouter.chat.completions.create({
      model: env.OPENROUTER_MODEL, // Use the same model as your other function for consistency
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';

    // Split the response into an array of bullet points, removing empty lines or hyphens
    return content
      .split('\n')
      .map((line: string) => line.replace(/^- /, '').trim())
      .filter((line: string) => line);
  } catch (error: any) {
    // Use the same robust error handling as your other function
    logger.error(
      { error },
      'Failed to generate bullet points with OpenRouter AI'
    );
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred with the AI service.';
    throw new CustomError(errorMessage, 'AI_SERVICE_ERROR', 502);
  }
};
