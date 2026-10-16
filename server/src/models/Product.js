import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    wholesalePrice: Number,
    stock: { type: Number, default: 0 },
    description: String,
    image: String,
    rating: Number,
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
