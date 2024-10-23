import { Controller, Get, Query } from '@nestjs/common';
import { CasesService } from './cases.service';

@Controller('cases')
export class CasesController {
    constructor(private readonly casesService: CasesService) {}

    @Get('/aggregate')
    async getAggregatedData(
        @Query('city') city: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format provided.');
        }

        return await this.casesService.aggregateData(city, start, end);
    }
}
