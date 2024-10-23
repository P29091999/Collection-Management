import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Case, CaseDocument } from './entities/case.entity';
import AggregateResult from './interface/case.interface';

@Injectable()
export class CasesService {
    constructor(
        @InjectModel(Case.name)
        private caseModel: Model<CaseDocument>,
    ) {}

    /**
     * Aggregates data based on the specified city and date range.
     * This function performs a MongoDB aggregation query to count the total number of cases
     * in a particular city that fall within the specified start and end dates.
     *
     * @param {string} city - The city to filter the aggregation by.
     * @param {Date} startDate - The start date of the range for filtering the cases.
     * @param {Date} endDate - The end date of the range for filtering the cases.
     * @returns {Promise<AggregateResult[]>} A promise that resolves to the aggregation result,
     *                                       which includes the city and the total number of cases
     *                                       found within the specified range.
     */
    async aggregateData(
        city: string,
        startDate: Date,
        endDate: Date,
    ): Promise<AggregateResult[]> {
        return this.caseModel.aggregate([
            { $match: { city, createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$city', totalCases: { $sum: 1 } } },
        ]);
    }
}
