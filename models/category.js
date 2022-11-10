const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  icon: {
    type: String,
    require: true
  },
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }]
})
module.exports = mongoose.model('Category', categorySchema)