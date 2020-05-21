import * as t from "io-ts";

export const UsersEntityContract = t.interface({
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  email: t.string, // character varying nullable: NO
  id: t.number, // integer nullable: NO
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  password: t.string, // character varying nullable: NO
});

export type IUsersEntity = t.TypeOf<typeof UsersEntityContract>;

export enum UsersProps {
  UpdatedAt = "updated_at",
  Email = "email",
  Id = "id",
  CreatedAt = "created_at",
  Password = "password",
}
