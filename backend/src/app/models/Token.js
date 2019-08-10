const { Schema, model } = require('mongoose')


const TokenSchema = new Schema({
    _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Token', TokenSchema)

