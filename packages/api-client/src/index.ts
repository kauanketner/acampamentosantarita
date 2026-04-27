// TODO: cliente tipado gerado a partir do OpenAPI exposto pelo Swagger
// (services/api expõe /docs/json). Pode ser gerado com openapi-typescript +
// fetch wrapper, ou orval, ou hey-api/openapi-ts. Decidir quando o primeiro
// módulo da API estiver implementado.

export type ApiClientConfig = {
  baseUrl: string;
  getToken?: () => string | null | undefined;
};

export function createApiClient(_config: ApiClientConfig) {
  // TODO: instanciar cliente tipado
  return {} as Record<string, unknown>;
}
