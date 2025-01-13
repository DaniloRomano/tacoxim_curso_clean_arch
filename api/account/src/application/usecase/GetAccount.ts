import AccountRepository from "../../infra/repository/AccountRepository";

export default class GetAccount {

	constructor (readonly accountRepository: AccountRepository) {
	}
	
	async execute (accountId: string): Promise<GetAccountOutput> {
		const accountData = await this.accountRepository.getAccountById(accountId);
		return {
			accountId: accountData.getAccountId(),
			name: accountData.getName(),
			email: accountData.getEmail(),
			cpf: accountData.getCpf(),
			password: accountData.getPassword(),
			carPlate: accountData.getCarPlate(),
			isDriver: accountData.isDriver,
			isPassenger: accountData.isPassenger
		};
	}
}

type GetAccountOutput={
	accountId: string
	name: string,
	email: string,
	cpf: string,
	password:string,
	carPlate: string,
	isPassenger: boolean,
	isDriver: boolean
}