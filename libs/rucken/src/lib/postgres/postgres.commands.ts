import { Command, Console } from 'nestjs-console';
import { UtilsService } from '../utils/utils.service';
import { DEFAULT_POSTGRES_CONFIG } from './postgres.config';
import { PostgresService } from './postgres.service';

@Console()
export class PostgresCommands {
  private readonly postgresConfig = this.utilsService.getRuckenConfig(
    DEFAULT_POSTGRES_CONFIG
  ).postgres;

  constructor(
    private readonly postgresService: PostgresService,
    private readonly utilsService: UtilsService
  ) {}

  @Command({
    command: 'postgres',
    description: 'postgres application database creator',
    options: [
      {
        flags: '-r,--root-database-url [strings]',
        description:
          'database url for connect as root user (example: postgres://ROOT_POSTGRES_USER:ROOT_POSTGRES_PASSWORD@localhost:POSTGRES_PORT/postgres?schema=public)',
      },
      {
        flags: '-a,--app-database-url [strings]',
        description:
          'application database url used for create new database (example: postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/POSTGRES_DATABASE?schema=public)',
      },
      {
        flags: '-fcu,--force-change-username [boolean]',
        description:
          'rename & change password of existing one database (default: false)',
      },
      {
        flags: '-d,--drop-app-database [boolean]',
        description:
          'drop application database before try create it (default: false)',
      },
    ],
  })
  async postgres({
    rootDatabaseUrl,
    appDatabaseUrl,
    forceChangeUsername,
    dropAppDatabase,
  }: {
    rootDatabaseUrl: string;
    appDatabaseUrl: string;
    forceChangeUsername?: boolean;
    dropAppDatabase?: boolean;
  }) {
    this.postgresService.setLogger(PostgresService.title);
    await this.postgresService.postgres({
      dropAppDatabase: dropAppDatabase || this.postgresConfig.dropAppDatabase,
      rootDatabaseUrl,
      appDatabaseUrl,
      forceChangeUsername,
      extensions: this.postgresConfig.extensions,
    });
  }
}
