import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoryController {
  public async index({ response }: HttpContextContract) {
    try {
      const categories = await Category.all()
      return categories
    } catch (error) {
      console.error(error)
      return response.status(500).json({ msg: 'Ocorreu um erro' })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.load('companies')
      return response.ok(category)
    } catch (error) {
      console.error(error)
      return response.status(404).json({ msg: 'Categoria não encontrada' })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name'])
      const category = await Category.create(data)
      return response.created(category)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ msg: 'Ocorreu um erro' })
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
      return response.status(404).json({ msg: 'Categoria não encontrada' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.ok({ msg: 'Categoria excluída com sucesso' })
    } catch (error) {
      console.error(error)
      return response.status(404).json({ msg: 'Categoria não encontrada' })
    }
  }
}
