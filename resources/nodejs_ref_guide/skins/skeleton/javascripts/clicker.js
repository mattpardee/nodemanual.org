$(function() {
  $(".memberContent").collapse();

  var documentURL = location.href;
  var lastSlashPos = documentURL.lastIndexOf("/") + 1;
  var filenamePos = documentURL.lastIndexOf(".html");

  var objName = documentURL.substring(lastSlashPos, filenamePos);

  var menuUl = "menu_" + objName;

   var h = $(window).height();
   $("#sidebar").css('height', h - 80);
   $("#content").css('height', h - 100);

    $(window).resize(function(){
        var h = $(window).height();
        var w = $(window).width();
        $("#sidebar").css('height', h - 80);
        $("#content").css('height', h - 100);
    });

  $('.member-name').click(function()  {
    var id = this.id.substring(this.id.indexOf("_") + 1);

    $('#' + id).trigger('click');
  });

  $('h3.methodClicker').click(function() {
    var ellipsisSpan = "ellipsis_" + this.id;

    if ($('#' + ellipsisSpan).hasClass('hiddenSpan'))
      $('#' + ellipsisSpan).removeClass('hiddenSpan');
    else
      $('#' + ellipsisSpan).addClass('hiddenSpan');
  });

  // by default, opened page should have TOC opened
/*  if ($('#' + menuUl).hasClass('hidden'))
      $('#' + menuUl).removeClass('hidden');

  $('a.clicker').click(function() {
    var menuUl = "menu_" + this.id;

    if ($('#' + menuUl).hasClass('hidden'))
      $('#' + menuUl).removeClass('hidden');
    else
    {
      $('#' + menuUl).addClass('hidden');
      document.getElementById('#' + menuUl).style = ""; // fix: some jerk somewhere is adding style="display:block" to the ul
    }
  });*/
});

