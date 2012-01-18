$(function() {
  $(".sideToggler").collapse();

  var documentURL = location.href;
  var lastSlashPos = documentURL.lastIndexOf("/") + 1;
  var filenamePos = documentURL.lastIndexOf(".html");

  var objName = documentURL.substring(lastSlashPos, filenamePos);

  var menuUl = "menu_" + objName;

  // resize the sidebar/content based on window height;
  // this enables us to have "inner" scroll bars
   /*var h = $(window).height();
   $("#sidebar").css('height', h - 80);
   $("#content").css('height', h - 100);

    $(window).resize(function(){
        var h = $(window).height();
        var w = $(window).width();
        $("#sidebar").css('height', h - 80);
        $("#content").css('height', h - 100);
    }); */

  // clicking on the member title should launch open the 
  // description
  $('.member-name').click(function()  {
    var id = this.id.substring(this.id.indexOf("_") + 1);

    $("h3[id='" + id + "']").trigger('click');
  });

  /*$('.memberLink').click(function()  {
    var id = this.id.substring(this.id.indexOf("_") + 1);

    $("h3[data-id='" + id + "']").trigger('click');
  }); */

  // when hovering over arrow, add highlight (only if inactive)
  $("h3.methodToggle").hover(function () {
      if (!$("h3.methodToggle").hasClass('active'))
        $(this).addClass("methodToggleHover");
    },
    function () {
      $(this).removeClass("methodToggleHover");
    }
  );

  // after expanding the hidden description, hide the ellipsis
  $('h3.methodClicker').click(function() {
    var ellipsisSpan = "ellipsis_" + this.id;
    var shortSpan = "short_" + this.id;

    if ($("div[id='" + ellipsisSpan + "']").hasClass('hiddenSpan'))
    {
      $("div[id='" + ellipsisSpan + "']").removeClass('hiddenSpan');
      $("div[id='" + shortSpan + "']").addClass('hiddenSpan');
      $("div[id='" + shortSpan + "']").addClass('hiddenSpan');
      $(this).closest('.article').removeClass('methodToggleOpen');
    }
    else
    {
      $("div[id='" + shortSpan + "']").removeClass('hiddenSpan');
      $("div[id='" + ellipsisSpan + "']").addClass('hiddenSpan');
      $(this).closest('.article').addClass('methodToggleOpen');
    }
  }); 
});

