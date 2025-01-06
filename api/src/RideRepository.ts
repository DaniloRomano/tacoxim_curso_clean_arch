import pgp from "pg-promise";
import Ride from "./Ride";

// DAO - Data Access Object

export default interface RideRepository {
	saveRide(ride: Ride): Promise<void>;
	getRideById(rideId: string): Promise<Ride>;
	hasActiveByPassengerId(passengerId: string): Promise<boolean>
}

export class RideRepositoryDatabase implements RideRepository {
	async hasActiveByPassengerId(passengerId: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const ridesData = await connection.query("select * from ccca.ride where passenger_id = $1 and status <>'completed'", [passengerId]);
		await connection.$pool.end();
		return ridesData.length > 0;
	}

	async getRideById(rideId: string) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [rideData] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
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

	async saveRide(ride: any) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query(
			"insert into ccca.ride (ride_id,passenger_id,driver_id, from_lat, from_long, to_lat,to_long,fare,distance,status,date) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);",
			[ride.rideId, ride.passengerId, ride.driverId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]
		);
		await connection.$pool.end();
	}
}
