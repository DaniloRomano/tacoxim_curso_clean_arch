import RideRepository from "./RideRepository";
import AccountRepository from "./AccountRepository";

export default class GetRide {
	// DIP - Dependency Inversion Principle
	constructor(readonly accountDAO: AccountRepository, readonly rideRepository: RideRepository) {
	}


	async execute(rideId: string) :Promise<Output> {		
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerData = await this.accountDAO.getAccountById(ride.passengerId);		
		return {
			rideId: ride.rideId,
			passengerId: ride.passengerId,
			 passengerName: passengerData.name,
			driverId: ride.driverId,
			fromLat: ride.fromLat,
			fromLong: ride.fromLong,
			toLat: ride.toLat,
			toLong: ride.toLong,
			status: ride.status,
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
	driverId: string | null,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date
}