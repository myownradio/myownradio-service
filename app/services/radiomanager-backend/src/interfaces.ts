import * as knex from "knex"
import { Context } from "koa"

export type KnexConnection = knex

export interface TypedContext<T> extends Context {
  body: T
}
