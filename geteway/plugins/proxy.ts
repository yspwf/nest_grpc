import type { FastifyPluginAsync } from 'fastify';
import { grpcFallback } from '../grpc/grpcClient.js';
import type { IncomingHttpHeaders } from 'http';

// export const proxyPlugin: FastifyPluginAsync = async (app) => {
//   app.all('/products/*', async (req, reply) => {
//     if (!req.upstream) return reply.code(502).send({ error: 'no upstream' });

//     try {
//       await reply.from(req.upstream, {
//         rewriteRequestHeaders: (headers) => {
//           headers['x-tenant-id'] = req.tenantId!;
//           return headers;
//         },
//       });
//     } catch (err) {
//       // REST fallback → gRPC
//       try {
//         const data = await grpcFallback(req);
//         return reply.send(data);
//       } catch (grpcErr) {
//         return reply.code(502).send({ error: 'upstream failed' });
//       }
//     }
//   });
// };


export const proxyPlugin: FastifyPluginAsync = async (app) => {
  app.all('/products/*', async (req, reply) => {
    if (!req.upstream) return reply.code(502).send({ error: 'no upstream' });

    try {
      await reply.from(req.upstream, {
        rewriteRequestHeaders: (_request, headers: IncomingHttpHeaders) => {
          const newHeaders: IncomingHttpHeaders = { ...headers };
          if (req.tenantId) newHeaders['x-tenant-id'] = req.tenantId;
          if (req.user && typeof req.user === 'object' && 'id' in req.user) {
            newHeaders['x-user-id'] = String(req.user.id);
          }
          return newHeaders;
        },
      });
    } catch {
      // REST fail -> gRPC fallback
      try {
        const data = await grpcFallback(req);
        return reply.send(data);
      } catch {
        return reply.code(502).send({ error: 'upstream failed' });
      }
    }
  });
};
