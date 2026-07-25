import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        // Allows letters (upper/lower), spaces are optional, at least 3 characters
        return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v) && v.replace(/ /g, '').length >= 3;
      },
      message: "Full name can contain only alphabets !",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        // Alphanumeric, no spaces
        return /^[A-Za-z0-9._]+$/.test(v);
      },
      message: "Username must be alphanumeric !",
    },
  },
  email: {
    type: String,
    required: true,
    unique : true,
    trim: true,
    lowercase: true,
    match: [
      // Email regex
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Please enter a valid email address !",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    match: [
      // At least 1 uppercase, 1 lowercase, 1 number, 1 special char, min 7 chars
      // No spaces allowed in password
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/,
      "Password must be at least 7 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    ],
  },
  workplace: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        // Only alphabets
        return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v);
      },
      message: "Workplace name cannot contain special characters or numbers !",
    },
  },
  bio : {
    type: String,
    trim: true,
    validate: {
      validator: function (v: string) {
        if (!v) return true; // Allow empty bio
        // Count words by splitting on whitespace
        const wordCount = v.trim().split(/\s+/).length;
        return wordCount <= 100;
      },
      message: "Bio cannot exceed 100 words.",
    },
  },
  jobTitle : {
    type : String,
    trim : true,
    maxlength : 30
  }
})

const Users = mongoose.model('users', userSchema);
export default Users;