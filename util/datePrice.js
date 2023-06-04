exports.changeDateToDay=(date,inc)=>{
 
    var days = [ 
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    let day='';
  


    let saveDate=new Date(date).getDay();
 
      if (new Date(date).getTime() <= new Date().getTime()) {
        if (saveDate === new Date().getDay()) {
          if (inc === 0) {
            day = "today";
          } else {
            day = "tomorrow";
          }
        } else {
       
          if (inc === 0) {
            day = days[(new Date().getDay() ) % 7];
          } else {
            day = days[(new Date().getDay() + 1) % 7];
          }
        }
      } else {
        if (inc === 0) {
          day = days[saveDate];
        } else {
          day = days[(saveDate + 1) % 7];
        }
      }
return day;
}

exports.getTicketPrice=(date,movieType)=>{
  const today = new Date(date)
  if(today===3){
    if(movieType==='3D'){

      return 230;
    }
    else{
      return 200;
    }
  }
  else{
    if(today.getHours()<=9){
      if(movieType==='3D'){
        return 180;
      }
      else{
        return 150;
      }
    }
    else{
      if(move.type==='3D'){
        return 280;
      }
      else{
        return 250;
      }
    }
  }
}



