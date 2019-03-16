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

    static async post(res, data)
    {
        const resp = await fetch(this.base() + res, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        const json = await resp.json();
        return json;
    }

}

export default APIHandler;