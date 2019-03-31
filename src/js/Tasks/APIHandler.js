class APIHandler
{

    static init(base)
    {
        this.base = base + "api/";
    }

    static get_token()
    {
        return document.querySelector("meta[name='csrf-token']").getAttribute("content");
    }

    static async get(res)
    {
        const resp = await fetch(this.base + res, {
            headers: {
                "CsrfToken": this.get_token()
            }
        });
        const json = await resp.json();
        return json;
    }

    static async post(res, data)
    {
        const resp = await fetch(this.base + res, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "CsrfToken": this.get_token()
                },
                body: JSON.stringify(data)
            }
        );
        const json = await resp.json();
        return json;
    }

}

export default APIHandler;