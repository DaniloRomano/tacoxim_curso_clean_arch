import pgp from "pg-promise";
import Ride from "../../domain/entity/Ride";
import DatabaseConenction from "../database/DatabaseConnection";
import Position from "../../domain/entity/Position";

// DAO - Data Access Object

export default interface RideRepository {
	saveRide(ride: Ride): Promise<void>;
	updateRide(ride: Ride): Promise<void>;
	getRideById(rideId: string): Promise<Ride>;
	hasActiveByPassengerId(passengerId: string): Promise<boolean>
	hasActiveByDriverId(driverId: string): Promise<boolean>	
}

export class RideRepositoryDatabase implements RideRepository {

	constructor(readonly connection: DatabaseConenction) {

	}
	async updateRide(ride: Ride): Promise<void> {
		await this.connection.query("update ccca.ride set status = $1, driver_id=$2 where ride_id = $3",[ride.getStatus(),ride.getDriverId(),ride.getRideId()]);
		await this.connection.query("delete from ccca.position where ride_id=$1",[ride.getRideId()]);		
	}

	async hasActiveByDriverId(driverId: string): Promise<boolean> {
		const ridesData = await this.connection.query("select * from ccca.ride where driver_id = $1 and status <>'completed'", [driverId]);
		return ridesData.length > 0;
	}

	async hasActiveByPassengerId(passengerId: string) {
		const ridesData = await this.connection.query("select * from ccca.ride where passenger_id = $1 and status <>'completed'", [passengerId]);
		return ridesData.length > 0;
	}

	async getRideById(rideId: string) {
		const [rideData] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);		
		return new Ride(
			rideData.ride_id,
			rideData.passenger_id,
			rideData.driver_id,
			parseFloat(rideData.from_lat),
			parseFloat(rideData.from_long),
			parseFloat(rideData.to_lat),
			parseFloat(rideData.to_long),
			parseFloat(rideData.fare),
			parseFloat(rideData.distance),
			rideData.status,
			rideData.date			
		);
	}

	async saveRide(ride: Ride) {
		await this.connection.query(
			"insert into ccca.ride (ride_id,passenger_id,driver_id, from_lat, from_long, to_lat,to_long,fare,distance,status,date) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);",
			[ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.fare, ride.distance, ride.getStatus(), ride.date]
		);
	}
}
