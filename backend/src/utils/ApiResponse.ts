class ApiResponse{
    status: number;
    data: any;
    message: string;
    constructor(statusCode:number,data:any,message:string){
        this.status = statusCode,
        this.data = data
        this.message = message
    }
}

export {ApiResponse}