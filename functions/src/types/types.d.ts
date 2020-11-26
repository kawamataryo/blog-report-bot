interface ApiClientConstructor {
  new (property: string): ApiClient;
}

interface ApiClient {
  fetchIndex: () => Promise<Record<string, number>>;
}
