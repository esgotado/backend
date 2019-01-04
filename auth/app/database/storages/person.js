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
   * @param fb_id Person's facebook id
   * @param claims Person's account type
   * @param aud Person's audience
   * @returns {Promise<Object>}
   */
  async create (name, pass, email, college_id, fb_id, claims, aud) {
    return this.$model.create({ name: name, pass: pass, email: email, college_id: college_id, fb_id: fb_id, claims: claims, aud: aud })
                      .then(document => document.toObject())
  }
}

module.exports = PersonStorage

