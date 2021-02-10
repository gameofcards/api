import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';

const { createLogger, format, transports } = winston;

const env = process.env.NODE_ENV || 'dev';

interface Options {
  dir: string;
}

/**
 * Small wrapper class to setup winston logger. Constructor provides the
 * option for outputting the results to a directory.
 * @public
 * @param options { dir?: string }
 *
 */
class Logger {
  private logger: winston.Logger;
  private filename: string;
  private static instance: Logger;

  /**
   * This method will return our singleton logger instance.
   * @param options { dir?: string }
   * @public
   */
  public static GetInstance(options?: Options) {
    if (Logger.instance) {
      return Logger.instance.logger;
    }
    Logger.instance = new Logger(options);
    return Logger.instance.logger;
  }

  /**
   * This private constructor will initialize our singleton logger.
   * @param options { dir?: string }
   * @private
   */
  private constructor(options?: Options) {
    this.logger = null;
    this.filename = '';
    if (options) {
      this.setupDirectory(options);
    }
    this.initialize();
  }

  /**
   * This method will setup the output directory if it does not exist
   * and set the filename.
   * @param options { dir?: string }
   * @private
   */
  private setupDirectory(options) {
    if (!fs.existsSync(options.dir)) {
      fs.mkdirSync(options.dir);
    }
    this.filename = path.join(options.dir, 'debug.log');
  }

  /**
   * This method will initialize the logger.
   * @private
   */
  private initialize() {
    this.logger = createLogger({
      // change level if in dev environment versus production
      level: env === 'dev' ? 'debug' : 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: this.getTransports(),
    });
  }

  /**
   * This method will return the transports for the data. It conditionally adds an output
   * directory if the user requested it.
   * @private
   */
  private getTransports() {
    const { filename } = this;
    let ports: winston.transport[] = [
      new transports.Console({
        level: 'info',
        silent: env !== 'test',
        format: format.combine(
          format.colorize(),
          format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
      }),
    ];
    if (filename) {
      ports.push(new transports.File({ filename }));
    }
    return ports;
  }
}

export const logger = Logger.GetInstance({ dir: 'debug' });
