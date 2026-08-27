const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // Three roles as per project requirement
    role: {
      type: String,
      enum: ["admin", "worker", "citizen"],
      default: "citizen",
    },

    // Relevant for workers (field/rural pond managers)
    district: { type: String, trim: true },
    block: { type: String, trim: true },
    village: { type: String, trim: true },
    assignedPonds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pond" }],

    // Worker accounts must be approved by Admin before they can log in
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "worker";
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
