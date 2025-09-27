import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({ description: 'Indicates if the request was successful' })
    success: boolean;

    @ApiProperty({ description: 'Response data' })
    data: T;

    @ApiProperty({ description: 'Response message', required: false })
    message?: string;

    @ApiProperty({ description: 'Error details', required: false })
    error?: string;

    constructor(success: boolean, data: T, message?: string, error?: string) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
    }

    static success<T>(data: T, message?: string): ApiResponseDto<T> {
        return new ApiResponseDto(true, data, message);
    }

    static error<T>(error: string, data?: T): ApiResponseDto<T> {
        return new ApiResponseDto(false, data as T, undefined, error);
    }
}

export class PaginatedResponseDto<T> {
    @ApiProperty({ description: 'Array of data items' })
    data: T[];

    @ApiProperty({ description: 'Total number of items' })
    total: number;

    @ApiProperty({ description: 'Current page number' })
    page: number;

    @ApiProperty({ description: 'Number of items per page' })
    limit: number;

    @ApiProperty({ description: 'Total number of pages' })
    totalPages: number;

    constructor(data: T[], total: number, page: number, limit: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
    }
}
