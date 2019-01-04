'use strict'

class PersonStorage {
  constructor (model) {
    this.$model = model
  }

  /**
   * Creates a new person
   * @param name Person's name
   * @param pass Person's password
   * @param email Person's email
   * @param college_id Person's university
   * @returns {Promise<Object>}
   */
  async create (name, pass, email, college_id) {
    return this.$model.create({ name: name, pass: pass, email: email, college_id: college_id})
                      .then(document => document.toObject())
  }
}

module.exports = PersonStorage

