/** HTTP 状态返回 */
declare interface IHttpResponseBase {
  code: number
  msg: string | object
  success: boolean
}

/** HTTP error 返回*/
declare type THttpErrorResponse = IHttpResponseBase & {
  path: string
  time: Date | string
}

/** HTTP success 返回 */
declare type THttpSuccessResponse<T> = IHttpResponseBase & {
  data: T
}
