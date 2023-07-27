import Application from '@ioc:Adonis/Core/Application'
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

  public async store({ request, response, auth }: HttpContextContract) {
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
        'description',
        'uf',
        'city',
      ])

      const photoUrl = request.file('photo_url')

      if (photoUrl) {
        await photoUrl.move(Application.tmpPath('./uploads'))
      }
      data.photo_url = photoUrl?.clientName
      // Verificar se o email já está sendo usado
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return response.status(400).send('Email already exists')
      }

      const user = await User.create(data)
      const token = await auth.use('api').attempt(data.email, data.password)
      return response.ok({ token, user: user })
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
        'photo_url',
        'description',
        'uf',
        'city',
      ])

      // Verificar se o email já está sendo usado por outro usuário
      if (data.email && data.email !== user.email) {
        const existingUser = await User.findBy('email', data.email)
        if (existingUser) {
          return response.status(400).send('Email already exists')
        }
      }

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
