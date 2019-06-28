export interface ApiResponse<T> {
    isError: boolean;
    reqData: any;
    respData: T;
    reason?: any;
}