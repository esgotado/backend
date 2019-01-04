'use strict'

class PersonRepository {
  constructor (model) {
    this.$model = model
  }

  /**
   * Finds an person by its email
   * @param {String} _email person email
   * 
   */
  async findByEmail (_email) {
    return this.$model.findOne({ email: _email })
                      .lean()
  }

  /**
   * Finds an person by its username
   * @param {String} _user person username
   * 
   */
  async findByUser (_user) {
    return this.$model.findOne({ user: _user })
                      .lean()
  }

}

module.exports = PersonRepository