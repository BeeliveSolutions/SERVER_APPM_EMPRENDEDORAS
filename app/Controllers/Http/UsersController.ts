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
      return response.status(500).json({ msg: 'Ocorreu um erro' })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      return response.ok(user)
    } catch (error) {
      console.error(error)
      return response.status(404).json({ msg: 'Usuário não encontrado' })
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

      const phoneExist = await User.findBy('phone_number', data.phone_number)
      const existingUser = await User.findBy('email', data.email)
      if (existingUser || phoneExist) {
        return response.status(400).json({ msg: 'O email ou telefone já está registrado' })
      }

      const user = await User.create(data)
      const token = await auth.use('api').attempt(data.email, data.password)
      return response.ok({ token, user: user })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ msg: 'Ocorreu um erro' })
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
          return response.status(400).json({ msg: 'Email já está em uso' })
        }
      }

      user.merge(data)
      await user.save()
      return response.ok(user)
    } catch (error) {
      console.error(error)
      return response.status(404).json({ msg: 'Usuário não encontrado' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.ok({ msg: 'Usuário deletado com sucesso' })
    } catch (error) {
      console.error(error)
      return response.status(404).json({ msg: 'Usuário não encontrado' })
    }
  }
}
