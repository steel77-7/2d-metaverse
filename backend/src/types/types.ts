export interface DecodedToken {
  id: number, type?: string, iat?: number, exp?:number
  }


  export interface ApiResponseType{ 
    status:number,
    data:any,
    success:boolean
  }
  