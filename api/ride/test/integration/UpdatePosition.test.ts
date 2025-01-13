import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import DatabaseConenction, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import HttpClient, { AxiosHttpClientAdapter } from "../../src/infra/http/HttpClient";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";

let requestRide: RequestRide;
let getRide: GetRide;
let connection: DatabaseConenction;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let httpClient: HttpClient;
let accountGateway: AccountGateway;

beforeEach(() => {
    // const accountDAO = new AccountDAOMemory();
    connection = new PgPromiseAdapter();    
    httpClient = new AxiosHttpClientAdapter();
    accountGateway = new AccountGatewayHttp(httpClient);
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);        
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway,rideRepository,positionRepository);
    acceptRide= new AcceptRide(accountGateway,rideRepository);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository,positionRepository);
});

test("Deve iniciar uma corrida", async function () {
    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        carPlate: "AAA9999",
        isDriver: true
    }
    const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);    
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    await acceptRide.execute(inputAcceptRide);        
    const inputStartRide = {
        rideId: outputRequestRide.rideId
    };
    await startRide.execute(inputStartRide);
    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124
    }
    await updatePosition.execute(inputUpdatePosition1);
    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476
    }
    await updatePosition.execute(inputUpdatePosition2);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("in_progress")
    expect(outputGetRide.distance).toBe(10);
});

afterEach(()=>{
    connection.close();
})