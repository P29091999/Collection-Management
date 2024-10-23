import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { Case, CaseDocument } from '../entities/case.entity';
@Injectable()
export class DataImportService {
    private readonly logger = new Logger(DataImportService.name);

    constructor(
        @InjectModel(Case.name)
        private caseModel: Model<CaseDocument>,
        private schedulerRegistry: SchedulerRegistry,
    ) {
        this.scheduleDataImportJobs();
    }

    /**
     * Sets up CRON jobs for importing data at specified times.
     */
    private scheduleDataImportJobs() {
        const job10AM = new CronJob(
            '0 10 * * *',
            async () => {
                await this.importData('../../../uploads/sample-data.csv');
            },
            null,
            true,
            'UTC',
        );

        const job5PM = new CronJob(
            '0 17 * * *',
            async () => {
                await this.importData('./uploads/sample-data.csv');
            },
            null,
            true,
            'UTC',
        );

        this.schedulerRegistry.addCronJob('dataImportJob10AM', job10AM);
        this.schedulerRegistry.addCronJob('dataImportJob5PM', job5PM);
        job10AM.start();
        job5PM.start();

        this.logger.log('Data import jobs scheduled at 10 AM and 5 PM UTC.');
    }

    /**
     * Reads and imports data from the specified CSV file path.
     * Parses CSV content into database entries.
     */
    async importData(filePath: string): Promise<void> {
        const stream = fs.createReadStream(filePath);
        const cases: any[] = [];

        stream
            .pipe(csv())
            .on('data', (row) => {
                const caseData = {
                    bankName: row.bankName,
                    propertyName: row.propertyName,
                    city: row.city,
                    borrowerName: row.borrowerName,
                    createdAt: new Date(row.createdAt),
                };
                cases.push(caseData);
            })
            .on('end', async () => {
                try {
                    await this.caseModel.insertMany(cases);
                    this.logger.log(
                        `Imported ${cases.length} cases into the database.`,
                    );
                } catch (error) {
                    this.logger.error('Failed to import data', error);
                }
            })
            .on('error', (error) =>
                this.logger.error('Error reading CSV file', error),
            );
    }
}
