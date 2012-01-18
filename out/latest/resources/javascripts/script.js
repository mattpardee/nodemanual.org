$(function () {
    'use strict';

    var $empty = $(), // empty set used upon activtion
    $window = $(window),
    $items = $('div.menu-item > a'),
    $results = $('#search-results'), // search results
    targets = [], // items and corresponding article offset
    $active = null, // active article
    baseTitle = document.title, // base (general) part of title
    pathName = window.location.pathname,
    fileName = pathName.substring(window.location.pathname.lastIndexOf("/") + 1);
  
    if(window.addEventListener)
        window.addEventListener('load', loadCallback, true);
    else
        window.attachEvent('load', loadCallback, true);

    if (pathName.indexOf("nodejs_ref_guide") >= 0)
        $('li#node_js_ref').addClass("active");
    else if (pathName.indexOf("nodejs_dev_guide") >= 0)
        $('li#nodejs_dev_guide').addClass("active");
    else if (pathName.indexOf("js_doc") >= 0)
        $('li#js_doc').addClass("active");
            
    function loadCallback(evt){
        var form = document.getElementById("searchbox");
        var input = form.query;
        form.onsubmit = function (evt) {
            var query = input.value;
            if (query) {
                input.value = "";
                input.blur();
                var url = "https://www.google.com/search?q=" + encodeURIComponent("site:nodemanual.org " + query);
                window.open(url);
            }
            return false;
        };
    }

    var fileNameRE = new RegExp(fileName, "i");

    $('a.menuLink').each(function(index) {
        if ($(this).attr("href").toLowerCase().match(fileNameRE))
        {
            $(this).addClass("currentItem");
            return false;
        }
    });


    function getTitle($article) {
        var title = [baseTitle];

        if ($article.data('title')) {
            title.push($article.data('title'));
        }

        return title.join(' | ');
    }

    function eachParent($item, callback) {
        var $parent = $item.data('ndoc.parent');
        if ($parent && $parent.length) {
            eachParent($parent, callback);
            callback($parent);
        }
    }

    // activates item (used upon scrolling)
    function activate($article, expandParents) {
        var $item;

        if ($active) {
            $item = $active.data('ndoc.item') || $empty;
            $item.removeClass('current');
            eachParent($item, function ($parent) {
                $parent.removeClass('current-parent');
            });
        }

        // set new active article
        $active = $article;

        // update title
        document.title = getTitle($article);

        $item = $active.data('ndoc.item') || $empty;
        $item.addClass('current');
        eachParent($item, function ($parent) {
            $parent.addClass('current-parent');
            if (expandParents) {
                $parent.data('ndoc.childs')
                .data('ndoc.collapsed', false)
                .animate({
                    height: 'show',
                    opacity: 'show'
                });
            }
        });
    }


    function processScroll(evt, expandParents) {
        var scrollTop = $window.scrollTop() + 10,
        i = targets.length;
    
        while (i--) {
            if ($active !== targets[i].article && scrollTop >= targets[i].offset
                && (!targets[i + 1] || scrollTop <= targets[i + 1].offset)) {
                activate(targets[i].article, expandParents)
                return;
            }
        }
    }

    // init articles
    $('article.article').each(function () {
        var $article = $(this);

        targets.push({
            article: $article,
            offset: $article.offset().top
        });
    });

    // init menu items
    $items.each(function () {
        var $item = $(this),
        $childs = $item.parent().next(),
        $parent = $item.parents('ul').eq(0).prev().children(),
        $article = $('[id="' + $item.attr('href').slice(1) + '"]');

        // cross-refs
        $item.data('ndoc.parent', $parent);
        $item.data('ndoc.childs', $childs);
        $article.data('ndoc.item', $item);

        // bind activator
        $item.on('click', function () {
            if ($item.hasClass('current') && !$childs.data('ndoc.collapsed')) {
                $childs.data('ndoc.collapsed', true).animate({
                    height: 'hide',
                    opacity: 'hide'
                });
                return false;
            }

            activate($article);

            $item.data('ndoc.childs').data('ndoc.collapsed', false).animate({
                height: 'show',
                opacity: 'show'
            });
        });

        // collapse all 2nd levels
        if (0 != $parent.length) {
            $childs.data('ndoc.collapsed', true).hide();
        }
    });

    function updateSearchResults() {
        $results.empty();

        if ('' == this.value) {
            $results.hide();
            return;
        }

        $results.show();

        $items.filter('[data-id*="' + this.value + '"]').each(function () {
            var $item = $(this);
            $('<div class="menu-item">').append(
                $item.clone(false)
                .text($item.data('id'))
                .on('click', function () {
                    $item.trigger('click');
                })
                ).appendTo($results);
        });
    }

    // init search
    $('#search')
    // prevent from form submit
    .on('submit', function () {
        return false;
    })
    .find('input')
    .on('keyup', $.throttle(250, updateSearchResults))
    // click - cuz i don't know what event fied on input clear in Chrome
    .on('change click', updateSearchResults);

    // init scrollspy
    $window.on('scroll', $.throttle(250, processScroll));

    // initial jump (required for FF only - Chrome don't need it)
    processScroll(null, true);

    // init prettyprint
    $('pre > code').addClass('prettyprint');
    prettyPrint();
  
    //set the height of the sidebar
    var sidebarHeight = $('#sidebar').height(),
        contentHeight = $('.container .content .span11').height();

    if(contentHeight > sidebarHeight)
        $('#sidebar').height(contentHeight);
    else
        $('#sidebar').height(sidebarHeight + 10);
    
//    function isScrolledIntoView(elem) {
//        var docViewTop = $(window).scrollTop();
//        var docViewBottom = docViewTop + $(window).height();
//
//        var elemTop = $(elem).offset().top;
//        var elemBottom = elemTop + $(elem).height() -60;
//
//        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
//    }
//    
//    $('#sidebar').height($(window).height() - $('#overview').outerHeight() - 25 + ($('html').scrollTop() <= 85 ? $('html').scrollTop() : 85 ))
    var bgHeightSet = false,
        $sidebar       = $('#sidebar'),
        $pagination    = $('.members'),
        $paginationBackground = $('.membersBackground'),
        $paginationContent = $('.membersContent'),
        $tabs = $('.tabs');
        
    function handleScroll() {
        var header_offset  = $('#overview').outerHeight(),
            s;
        
        // scrolling offset calculation via www.quirksmode.org
        if (window.pageYOffset) {
            s = window.pageYOffset;
        }
        else if (document.documentElement && document.documentElement.scrollTop) {
            s = document.documentElement.scrollTop;
        }
        else if (document.body) {
            s = document.body.scrollTop;
        }
        if (s > header_offset - 28) {
//            $sidebar.css({
//                'position': 'fixed',
//                'top': 41,
//                'padding':0
//            });
            var pgLeft = $paginationContent.offset().left;
            $paginationContent.css('left', pgLeft);
            $pagination.css({
                'position': 'fixed',
                'z-index': 2,
                'top': 40
//                'background-color': 'white'
//                'opacity': 0.8
            }).addClass('srolled')
            .next().css({'padding-top': $pagination.height()});
            $tabs.addClass('tabsSansBorder');
            if(!bgHeightSet) {
                bgHeightSet = true;
//                $paginationBackground.css('display', 'block')//.stop().animate({'height': 44, 'opacity':1}, 'normal', 'linear');
            }
        }
        else {
//            $sidebar.css({
//                'position': 'relative',
//                'top': 0,
//                'padding-top':25
//            });
            $paginationContent.css('left', 0);
            $pagination.css({
                'position': 'relative',
                'top': 0
//                'background-color': 'transparent'
//                'opacity': 1
            }).removeClass('srolled')
            .next().css({'padding-top': 0});
            $tabs.removeClass('tabsSansBorder');
            bgHeightSet = false;
//            $paginationBackground.stop().css({'display': 'none'});
        }        
    }
    
    $(window)
    .scroll(function(){//auto kanei to header na metakinhtai kai na einai panta visible;
        handleScroll();
    });
    handleScroll();
});
