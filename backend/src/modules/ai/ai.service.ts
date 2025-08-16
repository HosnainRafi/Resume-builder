// src/modules/ai/ai.service.ts
import OpenAI from 'openai';
import env from '../../config';
import { CustomError } from '../../middleware/error-handler';
import logger from '../../utils/logger';
import { ISummaryRequest, IExperienceRequest } from './ai.interface'; // Import new interface

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': env.APP_URL,
    'X-Title': env.APP_NAME,
  },
});

export const generateAISummary = async (
  params: ISummaryRequest
): Promise<string> => {
  const {
    jobTitle,
    yearsExperience,
    experienceLevel,
    keySkills,
    careerHighlights,
    targetJobDescription,
    achievements,
  } = params;

  const prompt = `
Generate a highly professional, ATS-friendly, and concise resume summary (2-4 sentences) for the following candidate profile. Focus on their value proposition, integrate key skills, and highlight achievements.

Candidate Profile:
- Job Title: ${jobTitle}
- Years of Experience: ${yearsExperience}
- Experience Level: ${experienceLevel}
${keySkills ? `- Key Skills: ${keySkills}` : ''}
${careerHighlights ? `- Career Highlights: ${careerHighlights}` : ''}
${achievements ? `- Quantifiable Achievements: ${achievements}` : ''}
${
  targetJobDescription
    ? `Tailor this summary specifically for a role with the following description (integrate keywords naturally):
Target Job Description: ${targetJobDescription}`
    : ''
}

Requirements for the summary:
- Be 2-4 sentences long.
- Use strong action verbs.
- Highlight unique selling points and career progression.
- Emphasize contributions and positive outcomes.
- Maintain a professional and engaging tone.
- Ensure it is optimized for Applicant Tracking Systems (ATS) by naturally incorporating relevant keywords from the profile and target job description (if provided).
`;

  const systemPrompt =
    "You are an expert resume writer specializing in creating impactful, ATS-optimized summaries that capture hiring manager attention. Your goal is to craft a compelling narrative that showcases the candidate's skills and achievements and aligns with target job descriptions.";

  try {
    logger.info(
      `Sending summary generation request to OpenRouter for model: ${env.OPENROUTER_MODEL}`
    );
    const completion = await openrouter.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
      logger.error(
        'AI service returned an empty or invalid response for summary.'
      );
      throw new CustomError(
        'Failed to generate summary due to an empty response from the AI service.',
        'AI_SERVICE_ERROR',
        502
      );
    }
    logger.info('Successfully generated resume summary.');
    return summary;
  } catch (error: any) {
    logger.error(
      { err: error },
      'An error occurred while calling the OpenRouter API for summary generation.'
    );
    const errorMessage =
      error.response?.data?.error?.message ||
      'An unknown error occurred with the AI service.';
    throw new CustomError(errorMessage, 'AI_SERVICE_ERROR', 502);
  }
};

// New function for generating experience bullet points
export const generateAIExperienceBulletPoints = async (
  params: IExperienceRequest
): Promise<string[]> => {
  const {
    jobTitle,
    company,
    industry,
    yearsExperience,
    previousResponsibilities,
    targetSkills,
  } = params;

  const prompt = `
Generate 3-5 concise, impactful, and ATS-friendly bullet points for a resume work experience section. Focus on quantifiable achievements, strong action verbs, and skills relevant to the role of a "${jobTitle}" at "${company}".

Context:
- Job Title: ${jobTitle}
- Company: ${company}
${industry ? `- Industry: ${industry}` : ''}
${yearsExperience ? `- Years of Experience: ${yearsExperience}` : ''}
${targetSkills ? `- Target Skills to highlight: ${targetSkills}` : ''}
${previousResponsibilities ? `- Existing responsibilities (can be built upon): ${previousResponsibilities}` : ''}

Requirements for bullet points:
- Start each bullet point with a strong action verb (e.g., Developed, Managed, Implemented, Led, Optimized, Achieved, Increased, Reduced).
- Focus on accomplishments and results rather than just duties.
- Quantify achievements whenever possible (e.g., "Increased sales by 15%", "Reduced costs by $10K").
- Be concise (1-2 lines per bullet point).
- Naturally integrate relevant keywords for ATS optimization.
- Return only the bullet points, one per line, without any introductory or concluding remarks.
`;

  const systemPrompt =
    'You are an expert resume writer specialized in crafting compelling, ATS-optimized work experience bullet points that showcase achievements and quantifiable results. Your goal is to transform provided job details into powerful, action-oriented statements.';

  try {
    logger.info(
      `Sending experience generation request to OpenRouter for model: ${env.OPENROUTER_MODEL}`
    );
    const completion = await openrouter.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300, // Adjust as needed for bullet points
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      logger.error(
        'AI service returned an empty or invalid response for experience.'
      );
      throw new CustomError(
        'Failed to generate experience bullet points due to an empty response from the AI service.',
        'AI_SERVICE_ERROR',
        502
      );
    }

    // Split the content into an array of strings, one for each bullet point
    const bulletPoints = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    logger.info('Successfully generated resume experience bullet points.');
    return bulletPoints;
  } catch (error: any) {
    logger.error(
      { err: error },
      'An error occurred while calling the OpenRouter API for experience generation.'
    );
    const errorMessage =
      error.response?.data?.error?.message ||
      'An unknown error occurred with the AI service.';
    throw new CustomError(errorMessage, 'AI_SERVICE_ERROR', 502);
  }
};
