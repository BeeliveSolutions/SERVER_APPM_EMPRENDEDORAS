// app/Controllers/Http/EventController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import User from 'App/Models/User'

export default class EventController {
  public async index({ response }: HttpContextContract) {
    try {
      const events = await Event.query().preload('user')
      return events
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const event = await Event.query().where('eventId', params.id).preload('user').firstOrFail()
      return event
    } catch (error) {
      console.error(error)
      return response.status(404).send('Event not found')
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const user = auth.user as User

      if (!user.is_admin) {
        return response.status(403).send('Only admins can create events')
      }

      const data = request.only(['title', 'description', 'dateStart', 'dateEnd', 'location'])

      const event = new Event()
      event.fill(data)
      await event.related('user').associate(user)
      await event.save()

      return response.created(event)
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const event = await Event.findOrFail(params.id)

      const data = request.only(['title', 'description', 'dateStart', 'dateEnd', 'location'])

      event.merge(data)
      await event.save()

      return response.ok(event)
    } catch (error) {
      console.error(error)
      return response.status(404).send('Event not found')
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const event = await Event.findOrFail(params.id)
      await event.delete()

      return response.ok({ message: 'Event deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.status(404).send('Event not found')
    }
  }
}
