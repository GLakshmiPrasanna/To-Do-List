// module.exports=getDate;
// module.exports.curDate=getDate;
// module.exports.curDay=getDay;
// function getDate(){
exports.curDate=function(){    
        let date=new Date();
        let options={
        day:"numeric",
        month:"long",
        weekday:"long",
        year:"numeric"
    }
    return date.toLocaleDateString("en-US",options);
}

// function getDay(){
exports.curDay=function(){  
    const date=new Date();  
    // let date=new Date();
    
    // let options={
    const options={
        weekday:"long"
    }
    return date.toLocaleDateString("en-US",options);
}