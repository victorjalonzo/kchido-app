import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { TaskService } from "../application/task.service";
import { QueryRequestExtractor } from "src/Shared/util/queries-extractor";
import { FindTaskDto } from "../application/find-task.dto";
import { JwtAuthGuard } from "src/Auth/infrastructure/jwt-auth.guard";
import { UpdateTaskDto } from "../application/update-task.dto";

@Controller('api/v1/tasks')
export class TaskController {
    validFilters = ['status', 'raffleId']
    validIncludes = ['customer', 'subTasks']

    constructor(private readonly service: TaskService) {}

    @Put()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async update(@Body() updateOrderDto: UpdateTaskDto){
        return await this.service.update(updateOrderDto)
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findMany(@Query() query: FindTaskDto){
        const { filterQueries, includeQueries} = QueryRequestExtractor.extract(query, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })

        return await this.service.findMany(filterQueries, includeQueries)
    }

    @Get(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(@Param('id') id: string, @Query() query: FindTaskDto){
        const { includeQueries } = QueryRequestExtractor.extract(query, {
            validFilters: this.validFilters,
            validIncludes: this.validIncludes
        })
        return await this.service.find({ id }, includeQueries)
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.service.delete(id)
    }
}