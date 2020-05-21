import * as t from "io-ts"

export const RefreshTokensEntityContract = t.interface({
  user_id: t.number, // integer nullable: NO
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  id: t.number, // integer nullable: NO
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  refresh_token: t.string, // character varying nullable: NO
})

export type IRefreshTokensEntity = t.TypeOf<typeof RefreshTokensEntityContract>

export enum RefreshTokensProps {
  UserId = "user_id",
  UpdatedAt = "updated_at",
  Id = "id",
  CreatedAt = "created_at",
  RefreshToken = "refresh_token",
}
