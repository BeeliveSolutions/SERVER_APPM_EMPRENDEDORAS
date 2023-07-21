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
      const {
        name,
        address,
        description,
        is_physical,
        is_virtual,
        logo_url,
        user_id,
        categories,
        uf,
        city,
        creation_date,
      } = request.only([
        'name',
        'address',
        'description',
        'is_physical',
        'is_virtual',
        'logo_url',
        'user_id',
        'categories',
        'uf',
        'city',
        'creation_date',
      ])

      const company = await Company.create({
        name,
        address,
        description,
        is_physical,
        is_virtual,
        logo_url,
        user_id,
        uf,
        city,
        creation_date,
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

  public async filter({ request }: HttpContextContract) {
    const { category, is_physical, is_virtual, uf, city, existence } = request.qs()

    if (!category && !is_physical && !is_virtual && !uf && !city && !existence) {
      return 'É necessário escolher pelo menos um filtro'
    }

    const query = Company.query()

    if (category) {
      query.whereExists((builder) => {
        builder
          .from('categories_companies')
          .whereRaw('companies.company_id = categories_companies.company_id')
          .whereIn('categories_companies.category_id', category.split(','))
      })
    }

    if (is_physical) {
      query.where('companies.is_physical', is_physical)
    }

    if (is_virtual) {
      query.where('companies.is_virtual', is_virtual)
    }

    if (uf) {
      query.where('companies.uf', uf)
    }

    if (city) {
      query.where('companies.city', city)
    }

    if (existence) {
      // Parse existence value to a valid date format
      const existenceDate = new Date(existence)
      query.where('companies.created_at', '>=', existenceDate)
    }

    const companies = await query

    if (companies.length === 0) {
      return 'Nenhuma empresa encontrada com os critérios de filtro fornecidos'
    }

    return companies
  }
}
