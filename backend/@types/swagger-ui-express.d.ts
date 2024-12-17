declare module 'swagger-ui-express' {
    import express from 'express';
  
    export function serve(req: express.Request, res: express.Response, next: express.NextFunction): void;
    export function setup(swaggerDoc: any, options?: any): express.Handler;
  }