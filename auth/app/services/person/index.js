'use strict'

const bcrypt = require('bcrypt');

class PersonService {
  /**
   * @param {PersonRepository} repository Person repository instance
   * @param {PersonStorage} storage Person storage instance
   */
  constructor (repository, storage) {
    this.$repository = repository
    this.$storage = storage
  }

  /**
   * Creates a new person
   * @param name Person's name
   * @param pass Person's password
   * @param email Person's email
   * @param college_id Person's university
   * @returns {Promise<Object>}
   */
  async create(name, pass, email, college_id) {
    /* must add some erros check */
    console.log(pass)
    let hashed_pass = bcrypt.hashSync(pass, 10)
    return this.$storage.create(name, hashed_pass, email, parseInt(college_id))
  }
}

module.exports = PersonService