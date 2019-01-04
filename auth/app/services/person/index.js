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

    /* check if this user already exists */
    let data = await this.$repository.findByEmail(email)

    /* don't let create two users with the same email */
    if (data !== null)
       return

    let hashed_pass = bcrypt.hashSync(pass, 10)
   
    return this.$storage.create(name, hashed_pass, email, parseInt(college_id))
  }

  /**
   * Creates a new person
   * @param email Person's username
   * @param pass Person's password
   * @returns {Promise<Object>}
   */

  async identify(email, pass) {
    /* must add some erros check */

    /* check if this user already exists */
    const data = await this.$repository.findByEmail(email)

    /* if don't has any user with this email just ignore them */
    if (data === null)
      return false

    /* if creds are not defined */
    if (!pass || !data.pass)
      return false
      
    const validity = bcrypt.compareSync(pass, data.pass)
   
    if (validity === false)
      return false
   
    return data
  }
}

module.exports = PersonService