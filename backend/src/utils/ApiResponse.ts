class ApiResponse{
    status: number;
    data: any;
    success: boolean;
    constructor(statusCode:number,data:any){
        this.status = statusCode,
        this.data = data
        this.success = statusCode<400
    }
}

export {ApiResponse}