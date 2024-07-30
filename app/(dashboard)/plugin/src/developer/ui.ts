export interface UIInterface {
    type: "text" | "select" | "checkbox"| "password" | "email"
    label: string
    name: string
    // data?: string[] /*for option */ | string /*for placeholder */
    data?:any
    value?: any//if it has default value
}

export const UITextInput = (label:string,placeholder:string,name:string,value=""):UIInterface => { return {type:"text" , label:label, data:placeholder, name:name,value:value} }
export const UITEmailInput = (label:string,placeholder:string,name:string,value=""):UIInterface => { return {type:"email" , label:label, data:placeholder, name:name,value:value} }
export const UIPasswordInput = (label:string,placeholder:string,name:string,value=""):UIInterface => { return {type:"password" , label:label, data:placeholder, name:name,value:value} }
export const UISelectBox = (label:string,options:string[],name:string,value=""):UIInterface => { return {type:"select" , label:label, data:options, name:name,value:value} }
export const UICheckBox = (label:string,name:string,value=false):UIInterface => { return {type:"checkbox" , label:label,name:name,value:value} }
