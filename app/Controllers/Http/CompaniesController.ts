import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class CompanyController {
  public async index({}: HttpContextContract) {
    const companies = await Company.query().preload('categories').exec()
    return companies
  }

  public async show({ params }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    await company.load('user')
    await company.load('categories')
    return company
  }

  public async store({ request }: HttpContextContract) {
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

    const company = new Company()
    company.name = name
    company.address = address
    company.description = description
    company.is_physical = is_physical
    company.is_virtual = is_virtual
    company.logo_url = logo_url
    company.user_id = user_id

    await company.save()

    if (categories && categories.length > 0) {
      await company.related('categories').attach(categories)
    }

    await company.load('user')
    await company.load('categories')

    return company
  }

  public async update({ params, request }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    const data = request.only(['name', 'location', 'description', 'physical', 'virtual', 'user_id'])
    company.merge(data)
    await company.save()
    return company
  }

  public async destroy({ params }: HttpContextContract) {
    const company = await Company.findOrFail(params.id)
    await company.delete()
    return 'Company deleted successfully'
  }
}
