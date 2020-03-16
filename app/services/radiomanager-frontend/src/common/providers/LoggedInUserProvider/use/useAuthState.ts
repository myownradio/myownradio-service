import { Dispatch, SetStateAction, useState } from "react";
import { ISuccessfulMeResponse } from "~/services/authApiService";

type IUserState = ISuccessfulMeResponse;
type ILoginState =
  | { readonly authenticated: true; readonly userState: IUserState }
  | { readonly authenticated: false | null };

export default function useAuthState(): [ILoginState, Dispatch<SetStateAction<ILoginState>>] {
  return useState<ILoginState>({ authenticated: null });
}
