import mongoose from 'mongoose';

const libraryBookSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, default: 'General' },
    totalCopies: { type: Number, default: 5 },
    availableCopies: { type: Number, default: 5 },
    rackLocation: { type: String, default: 'A-12' },
  },
  {
    timestamps: true,
  }
);

const LibraryBook = mongoose.model('LibraryBook', libraryBookSchema);

export default LibraryBook;
