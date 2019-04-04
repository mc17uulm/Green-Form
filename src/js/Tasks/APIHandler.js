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
        const resp = await this.request("GET", this.base + res, {"CsrfToken": this.get_token()});
        const json = JSON.parse(resp);
        return json;
    }

    static async post(res, data)
    {
        const resp = await this.request("POST", this.base + res, {
            "Content-Type": "application/json",
            "CsrfToken": this.get_token()
        }, JSON.stringify(data));
        const json = JSON.parse(resp);
        return json;
    }

    static async request(type, url, headers, body = "") {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(type, url);
            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });
            xhr.onload = () => {
                if(xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({status: xhr.status, statusText: xhr.statusText});
                }
            };
            xhr.onerror = () => {
                reject({status: xhr.status, statusText: xhr.statusText});
            };
            xhr.send(body);
        });
    }

}

export default APIHandler;