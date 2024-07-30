interface storeInterface {
    data:any
    put: (key:string,value:string) => void
    getStore: () => any
}
export const store = ():storeInterface => {
    return {
        data: {},

        put: function (key:string, value:string) {
            // data[key] = value
            this.data[key] = value
        },
        getStore: function() {
            return this.data
        }
    }
}
