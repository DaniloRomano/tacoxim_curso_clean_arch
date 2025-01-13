import axios from "axios";

export default interface HttpClient{
    get(url: string): Promise<any>;
    post(url:string, body:any): Promise<any>;
}

export class AxiosHttpClientAdapter implements HttpClient{
    async get(url: string): Promise<any> {
        const response = await axios.get(url);
        return response.data;
    }
    
    async post(url: string, body: any): Promise<any> {
        const response = await axios.post(url,body);
        return response.data;
    }
    
}