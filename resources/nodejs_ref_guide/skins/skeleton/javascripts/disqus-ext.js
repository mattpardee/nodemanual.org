var disqus_shortname = 'nodemanual';

var pathName = window.location.pathname;
var fileName = pathName.substring(window.location.pathname.lastIndexOf("/") + 1);
var versionPos = pathName.indexOf("/v");

var disqus_developer = pathName.indexOf("http") >= 0 ? 0 : 1;

var disqus_identifier = fileName;

    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();