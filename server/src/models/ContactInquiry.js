import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: String,
    message: { type: String, required: true },
    status: { type: String, default: 'new' },
  },
  { timestamps: true },
);

export default mongoose.models.ContactInquiry || mongoose.model('ContactInquiry', inquirySchema);
