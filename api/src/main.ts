import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import GetAccount from "./application/usecase/accout/GetAccount";
import Signup from "./application/usecase/accout/Signup";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";

// Entry point - composition root

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);

new AccountController(httpServer, signup, getAccount);

httpServer.listen(3000);