import { Schema, model } from 'mongoose';
import { ITemplate } from './template.interface';
import { basePlugin } from '../../utils/mongoose.plugins';

const templateSchema = new Schema<ITemplate>({
  name: { type: String, required: true, unique: true },
  layout: { type: Schema.Types.Mixed, required: true },
  cssTokens: { type: Schema.Types.Mixed, required: true },
  isPublic: { type: Boolean, default: true, index: true },
});

templateSchema.plugin(basePlugin);

export const TemplateModel = model<ITemplate>('Template', templateSchema);
