'use strict'

const bcrypt = require('bcrypt')

class PersonService {
	/**
	 * @param {PersonRepository} repository Person repository instance
	 * @param {PersonStorage} storage Person storage instance
	 */
	constructor(repository, storage) {
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
			return {
				code: 400,
				error: true,
				message: '[ERROR] User already created.',
			}

		// check for required fields
		if (!(name && pass && email))
			return {
				code: 400,
				error: true,
				message: 'missing field',
			}

		let hashed_pass = bcrypt.hashSync(pass, 10)
		return {
			code: 200,
			message: '[SUCCESS] User created with success.',
			...this.$storage.create(
				name,
				hashed_pass,
				email,
				parseInt(college_id)
			),
		}
	}

	/**
	 * Find user data by email
	 * @param email Person's email
	 * @returns {Promise<Object>}
	 */

	async findByEmail(email) {
		/* must add some erros check */
		if (!email) return { error: true, message: 'Query for something' }

		/* check if this user already exists */
		const data = await this.$repository.findByEmail(email)

		/* if don't has any user with this email just ignore them */
		if (data === null)
			return {
				error: true,
				message: "This email doesn't exist on our system",
			}

		return data
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
			return {
				error: true,
				message: "User doesn't exist",
			}

		/* if creds are not defined */
		if (!pass || !data.pass)
			return {
				error: true,
				message: 'Password not informed',
			}

		const validity = bcrypt.compareSync(pass, data.pass)

		return validity
			? data
			: {
					error: true,
					message: 'Wrong password',
			  }
	}
}

module.exports = PersonService
