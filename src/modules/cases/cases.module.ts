import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { DataImportService } from '../../shared/data-import.service';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CaseSchema } from './entities/case.entity';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([{ name: 'Case', schema: CaseSchema }]),
    ],
    providers: [DataImportService, CasesService],
    controllers: [CasesController],
    exports: [DataImportService, CasesService],
})
export class CasesModule {}
