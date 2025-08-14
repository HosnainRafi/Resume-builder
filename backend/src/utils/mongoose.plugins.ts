import { Schema } from 'mongoose';

export const basePlugin = (schema: Schema) => {
  // Add timestamps (createdAt, updatedAt)
  schema.set('timestamps', true);

  // Customize the JSON output
  schema.set('toJSON', {
    virtuals: true, // ensure virtuals are included
    // FIX: 1. Mark 'doc' as unused by prefixing with '_'.
    //      2. Explicitly type 'ret' as a dynamic object to allow 'delete'.
    transform: (_doc: any, ret: Record<string, any>) => {
      delete ret._id; // This is now allowed.
      delete ret.__v; // This is now allowed.
    },
  });
};
