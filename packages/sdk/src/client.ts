export type OesClientOptions = {
  baseUrl: string;
};

export function createOesClient(options: OesClientOptions) {
  return {
    baseUrl: options.baseUrl,
  };
}

