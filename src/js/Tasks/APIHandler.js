class APIHandler
{

    static base()
    {
        return "http://localhost:8080/";
    }

    static async get(res)
    {
        const resp = await fetch(this.base() + res);
        const json = await resp.json();
        return json;
    }

}

export default APIHandler;