////////////////////////////////////////////
// Functions for filtering points by date //
////////////////////////////////////////////

filter = function (month, day){
  $("circle").each(function(){
    var thisDate = $(this).attr("date").substring(0, 10).split("-"),
        thisMonth = Number(thisDate[1]),
        thisDay = Number(thisDate[2]);

    if(thisMonth != month && thisDay != day){
      $(this).parent("g").hide();
    } else if($(this).parent("g").css("display") == "none"){
      $(this).parent("g").show();
    }
  });
}

$("#dateFilter").click(function(){
    filter($("#month").val(), $("#day").val());
});

clearFilter = function (){
  $("circle").parent("g").show();
}