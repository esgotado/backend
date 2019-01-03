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

  async createUser (name, pass, email, college_id) {
    /* must add some erros check */

    /* check if this user already exists */
    let data = await this.$repository.findByEmail(email)

    /* don't let create two users with the same email */
    if (data !== null)
       return { error: true, message: "This email was already taken" }

    const hashed_pass = bcrypt.hashSync(pass, 10)
   
    return this.$storage.create(name, hashed_pass, email, parseInt(college_id), 'user', 'client')
  }

  /**
   * Auth an account
   * @param email Person's username
   * @param pass Person's password
   * @returns {Promise<Object>}
   */

  async identify (email, pass) {
    /* must add some erros check */

    /* check if this user already exists */
    const data = await this.$repository.findByEmail(email)
    console.log(data)
    /* if don't has any user with this email just ignore them */
    if (data === null)
      return { error: true, message: "This email doesn't exist on our system" }

    /* if creds are not defined */
    if (!pass || !data.pass)
      return { error: true, message: "Username or password doesn't match" }
      
    /* now we really check the validity */
    const validity = bcrypt.compareSync(pass, data.pass)
   
    if (validity === false)
      return { error: true, message: "Username or password doesn't match" }
   
    return data
  }
}

module.exports = PersonService