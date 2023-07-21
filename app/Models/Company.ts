import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Category from './Category'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public company_id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public description: string

  @column()
  public is_physical: boolean

  @column()
  public is_virtual: boolean

  @column()
  public logo_url: string

  @column()
  public user_id: number

  @column()
  public uf: string

  @column()
  public city: string

  @column()
  public creation_date: Date

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @column()
  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => Category, {
    pivotTable: 'categories_companies',
    pivotForeignKey: 'company_id',
    pivotRelatedForeignKey: 'category_id',
    relatedKey: 'category_id',
  })
  public categories: ManyToMany<typeof Category>
}
