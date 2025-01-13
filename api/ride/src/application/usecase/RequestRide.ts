import Ride from "../../domain/entity/Ride";
import AccountGateway from "../../infra/gateway/AccountGateway";
import RideRepository from "../../infra/repository/RideRepository";

export default class RequestRide {
	// DIP - Dependency Inversion Principle
	constructor(readonly accountGateway: AccountGateway, readonly rideRepository: RideRepository) {
	}


	async execute(input: Input) {
		const ride = Ride.create(			
			input.passengerId,			
			input.fromLat,
			input.fromLong,
			input.toLat,
			 input.toLong
		);
		const accountData = await this.accountGateway.getAccountById(input.passengerId);
		if (!accountData.isPassenger) throw new Error("Account must be from a passenger");
		const hasActiveRide = await this.rideRepository.hasActiveByPassengerId(input.passengerId);
		if (hasActiveRide) throw new Error("Passenger already a ride active.")
		await this.rideRepository.saveRide(ride);
		return {
			rideId: ride.getRideId()
		}
	}
}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong:number,
	toLat:number,
	toLong: number
}