import { createLogger, transports, format } from "winston";
import { SERVICE_NAME } from "./variables";

const logger = createLogger({
  level: "debug",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: SERVICE_NAME },
  transports: [new transports.Console()],
});

const stream = {
  write: (message: string) => {
    // message is like \u001b[0mPOST /users/login \u001b[32m200\u001b[0m 150.090 ms - 56\u001b[0m\n, make it more readable
    const splitedMessage = message.split("\u001b");
    // remove all [0m and [32m
    const endMessage = splitedMessage
      .map((item) => {
        if (item.includes("m")) {
          const splitedItem = item.split("m");
          return splitedItem[1];
        }
        return item;
      })
      .join("");

    logger.info(endMessage);
  },
};

export { logger, stream };
