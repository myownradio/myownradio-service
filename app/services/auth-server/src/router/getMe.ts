import { StrictlyTypedRouteHandler } from "@mor/common/koa"
import { UserResource } from "@myownradio/domain/resources/UserResource"
import { IUsersEntity, TableName } from "@myownradio/entities/db"
import { Config } from "../config"
import { Knex } from "../knex"

export function getMe(config: Config, knex: Knex): StrictlyTypedRouteHandler<UserResource> {
  void config

  return async (ctx): Promise<void> => {
    const { uid } = ctx.state.user

    const userDetails = await knex<IUsersEntity>(TableName.Users)
      .where({ id: uid })
      .first()

    if (!userDetails) {
      ctx.throw(401)
      return
    }

    ctx.body = {
      email: userDetails.email,
    }
  }
}
