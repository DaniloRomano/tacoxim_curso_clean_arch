import Coord from "./vo/Coord";
import UUID from "./vo/UUID";

export default class Position{
    private positionId: UUID;
    private rideId: UUID;
    private coord: Coord;
    private date: Date;

    constructor(positionId: string, rideId:string, lat:number, long:number,date: Date){
        this.positionId= new UUID(positionId);
        this.rideId = new UUID(rideId);
        this.coord= new Coord(lat, long);
        this.date = date;
    }

    static create(rideId: string, lat: number, long:number){
        const positionId= UUID.create();
        const date = new Date();
        return new Position(positionId.getValue(),rideId, lat, long, date);
    }

    getRideId(){
        return this.rideId.getValue();
    }

    getPositionId(){
        return this.positionId.getValue();
    }

    getCoord(){
        return this.coord;
    }

    getDate(){
        return this.date;
    }
}