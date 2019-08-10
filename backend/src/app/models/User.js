const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt')

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
        image: {
            name: String,
            size: String,
            key: String,
            url: String,
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async (next) => {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    if (!this.image.url) {
        this.image.url = `/files/${this.image.key}`;
    }

    next();
});


UserSchema.pre("remove", () => {
    return promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", this.image.key)
    );
});

module.exports = model("User", UserSchema);
