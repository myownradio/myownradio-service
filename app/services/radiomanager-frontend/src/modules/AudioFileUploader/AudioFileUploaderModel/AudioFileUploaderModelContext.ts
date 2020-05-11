import { createContext } from "react"
import { AudioFileUploaderModel } from "./AudioFileUploaderModel"

export const AudioFileUploaderModelContext = createContext<AudioFileUploaderModel | null>(null)
