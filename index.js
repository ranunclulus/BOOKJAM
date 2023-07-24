import app from "./config/express";
import logger from "./config/logger";

app.listen(3000, logger.info("🚀 Server is now listening on port 3000"));
