export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type DefaultApiPayload<TEntity> = {
  data: TEntity;
};

export interface ApiResponse<
  TEntity,
  TPayload = DefaultApiPayload<TEntity>
> {
  data: TEntity;
  payload: TPayload;
}