export type ExecutionFn<T> = () => Promise<T>;

export type QueryOptions<T> = {
  queryFn: ExecutionFn<T>;
  onLoading?(isLoading: boolean): void;
  onResolve?(result: T): void;
  onReject?<E = unknown>(error: E): void;
};

export function execQuery<T>(options: QueryOptions<T>) {
  options.onLoading?.(true);
  options
    .queryFn()
    .then(function (result) {
      options.onResolve?.(result);
    })
    .catch(function (err) {
      options.onReject?.(err);
    })
    .finally(() => options.onLoading?.(false));
}
