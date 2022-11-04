export class ApiDate{

    static atMorning(date?:Date){
        date = date== null ? new Date() : new Date(date);
        return new Date(date?.getFullYear(), date.getMonth(), date.getDate(),0,0,0,0);
    }

    static isToday(date:Date){
       const now =  new Date();
       const today = new Date(now?.getFullYear(), now.getMonth(), now.getDate(),0,0,0,0);
       const tomorrow = new Date(now?.getFullYear(), now.getMonth(), now.getDate()+1,0,0,0,0);
        return now.getTime()>= today.getTime() && now.getTime()<tomorrow.getTime();
    }

    static nextDayATMorning(date?:Date){
        date = date== null ? new Date() : new Date(date);
        return new Date(date?.getFullYear(), date.getMonth(), date.getDate()+1,0,0,0,0);
    }
    static atEvening(date?:Date){
        date = date== null ? new Date() : new Date(date);
        return new Date(date?.getFullYear(), date.getMonth(), date.getDate(),23,59,59,10);
    }

    static atTime(seconds:number, date?:Date){
        
        date = date== null ? new Date() : new Date(date);
        return new Date(date?.getFullYear(), date.getMonth(), date.getDate(),0,
        0,seconds,0);
    }

    static formatSecond(seconds:number,){
        const hours:number = ~~(seconds / 3600);
        const rest:number = seconds%3600;
        const minutes:number = ~~(rest/60);
        const second:number = rest%60;
        return `${("0"+hours).substring(-2)}:${("0"+minutes).substring(-2)}:${("0"+second).substring(-2)}`

    }

}