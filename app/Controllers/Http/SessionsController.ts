import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class SessionsController {
  public async store({ auth, request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')

      const user = await User.findBy('email', email)

      if (!user) {
        return response.badRequest('User not found')
      }

      if (!(await Hash.verify(user.password, password))) {
        return response.unauthorized('Invalid credentials')
      }

      const token = await auth.use('api').attempt(email, password)
      const userData = {
        id: user.user_id,
        email: user.email,
        username: user.name,
        // Adicione outros dados essenciais do usuário aqui
      }

      return response.ok({ token, user: userData })
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      return response.ok('Logout realizado com sucesso')
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }
}
