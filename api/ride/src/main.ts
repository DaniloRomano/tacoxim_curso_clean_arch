import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";

// Entry point - composition root

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
httpServer.listen(3001);