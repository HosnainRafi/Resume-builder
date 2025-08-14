import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { TemplateModel } from '../modules/templates/template.model';

// FIX: Explicitly specify the path to the .env file relative to the backend directory
dotenv.config({ path: './.env' });

const starterTemplates = [
  {
    name: 'Modern Tech',
    isPublic: true,
    layout: {
      componentOrder: [
        'header',
        'summary',
        'experience',
        'projects',
        'education',
        'skills',
      ],
    },
    cssTokens: {
      '--primary-color': '#3b82f6',
      '--font-family': 'Inter, sans-serif',
    },
  },
  {
    name: 'Compact',
    isPublic: true,
    layout: { componentOrder: ['header', 'experience', 'skills', 'education'] },
    cssTokens: {
      '--primary-color': '#10b981',
      '--font-family': 'Roboto, sans-serif',
    },
  },
  {
    name: 'Elegant',
    isPublic: true,
    layout: {
      componentOrder: ['header', 'summary', 'education', 'experience'],
    },
    cssTokens: {
      '--primary-color': '#6366f1',
      '--font-family': 'Merriweather, serif',
    },
  },
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    logger.error('MONGODB_URI not found in environment variables.');
    process.exit(1);
  }

  try {
    logger.info('Connecting to database...');
    await mongoose.connect(mongoUri);

    logger.info('Clearing existing templates...');
    await TemplateModel.deleteMany({});

    logger.info('Seeding starter templates...');
    await TemplateModel.insertMany(starterTemplates);

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error({ err: error }, 'Database seeding failed.');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      logger.info('Database connection closed.');
    }
  }
};

seedDatabase();
