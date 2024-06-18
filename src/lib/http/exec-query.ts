export type ExecutionFn<T> = () => Promise<T>;

export type QueryOptions<T> = {
  queryFn: ExecutionFn<T>;
  onLoading?(isLoading: boolean): void;
  onResolve?(result: T): void;
  onReject?<E = unknown>(error: E): void;
};

export async function execQuery<T>(options: QueryOptions<T>) {
  options.onLoading?.(true);
  try {
    const result = await options.queryFn();
    options.onResolve?.(result);
    options.onLoading?.(false);
  } catch (err) {
    options.onReject?.(err);
    options.onLoading?.(false);
  }
}
