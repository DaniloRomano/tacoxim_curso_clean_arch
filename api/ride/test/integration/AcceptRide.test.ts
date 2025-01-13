import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import DatabaseConenction, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import HttpClient, { AxiosHttpClientAdapter } from "../../src/infra/http/HttpClient";

let requestRide: RequestRide;
let getRide: GetRide;
let connection: DatabaseConenction;
let httpClient: HttpClient;
let acceptRide: AcceptRide;
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
});

test("Deve aceitar uma corrida", async function () {
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
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);        
    expect(outputGetRide.status).toBe("accepted");    
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(()=>{
    connection.close();
})