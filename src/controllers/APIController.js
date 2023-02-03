const axios = require('axios');

class APIController {
    constructor(){
        this.base_MTA = "https://api-mta.vercel.app";
    }

    async fetchMTA(ip, port){
        let get = await axios.get(this.base_MTA + `/server/${ip}/${port}`).catch(e=>{
            new Error(e); return null;
        });
        if(!get) return null;
        return get.data;
    }

}

module.exports = new APIController();