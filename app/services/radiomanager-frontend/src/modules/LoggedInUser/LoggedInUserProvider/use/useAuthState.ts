import { Dispatch, SetStateAction, useState } from "react";

import { SuccessfulMeResponse } from "~/services/AuthService";

type IUserState = SuccessfulMeResponse;
type ILoginState =
  | { readonly authenticated: true; readonly userState: IUserState }
  | { readonly authenticated: false | null };

export default function useAuthState(): [ILoginState, Dispatch<SetStateAction<ILoginState>>] {
  return useState<ILoginState>({ authenticated: null });
}
