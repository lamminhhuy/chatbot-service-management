"use strict";

import { Response } from "express";
import { z } from "zod";

type StatusCodeType = {
  OK: 200;
  CREATED: 201;
};

type ReasonStatusCodeType = {
  OK: "Success";
  CREATED: "Created!";
};

const StatusCode: StatusCodeType = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode: ReasonStatusCodeType = {
  OK: "Success",
  CREATED: "Created!",
};

interface SuccessResponseParams<T> {
  message?: string; 
  statusCode?: StatusCodeType[keyof StatusCodeType];
  reasonStatusCode?: ReasonStatusCodeType[keyof ReasonStatusCodeType];
  data?: T; 
}

class SuccessResponse<T = Record<string, unknown>> {
  message: string;
  status: number;
  data: T;

  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    data = {} as T,
  }: SuccessResponseParams<T>) {
    this.message = message || reasonStatusCode;
    this.status = statusCode;
    this.data = data;
  }

  send(res: Response): void {
    res.status(this.status).json({
      success: true, 
      message: this.message,
      status: this.status,
      data: this.data,
    });
  }
}
interface OKParams {
  message?: string;
  data?: Record<string, unknown>;
}

class OK extends SuccessResponse {
  constructor({ message, data }: OKParams) {
    super({ message, data });
  }
}

interface CREATEDParams<T> extends SuccessResponseParams<T> {
  options?: Record<string, unknown>;
}

class CREATED<T> extends SuccessResponse<T> {
  options: Record<string, unknown>;

  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    data,
  }: CREATEDParams<T>) {
    super({ message, statusCode, reasonStatusCode, data });
    this.options = options;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    data: dataSchema.optional(),
    status: z.number(),
  });

export { OK, CREATED, SuccessResponse };
