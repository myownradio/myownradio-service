import { Dispatch, SetStateAction, useState } from "react"

import { ILocaleKey } from "~/locales"

export type IErrorMessage = ILocaleKey | null

export default function useErrorMessage(): [IErrorMessage, Dispatch<SetStateAction<IErrorMessage>>] {
  return useState<IErrorMessage>(null)
}
