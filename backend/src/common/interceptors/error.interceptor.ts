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
        let errorMessage = 'Internal server error';
        let detailedError: string | string[] | object | undefined = undefined;

        if (error instanceof HttpException) {
          status = error.getStatus();
          const responseError = error.getResponse();

          if (typeof responseError === 'string') {
            errorMessage = responseError;
          } else if (
            typeof responseError === 'object' &&
            responseError !== null
          ) {
            // Check if responseError has a 'message' property and it's a string or array of strings
            if (
              'message' in responseError &&
              (typeof (responseError as any).message === 'string' ||
                Array.isArray((responseError as any).message))
            ) {
              detailedError = (responseError as any).message;
              if (Array.isArray((responseError as any).message)) {
                errorMessage = (responseError as any).message.join(', ');
              } else {
                errorMessage = (responseError as any).message;
              }
            } else if (
              'error' in responseError &&
              typeof (responseError as any).error === 'string'
            ) {
              errorMessage = (responseError as any).error;
            } else {
              // Fallback if responseError is an object but doesn't have 'message' or 'error'
              errorMessage = error.message;
            }
          } else {
            // Fallback if responseError is not a string or object (e.g., undefined, null)
            errorMessage = error.message;
          }
        } else if (error.name === 'ValidationError') {
          status = HttpStatus.BAD_REQUEST;
          errorMessage = 'Validation failed';
          // For class-validator errors, the error object might contain details
          // This part might need more specific handling depending on the validation library
          // For now, a generic message.
        } else if (error.name === 'CastError') {
          status = HttpStatus.BAD_REQUEST;
          errorMessage = 'Invalid ID format';
        } else if (error.code === 11000) {
          status = HttpStatus.CONFLICT;
          errorMessage = 'Duplicate entry';
        }

        const response = context.switchToHttp().getResponse();
        response
          .status(status)
          .json(
            new ApiResponseDto(
              false,
              undefined,
              errorMessage,
              detailedError ? JSON.stringify(detailedError) : undefined,
            ),
          );

        return throwError(() => error);
      }),
    );
  }
}
