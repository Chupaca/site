'use strict'

function Flash(message, type, time) {
    $("body").append(`<div id="flash" class="${type || ''} show">${message || ""}</div>`);
    setTimeout(function () { 
        $("#flash").animate({top:"-15vh", opacity:0 }, 500, ()=>{
            $("#flash").remove();
        }); 
    }, time || 2000);
    return;
}
