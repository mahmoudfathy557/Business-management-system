import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | T> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | T> {
        const request = context.switchToHttp().getRequest();
        const url = request.url;

        // Don't wrap auth endpoints - they return direct responses
        if (url.includes('/auth/login') || url.includes('/auth/register')) {
            return next.handle();
        }

        // Don't wrap paginated responses - they have their own structure
        if (url.includes('/products') && request.method === 'GET' && (request.query.page || request.query.limit)) {
            return next.handle();
        }

        // Wrap all other responses
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
                message: 'Operation successful',
            })),
        );
    }
}
