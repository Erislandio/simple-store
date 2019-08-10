const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        name: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        document: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        },
        admin: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

// UserSchema.pre("save", async function(next) {
//     const hash = await bcrypt.hash(this.password, 10);
//     this.password = hash;

//     next();
// });

module.exports = model("User", UserSchema);
