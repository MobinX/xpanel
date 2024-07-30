import { environment_web_lang_framwork, environment_web_lang } from "../db/webManager"

export  function getLangFramworksIncludeLangs(langName: string, supported_version: string, langs:environment_web_lang[]): environment_web_lang_framwork[]  {
    let langPortion = langs.find(lang => lang.name == langName)
    if (langPortion) {
        let framworks: environment_web_lang_framwork[] = []
        langPortion.framworks.map(framwork => { if (framwork.supported_lang_v == supported_version) framworks.push(framwork) })
        return framworks
    }

    return [];
}