import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import DatabaseConenction, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import HttpClient, { AxiosHttpClientAdapter } from "../../src/infra/http/HttpClient";

let requestRide: RequestRide;
let getRide: GetRide;
let connection: DatabaseConenction;
let accountGateway : AccountGateway;
let httpClient: HttpClient;

beforeEach(() => {
    // const accountDAO = new AccountDAOMemory();
    connection = new PgPromiseAdapter();    
    httpClient = new AxiosHttpClientAdapter();
    accountGateway = new AccountGatewayHttp(httpClient);
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);                
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway,rideRepository,positionRepository);
});

test("Deve solicitar um corrida", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);    
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);    
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.fare).toBe(0);
    expect(outputGetRide.distance).toBe(0);
});


test("Não deve solicitar uma corrida se a conta não for passageiro", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isDriver: true,
        carPlate: "AAA9999"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await expect(()=> requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account must be from a passenger"));      
});

test("Não deve solicitar uma corrida se já houver outra ativa", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide);    
    await expect(()=> requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger already a ride active."));      
});

afterEach(()=>{
    connection.close();
})