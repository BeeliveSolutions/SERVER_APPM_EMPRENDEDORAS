// app/Models/Event.ts

import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public eventId: number

  @column()
  public title: string

  @column()
  public description: string

  @column.dateTime()
  public dateStart: DateTime

  @column.dateTime()
  public dateEnd: DateTime

  @column()
  public location: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
