'use strict'

const { Schema } = require('mongoose')

const properties = {
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    college_id: {
        type: Number,
        required: true
    }
}

const options = {
    collection: 'people',
    id: false,
    safe: true,
    strict: true,
    timestamps: false,
    versionKey: false
  }
  
  const schema = new Schema(properties, options)
  
  const factory = (connection) => {
    return connection.model('Person', schema)
  }
  
  module.exports = schema
  module.exports.factory = factory
  
  