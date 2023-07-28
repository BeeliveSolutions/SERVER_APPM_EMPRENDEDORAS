import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoryController {
  public async index({ response }: HttpContextContract) {
    try {
      const categories = await Category.all()
      return categories
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.load('companies')
      return response.ok(category)
    } catch (error) {
      console.error(error)
      return response.status(404).send('Category not found')
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name'])
      const category = await Category.create(data)
      return response.created(category)
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      const data = request.only(['name'])
      category.merge(data)
      await category.save()
      return response.ok(category)
    } catch (error) {
      console.error(error)
      return response.status(404).send('Category not found')
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.ok({ message: 'Category deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.status(404).send('Category not found')
    }
  }
}
