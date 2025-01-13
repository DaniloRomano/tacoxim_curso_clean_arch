 import HttpClient from '../http/HttpClient';
export default interface AccountGateway{
    signup(input: any): Promise<any>;
    getAccountById(accountId: string): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway{

    constructor(readonly httpClient: HttpClient){

    }

    async signup(input: SignupInput): Promise<any> {
        const response = await this.httpClient.post("http://localhost:3000/signup",input);
        return response;
    }
    async getAccountById(accountId: string): Promise<GetAccountByIdOutput> {
        const response = await this.httpClient.get(`http://localhost:3000/accounts/${accountId}`);
        return response;
    }

}

type SignupInput = {
	name: string,
	email: string,
	cpf: string,
	password:string,
	carPlate?: string,
	isPassenger?: boolean,
	isDriver?: boolean
}

type GetAccountByIdOutput= {
    accountId: string
	name: string,
	email: string,
	cpf: string,
	password:string,
	carPlate?: string,
	isPassenger?: boolean,
	isDriver?: boolean
}