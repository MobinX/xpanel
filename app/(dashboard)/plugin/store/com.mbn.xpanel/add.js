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
    let l = ["name","domain","host","filepath","database"]
    l.map(ll=>{
        st.put(ll,form.get(ll))
        rtn[ll] = form.get(ll)

    })
    rtn["language"] = "php"
    rtn["framwork"] = "laravel"
    
    return { store: st.data, attr:rtn }
}