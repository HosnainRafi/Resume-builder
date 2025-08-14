import { Schema, model, Document } from 'mongoose';
import { basePlugin } from '../../utils/mongoose.plugins';

export interface IAuditLog extends Document {
  userId: Schema.Types.ObjectId;
  action: string;
  meta: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, index: true },
  meta: { type: Schema.Types.Mixed },
});

auditLogSchema.plugin(basePlugin);
// TTL Index: Documents will be automatically deleted after 90 days
auditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

export const AuditLogModel = model<IAuditLog>('AuditLog', auditLogSchema);
