import * as t from "io-ts";

export const RadioChannelsEntityContract = t.interface({
  user_id: t.number, // integer nullable: NO
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  title: t.string, // character varying nullable: NO
  id: t.number, // integer nullable: NO
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
});

export type IRadioChannelsEntity = t.TypeOf<typeof RadioChannelsEntityContract>;

export enum RadioChannelsProps {
  UserId = "user_id",
  UpdatedAt = "updated_at",
  Title = "title",
  Id = "id",
  CreatedAt = "created_at",
}
