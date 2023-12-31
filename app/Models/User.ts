import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public user_id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public phone_number: string

  @column()
  public birth_date: Date

  @column()
  public address: string

  @column()
  public is_entrepreneur: Boolean

  @column()
  public photo_url: string

  @column()
  public is_admin: Boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @column()
  public description: string

  @column()
  public uf: string

  @column()
  public city: string

  @column()
  public reset_password_token: number | null

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
