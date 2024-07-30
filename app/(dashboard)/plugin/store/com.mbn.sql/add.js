const store = {
    data: {},

    put: function (key, value)  {
        // data[key] = value
        this.data[key] = value
    },
    getStore: () => {
        return data
    }
}

EXECUTE = (form) => {
    let rtn = {}
    let st = store
    let l = ["name","domain","username","password"]
    l.map(ll=>{
        st.put(ll,form.get(ll))
        rtn[ll] = form.get(ll)

    })
    rtn["host"] = "192.168.0.1"
    rtn["type"] = "mysql"
    rtn["providerUrl"] = "goo.com"
    
    return { store: st.data, attr:rtn }
}