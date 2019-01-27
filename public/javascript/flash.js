'use strict'

function Flash(message, type, time) {
    let count = "flash" + Math.floor(Math.random() * Math.floor(1000));
    $("body").append(`<div id="${count}" class="flash ${type || ''} show">${message || ""}</div>`);
    setTimeout(function (count) { 
        $("#" + count).animate({top:"-15vh", opacity:0 }, 500, ()=>{
            // $("#" + count).remove();
        }); 
    }, time || 2000, count);
    return;
}
