import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfiguration from './config/database.configuration';
import { CasesModule } from './modules/cases/cases.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CasesModule,
        MongooseModule.forRootAsync(databaseConfiguration),
    ],
})
export class AppModule {}
