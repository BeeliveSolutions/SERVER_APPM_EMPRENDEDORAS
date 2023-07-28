import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

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

  public async forgotPassword({ request, response }: HttpContextContract) {
    try {
      const phone = request.input('phone_number')
      const user = await User.findBy('phone_number', phone)
      if (!user) {
        return response.badRequest('User not found')
      }

      const resetToken = generateRandomNumbers()

      user.reset_password_token = resetToken
      await user.save()

      const iAgenteSMSUrl = Env.get('SMS_USER')
      const iAgenteSMSParams = new URLSearchParams({
        metodo: 'envio',
        usuario: Env.get('SMS_USER'),
        senha: Env.get('SMS_PASSWORD'),
        celular: phone,
        mensagem: `MULHERES EMPREENDEDORAS - Seu código de redefinição de senha é: ${resetToken}`,
      })

      const requestOptions = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }

      // Use o axios para fazer a requisição HTTP
      await axios
        .post(iAgenteSMSUrl, iAgenteSMSParams.toString(), requestOptions)
        .then((response) => {
          console.log(response)
        })
        .catch((err) => {
          console.log('Error', err)
        })

      return response.ok('SMS de redefinição de senha enviado com sucesso')
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    try {
      const phone = request.input('phone_number')
      const token = request.input('token')
      const newPassword = request.input('new_password')
      const user = await User.findByOrFail('phone_number', phone)

      // Verificar se o token fornecido pelo usuário corresponde ao token no banco de dados
      if (user.reset_password_token !== token) {
        return response.badRequest('Invalid token')
      }

      // Resetar a senha do usuário
      user.reset_password_token = null // Remover o token de redefinição de senha
      user.password = newPassword // Hash da nova senha
      await user.save()
      return response.ok('Password reset successfully')
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }
}

function generateRandomNumbers(): number {
  const numbers: number[] = []
  const numberOfNumbers = 2

  for (let i = 0; i < numberOfNumbers; i++) {
    const randomNumber = Math.floor(Math.random() * 100)
    numbers.push(randomNumber)
  }

  // Concatenar os números em uma única string e convertê-la para número
  const numbersString = numbers.join('')
  const randomNumber = Number(numbersString)
  return randomNumber
}
