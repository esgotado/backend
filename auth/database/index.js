'use strict'

const mongoose = require('mongoose')
const config = require('../config')

const PersonModel = require('./models/person')
const PersonStorage = require('./storages/person')
const PersonRepository = require('./repositories/person')

const factory = () => {
  const connection = mongoose.createConnection(config.MONGO_DB_URI)

  const models = {
    person: PersonModel.factory(connection)
  }

  const repositories = {
    person: new PersonRepository(models.person)
  }

  const storages = {
    person: new PersonStorage(models.person)
  }

  return { repositories, storages }
}

module.exports = { factory }