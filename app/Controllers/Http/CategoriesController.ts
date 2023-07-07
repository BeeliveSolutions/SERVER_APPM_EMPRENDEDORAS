import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoryController {
  public async index({}: HttpContextContract) {
    const categories = await Category.all()
    return categories
  }

  public async show({ params }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)
    await category.load('companies')
    return category
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['name'])
    const category = await Category.create(data)
    return category
  }

  public async update({ params, request }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)
    const data = request.only(['name'])
    category.merge(data)
    await category.save()
    return category
  }

  public async destroy({ params }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return 'Category deleted successfully'
  }
}
