import DistanceCalculator from "../../domain/service/DistanceCalculator";
import AccountGateway from "../../infra/gateway/AccountGateway";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
	// DIP - Dependency Inversion Principle
	constructor(readonly accountGateway: AccountGateway, readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {
	}

	async execute(rideId: string) :Promise<Output> {		
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerData = await this.accountGateway.getAccountById(ride.getPassengerId());	
		const positions = await this.positionRepository.listByRideId(ride.getRideId());		
		return {
			rideId: ride.getRideId(),
			passengerId: ride.getPassengerId(),
			passengerName: passengerData.name,
			driverId: ride.getDriverId(),
			fromLat: ride.getFromLat(),
			fromLong: ride.getFromLong(),
			toLat: ride.getToLat(),
			toLong: ride.getToLong(),
			status: ride.getStatus(),
			fare: ride.fare,
			distance:DistanceCalculator.calculateBetweenPositions(positions),
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