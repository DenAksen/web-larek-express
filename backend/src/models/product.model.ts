import mongoose, { Schema } from 'mongoose';

export enum Category {
  SOFT_SKILL = 'софт-скил',
  HARD_SKILL = 'хард-скил',
  OTHER = 'другое',
  ADDITIONAL = 'дополнительное',
  BUTTON = 'кнопка',
}

export interface IFile {
    fileName: string;
    originalName: string;
}

export interface IProduct {
    _id: string;
    title: string;
    price: number | null;
    description: string;
    category: Category;
    image: IFile;
}

const fileSchema = new Schema<IFile>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
}, {
  _id: false,
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: fileSchema,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(Category),
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
}, {
  versionKey: false,
});

export default mongoose.model<IProduct>('product', productSchema);
