import * as t from "io-ts";

export const RadioChannelsEntityContract = t.interface({
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  id: t.number, // integer nullable: NO
  title: t.string, // character varying nullable: NO
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  user_id: t.number, // integer nullable: NO
});

export type IRadioChannelsEntity = t.TypeOf<typeof RadioChannelsEntityContract>;

export enum RadioChannelsProps {
  CreatedAt = "created_at",
  Id = "id",
  Title = "title",
  UpdatedAt = "updated_at",
  UserId = "user_id",
}
