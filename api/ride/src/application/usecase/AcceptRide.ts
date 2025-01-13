import AccountGateway from "../../infra/gateway/AccountGateway";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
	// DIP - Dependency Inversion Principle
	constructor(readonly accountGateway: AccountGateway, readonly rideRepository: RideRepository) {
	}


	async execute(input: Input) {
		const account = await this.accountGateway.getAccountById(input.driverId);
		if (!account.isDriver) throw new Error("Accout must be a driver");
		const hasRideActive = await this.rideRepository.hasActiveByDriverId(input.driverId);
		if (hasRideActive) throw new Error("Driver is not available");
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.accept(input.driverId);
		await this.rideRepository.updateRide(ride);
	}
}

type Input = {
	rideId: string,
	driverId: string
}