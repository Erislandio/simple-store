const { Schema, model } = require('mongoose')

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    title: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    showMenu: {
        type: Boolean,
        default: false
    },
    image: {
        name: String,
        size: String,
        key: String,
        url: String,
    }
}, { timestamps: true })

BrandSchema.pre("save", function () {
    if (!this.image.url) {
        this.image.url = `/files/${this.image.key}`;
    }
});

BrandSchema.pre("remove", function () {
    return promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", this.image.key)
    );
});

module.exports = model('Brand', BrandSchema)