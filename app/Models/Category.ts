import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public category_id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @manyToMany(() => Company, {
    pivotTable: 'categories_companies',
    pivotForeignKey: 'category_id',
    pivotRelatedForeignKey: 'company_id',
    relatedKey: 'company_id',
  })
  public companies: ManyToMany<typeof Company>
}
