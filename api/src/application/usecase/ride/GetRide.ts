import AccountRepository from "../../../infra/repository/AccountRepository";
import RideRepository from "../../../infra/repository/RideRepository";

export default class GetRide {
	// DIP - Dependency Inversion Principle
	constructor(readonly accountDAO: AccountRepository, readonly rideRepository: RideRepository) {
	}


	async execute(rideId: string) :Promise<Output> {		
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerData = await this.accountDAO.getAccountById(ride.getPassengerId());		
		return {
			rideId: ride.getRideId(),
			passengerId: ride.getPassengerId(),
			passengerName: passengerData.getName(),
			driverId: ride.getDriverId(),
			fromLat: ride.getFromLat(),
			fromLong: ride.getFromLong(),
			toLat: ride.getToLat(),
			toLong: ride.getToLong(),
			status: ride.getStatus(),
			fare: ride.fare,
			distance: ride.distance,
			date: ride.date
		}
	}
}

type Output = {
	rideId: string,
	passengerId: string,
	passengerName: string,
	driverId?: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date
}