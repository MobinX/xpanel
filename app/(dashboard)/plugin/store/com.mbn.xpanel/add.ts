import { store } from "../../src/developer/store"

var EXECUTE = (form:any) => {
    const name = form.get("name")
    const namex = form.get("namex")
    let st = store()
    st.put("name", name)
    st.put("namex", namex)
    return { store: st.data, name: name, domain: namex }
}