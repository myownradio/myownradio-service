import { useContext } from "react"
import { RadioManagerModelContext } from "~/modules/RadioManager"
import { RadioManagerModel } from "../RadioManagerModel"

export function useRadioManagerModel(): RadioManagerModel {
  const probablyRadioManager = useContext(RadioManagerModelContext)

  if (probablyRadioManager === null) {
    throw new TypeError("You probably forgot to put <RadioManagerModelContext.Provider> into your application")
  }

  return probablyRadioManager
}
