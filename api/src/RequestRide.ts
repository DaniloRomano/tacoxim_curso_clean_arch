import RideRepository from "./RideRepository";
import AccountRepository from "./AccountRepository";
import Ride from "./Ride";

export default class RequestRide {
	// DIP - Dependency Inversion Principle
	constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {
	}


	async execute(input: Input) {
		const ride = Ride.create(			
			input.passengerId,			
			input.fromLat,
			input.fromLong,
			input.toLat,
			 input.toLong
		);
		const accountData = await this.accountRepository.getAccountById(input.passengerId);
		if (!accountData.isPassenger) throw new Error("Account must be from a passenger");
		const hasActiveRide = await this.rideRepository.hasActiveByPassengerId(input.passengerId);
		if (hasActiveRide) throw new Error("Passenger already a ride active.")
		await this.rideRepository.saveRide(ride);
		return {
			rideId: ride.rideId
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