import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index({}: HttpContextContract) {
    const users = await User.all()
    return users
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return user
  }

  public async store({ request }: HttpContextContract) {
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
    return user
  }

  public async update({ params, request }: HttpContextContract) {
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
    return user
  }

  public async destroy({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return 'User deleted successfully'
  }
}
