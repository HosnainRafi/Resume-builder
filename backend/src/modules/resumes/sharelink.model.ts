import mongoose from 'mongoose';

const ShareLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  resumeData: { type: Object, required: true },
  template: { type: String, enum: ['classic', 'modern'], required: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' }, // auto delete after 30 days
});

export default mongoose.model('ShareLink', ShareLinkSchema);
