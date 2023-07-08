import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all()
      return users
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      return response.ok(user)
    } catch (error) {
      console.error(error)
      return response.status(404).send('User not found')
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'name',
        'email',
        'password',
        'phone_number',
        'birth_date',
        'address',
        'is_entrepreneur',
        'photo_url',
      ])

      const user = await User.create(data)
      return response.created(user)
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      const data = request.only([
        'name',
        'email',
        'password',
        'phone_number',
        'birth_date',
        'address',
        'is_entrepreneur',
        'photo',
      ])
      user.merge(data)
      await user.save()
      return response.ok(user)
    } catch (error) {
      console.error(error)
      return response.status(404).send('User not found')
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.ok({ message: 'User deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.status(404).send('User not found')
    }
  }
}
