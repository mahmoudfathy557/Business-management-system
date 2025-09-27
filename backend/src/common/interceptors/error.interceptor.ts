import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                let status = HttpStatus.INTERNAL_SERVER_ERROR;
                let message = 'Internal server error';

                if (error instanceof HttpException) {
                    status = error.getStatus();
                    message = error.message;
                } else if (error.name === 'ValidationError') {
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Validation failed';
                } else if (error.name === 'CastError') {
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Invalid ID format';
                } else if (error.code === 11000) {
                    status = HttpStatus.CONFLICT;
                    message = 'Duplicate entry';
                }

                const response = context.switchToHttp().getResponse();
                response.status(status).json(
                    ApiResponseDto.error(message)
                );

                return throwError(() => error);
            }),
        );
    }
}
