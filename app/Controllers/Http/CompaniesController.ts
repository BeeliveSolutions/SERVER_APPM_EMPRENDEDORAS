import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class CompanyController {
  public async index({ response }: HttpContextContract) {
    try {
      const companies = await Company.query().preload('categories').exec()
      return response.ok(companies)
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const company = await Company.findOrFail(params.id)
      await company.load('user')
      await company.load('categories')
      return response.ok(company)
    } catch (error) {
      console.error(error)
      return response.status(404).send('Company not found')
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const { name, address, description, is_physical, is_virtual, logo_url, user_id, categories } =
        request.only([
          'name',
          'address',
          'description',
          'is_physical',
          'is_virtual',
          'logo_url',
          'user_id',
          'categories',
        ])

      const company = await Company.create({
        name,
        address,
        description,
        is_physical,
        is_virtual,
        logo_url,
        user_id,
      })

      if (categories && categories.length > 0) {
        await company.related('categories').attach(categories)
      }

      await company.load('user')
      await company.load('categories')

      return response.created(company)
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const company = await Company.findOrFail(params.id)
      const data = request.only([
        'name',
        'location',
        'description',
        'physical',
        'virtual',
        'user_id',
      ])
      company.merge(data)
      await company.save()
      return response.ok(company)
    } catch (error) {
      console.error(error)
      return response.status(404).send('Company not found')
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const company = await Company.findOrFail(params.id)
      await company.delete()
      return response.ok({ message: 'Company deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.status(404).send('Company not found')
    }
  }
}
