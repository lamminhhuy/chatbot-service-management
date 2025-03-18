import { z } from "zod";
import { ReasonStatusCode } from "../types/reasonStatusCode";
import { StatusCode } from "../types/statusCode";

export class ErrorsResponse extends Error {
  statusCode: StatusCode;
  constructor(message: string, statusCode: StatusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictResponseError extends ErrorsResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenResponseError extends ErrorsResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class BadRequestResponseError extends ErrorsResponse {
  constructor(message: string, statusCode: number = StatusCode.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class AuthFailureResponseError extends ErrorsResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export class NotFoundResponseError extends ErrorsResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}
