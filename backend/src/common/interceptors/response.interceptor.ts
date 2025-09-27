import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto, PaginatedResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T> | PaginatedResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T> | PaginatedResponseDto<T>> {
        return next.handle().pipe(
            map((data) => {
                // If data is already an ApiResponse, return it
                if (data && typeof data === 'object' && 'success' in data) {
                    return data;
                }

                // If data has pagination structure, return it as PaginatedResponseDto
                if (data && typeof data === 'object' && 'data' in data && 'total' in data && 'page' in data) {
                    return new PaginatedResponseDto(
                        data.data,
                        data.total,
                        data.page,
                        data.limit
                    );
                }

                // For simple data, wrap in success response
                return ApiResponseDto.success(data);
            }),
        );
    }
}