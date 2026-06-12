import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('./proto/product.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

const client = new grpcObj.ProductService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

export async function grpcFallback(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    client.getProduct({ id: req.params.id }, (err: any, res: any) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}