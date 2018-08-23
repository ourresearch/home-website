angular.module('app', [

    // external libs
    'ngRoute',
    'ngMessages',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngMaterial',
    'ngProgress',
    'duScroll',

    // this is how it accesses the cached templates in ti.js
    'templates.app',

    // services
    'numFormat',

    // pages
    "landing"

]);




angular.module('app').config(function ($routeProvider,
                                       $mdThemingProvider,
                                       $locationProvider) {
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette("blue")



});


angular.module('app').run(function($route,
                                   $rootScope,
                                   $q,
                                   $timeout,
                                   $cookies,

                                   $http,
                                   $location) {


    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-23384030-6', 'auto');
    $rootScope.ga = ga

    console.log("running homepage!")



    $rootScope.$on('$routeChangeStart', function(next, current){
    })
    $rootScope.$on('$routeChangeSuccess', function(next, current){
        //window.scrollTo(0, 0)
        ga('send', 'pageview', { page: $location.url() });

    })



    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        console.log("$routeChangeError! here's some things to look at: ", event, current, previous, rejection)

        $location.url("page-not-found")
        window.scrollTo(0, 0)
    });
});



angular.module('app').controller('AppCtrl', function(
    ngProgressFactory,
    $rootScope,
    $scope,
    $route,
    $location,
    NumFormat,
    $http,
    $mdDialog,
    $sce){

    var progressBarInstance = ngProgressFactory.createInstance();

    $rootScope.progressbar = progressBarInstance
    $scope.progressbar = progressBarInstance
    $scope.numFormat = NumFormat
    $scope.moment = moment // this will break unless moment.js loads over network...

    $scope.global = {}

    $scope.pageTitle = function(){
        //if (!$scope.global.title){
        //    $scope.global.title = "Discover the online impact of your research"
        //}
        //return "Impactstory: " + $scope.global.title
        return "Unpaywall"
    }


    $rootScope.$on('$routeChangeSuccess', function(next, current){
        $scope.global.template = current.loadedTemplateUrl
            .replace("/", "-")
            .replace(".tpl.html", "")
        $scope.global.title = null
    })

    $scope.trustHtml = function(str){
        return $sce.trustAsHtml(str)
    }

    var showAlert = function(msgText, titleText, okText){
        if (!okText){
            okText = "ok"
        }
          $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(titleText)
                    .textContent(msgText)
                    .ok(okText)
            );
    }
    $rootScope.showAlert = showAlert

    var originatorEv
    $scope.openMenu = function($mdOpenMenu, ev){
        console.log("open menu!")
        originatorEv = ev
        $mdOpenMenu(ev);
    }
    $scope.menuClick = function(){
        console.log("this is really involved.")
    }


})
















angular.module('landing', [
    'ngRoute',
    'ngMessages'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })


    .config(function ($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: "about.tpl.html",
            controller: "GenaricPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/press', {
            templateUrl: "press.tpl.html",
            controller: "GenaricPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/team', {
            templateUrl: "team.tpl.html",
            controller: "GenaricPageCtrl"
        })
    })






    .config(function ($routeProvider) {
        $routeProvider.when('/page-not-found', {
            templateUrl: "page-not-found.tpl.html",
            controller: "PageNotFoundCtrl"
        })
    })

    .controller("PageNotFoundCtrl", function($scope){
        console.log("PageNotFound controller is running!")

    })
    .controller("GenaricPageCtrl", function($scope, $anchorScroll){
        console.log("GenaricPageCtrl controller is running!")


    })


    .controller("LandingPageCtrl", function ($scope) {

    })














angular.module("numFormat", [])

    .factory("NumFormat", function($location){

        var commas = function(x) { // from stackoverflow
            if (!x) {
                return x
            }
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }


        var short = function(num, fixedAt){
            if (typeof num === "string"){
                return num  // not really a number
            }

            // from http://stackoverflow.com/a/14994860/226013
            if (num === null){
                return 0
            }
            if (num === 0){
                return 0
            }

            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 100000) { // no decimal if greater than 100thou
                return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'k';
            }

            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }


            if (num < 1) {
                return Math.round(num * 100) / 100;  // to two decimals
            }

            return Math.ceil(num);
        }

        var round = function(num){
            return Math.round(num)
        }

        var doubleUrlEncode = function(str){
            return encodeURIComponent( encodeURIComponent(str) )
        }

        // from http://cwestblog.com/2012/09/28/javascript-number-getordinalfor/
        var ordinal = function(n) {
            n = Math.round(n)
            var s=["th","st","nd","rd"],
                v=n%100;
            return n+(s[(v-20)%10]||s[v]||s[0]);
        }

        var decimalToPerc = function(decimal, asOrdinal){
            var ret = Math.round(decimal * 100)
            if (asOrdinal){
                ret = ordinal(ret)
            }
            return ret
        }
        return {
            short: short,
            commas: commas,
            round: round,
            ordinal: ordinal,
            doubleUrlEncode: doubleUrlEncode,
            decimalToPerc: decimalToPerc

        }
    });
angular.module('templates.app', ['about.tpl.html', 'faq.tpl.html', 'footer.tpl.html', 'header.tpl.html', 'landing.tpl.html', 'page-not-found.tpl.html', 'press.tpl.html', 'team.tpl.html']);

angular.module("about.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("about.tpl.html",
    "<div class=\"page about\">\n" +
    "    <div class=\"content\">\n" +
    "        <h1>About</h1>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"footer-container\" ng-include=\"'footer.tpl.html'\"></div>\n" +
    "");
}]);

angular.module("faq.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("faq.tpl.html",
    "<div class=\"ti-page-header\" ng-include=\"'header.tpl.html'\"></div>\n" +
    "\n" +
    "<div class=\"page faq\">\n" +
    "    <div class=\"faq screen\" id=\"faq\">\n" +
    "        <div class=\"content\">\n" +
    "            <h1>Frequently asked questions</h1>\n" +
    "            <dl>\n" +
    "\n" +
    "                <dt id=\"who-is-behind-this\"><i class=\"fa fa-chevron-right\"></i>Who's behind Unpaywall?</dt>\n" +
    "                <dd>\n" +
    "                    We're <a href=\"http://impactstory.org/about\">Impactstory,</a>\n" +
    "                    a nonprofit working to make science more open and reusable online.\n" +
    "                    We're supported by grants from <span class=\"funders\">\n" +
    "                    the National Science Foundation and the Alfred P. Sloan Foundation\n" +
    "            </span>\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt id=\"why-did-you-make-it\"><i class=\"fa fa-chevron-right\"></i>Why did you make it?</dt>\n" +
    "                <dd>\n" +
    "                    Now more than ever, humanity needs to <i>access</i> our collective knowledge,\n" +
    "                    not hoard it behind paywalls. Lots of researchers feel the same; that's why they\n" +
    "                    upload their papers to free, legal servers online. We want to help bring that\n" +
    "                    <a href=\"https://en.wikipedia.org/wiki/Open_access\">open access</a> content\n" +
    "                    to the masses.\n" +
    "\n" +
    "                </dd>\n" +
    "\n" +
    "\n" +
    "                <dt id=\"how-often-finds-fulltext\"><i class=\"fa fa-chevron-right\"></i>How often does Unpaywall find full text?</dt>\n" +
    "                <dd>\n" +
    "                    We find fulltext for 50-85% of articles, depending on their topic and year of publication.\n" +
    "                    We think that's a game-changer for\n" +
    "                    the publishing industry. Now that most articles are free, why subscribe?\n" +
    "\n" +
    "                    Over the longer term, we'll keep\n" +
    "                    getting even better as\n" +
    "                    mandatory open access requirements begin to take effect in the\n" +
    "                    <a href=\"http://scholcomm.columbia.edu/open-access/public-access-mandates-for-federally-funded-research/\">US,</a>\n" +
    "                    <a href=\"http://www.rcuk.ac.uk/research/openaccess/\">UK,</a>\n" +
    "                    <a href=\"http://www.sciencemag.org/news/2016/05/dramatic-statement-european-leaders-call-immediate-open-access-all-scientific-papers/\">Europe,</a>\n" +
    "                    and elsewhere.\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt id=\"how-do-you-find-articles\"><i class=\"fa fa-chevron-right\"></i>How do you find all these fulltext articles?</dt>\n" +
    "                <dd>\n" +
    "                    We gather content from thousands of open-access repositories worldwide.\n" +
    "                    To help us, we rely on a number of data sources, including\n" +
    "                    <a href=\"https://www.ncbi.nlm.nih.gov/pmc/\">PubMed Central</a>,\n" +
    "                    <a href=\"https://doaj.org/\">the DOAJ,</a>\n" +
    "                    <a href=\"https://www.crossref.org/\">Crossref</a> (particulary their license info),\n" +
    "                    <a href=\"https://www.datacite.org/\">DataCite,</a>\n" +
    "                    <a href=\"http://scholar.google.com\">Google Scholar,</a>\n" +
    "                    and <a href=\"https://www.base-search.net/\">BASE.</a>\n" +
    "\n" +
    "                    After we put all this data together, we in turn make it open for reuse via the\n" +
    "                    <a href=\"http://oadoi.org/about\">oaDOI</a> API: a free, fast, and very scalable\n" +
    "                    way to leverage our data and infrastructure to support your own projects.\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt id=\"different-from-sci-hub\"><i class=\"fa fa-chevron-right\"></i>How's this different from Sci-Hub?</dt>\n" +
    "                <dd>\n" +
    "                    Like Unpaywall, Sci-Hub finds fulltext PDFs for paywalled articles. The main difference\n" +
    "                    is where those PDFs come from: Unpaywall finds PDFs legally uploaded\n" +
    "                    by the authors themselves, while\n" +
    "                    Sci-Hub uses PDFs that are obtained by other means, including automated web scraping\n" +
    "                    of publisher sites. Sci-Hub's method delivers more comprehensive results,\n" +
    "                    but is not super legal. So while\n" +
    "                    <a href=\"http://blog.impactstory.org/comparing-sci-hub-oadoi/\">we're not against Sci-Hub,</a>\n" +
    "                    we think Unpaywall offers a more sustainable approach by working within copyright law\n" +
    "                    and supporting the growing open access movement.\n" +
    "                </dd>\n" +
    "\n" +
    "                <dt id=\"different-from-oa-button\"><i class=\"fa fa-chevron-right\"></i>How's this different from the Open Access Button?</dt>\n" +
    "                <dd>\n" +
    "                    The <a href=\"https://openaccessbutton.org/\">OA Button</a> and Unpaywall are similar. But the\n" +
    "                    OA Button is a more mature project\n" +
    "                    (it's been working since 2013), and has a different user interface as well as\n" +
    "                    extra features including author emailing and\n" +
    "                    finding open datasets.\n" +
    "                    Unpaywall is more focused on seamlessly finding free content. The great thing is, both are open-source\n" +
    "                    and free, so you can install both, or\n" +
    "                    <a href=\"https://guides.github.com/activities/forking/\">fork 'em</a>\n" +
    "                    and make your own better extension!\n" +
    "                </dd>\n" +
    "\n" +
    "\n" +
    "                <dt id=\"privacy-policy\"><i class=\"fa fa-chevron-right\"></i>What's your privacy policy?</dt>\n" +
    "                <dd>\n" +
    "                    The extension doesn't store or ask for any personal information from you, so when you use Unpaywall\n" +
    "                    we don't know who you are. The extension doesn't track your browsing history, and it\n" +
    "                    doesn't send any content from any page you visit to our servers, with one exception:\n" +
    "                    when a page has a DOI (a short identifier used by scholarly articles), we send that DOI\n" +
    "                    to our server (using an encrypted HTTPS connection) to find any free versions.\n" +
    "                    We will log requests to our servers\n" +
    "                    (which include the DOI and the IP address the request came from) in order to\n" +
    "                    monitor and improve service. But those logs aren't\n" +
    "                    connected to your identity. Furthermore, the extension won't send or use\n" +
    "                    any kind of browser fingerprinting technology to identify your computer.\n" +
    "                </dd>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                <dt id=\"identify-green-or-gold\"><i class=\"fa fa-chevron-right\"></i>Can Unpaywall tell me whether an article is \"Green\" or \"Gold\" OA?</dt>\n" +
    "                <dd>Indeed we can. Click the green Unpaywall extension icon in\n" +
    "                    your browser toolbar and choose \"Settings.\" Once there, tick \"Color-code tab for Green and Gold OA.\"\n" +
    "                    Thenceforth, you'll enjoy a veritable rainbow of OA colorfully goodness as you browse different articles:\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            <div class=\"text\">\n" +
    "                                <span class=\"color gold\">Gold tab</span> for <a\n" +
    "                                    href=\"https://en.wikipedia.org/wiki/Open_access#Journals:_gold_open_access\">Gold OA,</a>\n" +
    "                                articles available from the publisher\n" +
    "                                under an open license.\n" +
    "                                <a class=\"eg\" href=\"http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0000308\">(example)</a>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <div class=\"text\">\n" +
    "                                <span class=\"color green\">Green tab</span> for <a\n" +
    "                                    href=\"https://en.wikipedia.org/wiki/Self-archiving\">Green OA</a> articles on a preprint server or\n" +
    "                                institutional repository.\n" +
    "                                <a class=\"eg\" href=\"http://jamanetwork.com/journals/jamainternalmedicine/article-abstract/2528290\">(example)</a>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <div class=\"text\">\n" +
    "                                <span class=\"color blue\">Blue tab</span> for articles available on the current page, but lacking\n" +
    "                                license information (often that's because you're browsing from behind the paywall).\n" +
    "                                <a class=\"eg\" href=\"http://www.pnas.org/content/105/31/11014\">(example)</a>\n" +
    "\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </dd>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                <dt id=\"report-bugs\"><i class=\"fa fa-chevron-right\"></i>I found a bug</dt>\n" +
    "                <dd>\n" +
    "                    Sorry about that! Unfortunately this is pretty common, especially where publishers\n" +
    "                    don't follow standard practices for article display (as they often do not).\n" +
    "                    For instance, we don't work for articles missing\n" +
    "                    <a href=\"http://www.apastyle.org/learn/faqs/what-is-doi.aspx\">DOIs.</a>\n" +
    "\n" +
    "                    The good news is that it's still early days for this project and\n" +
    "                    it's under very active development. When you find an error,\n" +
    "                    <a href=\"mailto:team@impactstory.org\">drop us an email</a> and we'll get it fixed for you.\n" +
    "                </dd>\n" +
    "\n" +
    "            </dl>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"footer-container\" ng-include=\"'footer.tpl.html'\"></div>");
}]);

angular.module("footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("footer.tpl.html",
    "<div class=\"footer\">\n" +
    "    <div class=\"content\" layout=\"row\" layout-xs=\"column\">\n" +
    "\n" +
    "        <div class=\"links\" flex=\"40\" flex-xs=\"100\">\n" +
    "            <a href=\"mailto:team@impactstory.org\">\n" +
    "                <i class=\"fa fa-envelope-o\"></i>\n" +
    "                Email\n" +
    "            </a>\n" +
    "            <a href=\"http://twitter.com/unpaywall\">\n" +
    "                <i class=\"fa fa-twitter\"></i>\n" +
    "                Twitter\n" +
    "            </a>\n" +
    "            <a href=\"https://github.com/Impactstory/unpaywall\">\n" +
    "                <i class=\"fa fa-github\"></i>\n" +
    "                GitHub\n" +
    "            </a>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"logo\" flex=\"20\" hide-xs>\n" +
    "            <!--\n" +
    "            <a href=\"/\" ng-click=\"scrollToTop()\">\n" +
    "                <img src=\"static/img/icon-white.png\" alt=\"\">\n" +
    "            </a>\n" +
    "            -->\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"credit\" flex=\"40\" flex-xs=\"100\">\n" +
    "            <span class=\"built-by\">\n" +
    "                Built with <i class=\"fa fa-heart\"></i> at\n" +
    "                <a href=\"faq#who-is-behind-this\">Impactstory</a>, with support from\n" +
    "            </span>\n" +
    "            <span class=\"funders\">\n" +
    "                 the National Science Foundation and the Alfred P. Sloan Foundation\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<div class=\"ti-page-header\">\n" +
    "    <div class=\"navbar\">\n" +
    "        <a href=\"/\">\n" +
    "            <img id=\"logo\" src=\"static/img/impactstory-logo-sideways.png\" alt=\"\">\n" +
    "        </a>\n" +
    "        <div class=\"spacer\"></div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"links\" hide show-gt-xs>\n" +
    "            <a href=\"/\" class=\"install\">Home</a>\n" +
    "            <!--\n" +
    "            <a href=\"/about\">About</a>\n" +
    "            <a href=\"/press\">Press</a>\n" +
    "            -->\n" +
    "            <a href=\"/team\">Team</a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"mobile-menu\" hide-gt-xs>\n" +
    "\n" +
    "            <md-menu md-position-mode=\"target-right target\" >\n" +
    "                <md-button class=\"md-icon-button\" ng-click=\"openMenu($mdOpenMenu, $event)\">\n" +
    "                    <i class=\"fa fa-bars\"></i>\n" +
    "                </md-button>\n" +
    "              <md-menu-content>\n" +
    "                  <md-menu-item>\n" +
    "                      <a href=\"/\" ng-click=\"menuClick()\">Home</a>\n" +
    "                  </md-menu-item>\n" +
    "\n" +
    "                  <md-menu-item>\n" +
    "                      <a href=\"/about\" ng-click=\"menuClick()\">About</a>\n" +
    "                  </md-menu-item>\n" +
    "\n" +
    "                  <md-menu-item>\n" +
    "                      <a href=\"/press\" ng-click=\"menuClick()\">Press</a>\n" +
    "                  </md-menu-item>\n" +
    "\n" +
    "                  <md-menu-item>\n" +
    "                      <a href=\"/team\" ng-click=\"menuClick()\">Team</a>\n" +
    "                  </md-menu-item>\n" +
    "\n" +
    "\n" +
    "              </md-menu-content>\n" +
    "            </md-menu>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("landing.tpl.html",
    "<div class=\"page landing\">\n" +
    "    <div class=\"top-screen screen\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"main-copy\">\n" +
    "            <div class=\"tagline\">\n" +
    "                <div class=\"above\">\n" +
    "                    We make tools to power the Open Science revolution.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"about\">\n" +
    "                Impactstory is a nonprofit dedicated to making scholarly research more\n" +
    "                open, accessible, and reusable. We create and support free services including\n" +
    "                <a href=\"https://unpaywall.org\">Unpaywall,</a>\n" +
    "                <a href=\"https://profiles.impactstory.org\">Impactstory Profiles,</a> and\n" +
    "                <a href=\"http://depsy.org\">Depsy.</a>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"links\">\n" +
    "                <a href=\"mailto:team@impactstory.org\">\n" +
    "                    <i class=\"fa fa-envelope-o\"></i>\n" +
    "                    Email\n" +
    "                </a>\n" +
    "                <a href=\"http://twitter.com/impactstory\">\n" +
    "                    <i class=\"fa fa-twitter\"></i>\n" +
    "                    Twitter\n" +
    "                </a>\n" +
    "                <a href=\"https://github.com/Impactstory\">\n" +
    "                    <i class=\"fa fa-github\"></i>\n" +
    "                    GitHub\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <!-- use this special landing-page-only footer -->\n" +
    "        <div class=\"more\">\n" +
    "            <div class=\"links\">\n" +
    "                <a href=\"mailto:team@impactstory.org\">\n" +
    "                    <i class=\"fa fa-envelope-o\"></i>\n" +
    "                    Email\n" +
    "                </a>\n" +
    "                <a href=\"http://twitter.com/impactstory\">\n" +
    "                    <i class=\"fa fa-twitter\"></i>\n" +
    "                    Twitter\n" +
    "                </a>\n" +
    "                <a href=\"https://github.com/Impactstory\">\n" +
    "                    <i class=\"fa fa-github\"></i>\n" +
    "                    GitHub\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <!--\n" +
    "            <div class=\"spacer\"></div>\n" +
    "            <div class=\"by\">\n" +
    "                Made with <i class=\"fa fa-heart\"></i> by\n" +
    "                <a href=\"/faq#who-is-behind-this\">Impactstory.</a>\n" +
    "            </div>\n" +
    "            -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("page-not-found.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("page-not-found.tpl.html",
    "<div class=\"landing static-page\">\n" +
    "    <h1>Sorry, we couldn't find that page!</h1>\n" +
    "\n" +
    "</div>");
}]);

angular.module("press.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("press.tpl.html",
    "<div class=\"page press\">\n" +
    "    <div class=\"content\">\n" +
    "        <h1>Press</h1>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"footer-container\" ng-include=\"'footer.tpl.html'\"></div>\n" +
    "");
}]);

angular.module("team.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team.tpl.html",
    "<div class=\"page team\">\n" +
    "    <div class=\"content\">\n" +
    "        <h1>Team</h1>\n" +
    "\n" +
    "        <div class=\"row first\">\n" +
    "\n" +
    "            <div class=\"text\">\n" +
    "                <p>\n" +
    "                    Impactstory is <strong>Heather Piwowar</strong> (<a href=\"https://docs.google.com/document/d/1S7aKmG_l3wJxAc4lb5gJYMwNVDnAT7HlQWcaXADwA1s/edit?usp=sharing\">bio, </a>\n" +
    "                    <a href=\"https://scholar.google.com/citations?user=1YLq0XMAAAAJ&hl=en\">publications, </a>\n" +
    "                    <a href=\"https://twitter.com/researchremix\">Twitter</a>) and\n" +
    "\n" +
    "                    <strong>Jason Priem</strong> (<a href=\"https://docs.google.com/document/d/1SkUuOYrpfUF-LC7aC1sBa_phG-_qN-f3hkL9fMooTm4/edit?usp=sharing\">bio, </a>\n" +
    "                    <a href=\"https://scholar.google.com/citations?user=w32jC0YAAAAJ&hl=en\">publications, </a>\n" +
    "                    <a href=\"https://twitter.com/jasonpriem\">Twitter</a>).\n" +
    "\n" +
    "                </p>\n" +
    "\n" +
    "                <p>You can learn more about how we started working together in this recent Nature article, <a href=\"https://www.nature.com/articles/d41586-018-05968-3\">\"How Unpaywall is transforming open science.\"</a>\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    If you'd like to get in touch, we'd love to hear from you. Drop us a line at <a href=\"mailto:team@impactstory.org\">team@impactstory.org</a>\n" +
    "                </p>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "                        <div class=\"img\">\n" +
    "                <img class=\"team\" src=\"static/img/team.jpg\" alt=\"\">\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <h2 id=\"board\">Board of directors</h2>\n" +
    "\n" +
    "        <div class=\"person\">\n" +
    "            <!--\n" +
    "            <img src=\"http://i.imgur.com/G4wUQb8.png\" height=100/>\n" +
    "            -->\n" +
    "            <img src=\"https://pbs.twimg.com/profile_images/726192222274736128/00yNti0E_400x400.jpg\" alt=\"\">\n" +
    "\n" +
    "            <div class=\"text\">\n" +
    "                <p><strong>Heather Joseph</strong> is the Executive Director of the <a href=\"http://www.sparc.arl.org/\">Scholarly Publishing and Academic Resources Coalition (SPARC)</a> and the convener of the\n" +
    "                    <a href=\"http://www.taxpayeraccess.org/\">Alliance for Taxpayer Access</a>. Prior to coming to SPARC, she spent 15 years as a publisher in both commercial and not-for-profit publishing organizations. She served as the publishing director at the American Society for Cell Biology, which became the first journal to commit its full content to the NIH’s pioneering open repository, PubMed Central.</p>\n" +
    "\n" +
    "                <p>Heather serves on the Board of Directors of numerous not-for-profit organizations, including the\n" +
    "                    <a href=\"http://www.plos.org\">Public Library of Science</a>.  She is a frequent speaker and writer on scholarly communications in general, and on open access in particular.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"person\">\n" +
    "            <!--\n" +
    "            <img src=\"http://i.imgur.com/dVJPqlw.png\" height=100/>\n" +
    "            -->\n" +
    "            <img src=\"https://pbs.twimg.com/profile_images/875364025005096961/8_fgpYGC_400x400.jpg\" alt=\"\">\n" +
    "\n" +
    "            <div class=\"text\">\n" +
    "                <p><strong>Ethan White</strong> is an Associate Professor and Moore Investigator in the Department of Wildlife Ecology and Conservation and the Informatics Institute at the University of Florida.\n" +
    "\n" +
    "\n" +
    "                    He studies ecological systems using data-intensive approaches and is actively involved in open approaches to science. He has written papers on <a href=\"http://dx.doi.org/10.4033/iee.2013.6b.6.f\">data management and sharing</a>, <a href=\"http://dx.doi.org/10.1371/journal.pbio.1001745\">best practices in computational science</a>, and <a href=\"http://dx.doi.org/10.1371/journal.pbio.1001563\">the benefits of preprints in biology</a>.</p>\n" +
    "                <p>Ethan has a PhD in Biology from the University of New Mexico, was a National Science Foundation Postdoctoral Fellow in biological informatics, and is the recipient of a National Science Foundation CAREER 'Young Investigators' Award. He speaks frequently about data-intensive approaches to ecology, co-writes a <a href=\"http://jabberwocky.weecology.org\">blog on ecology, academia, and open science</a>, develops material and serves as an instructor for <a href=”http://software-carpentry.org/”>Software Carpentry</a>, and is active on Twitter(<a href=\"https://twitter.com/ethanwhite/\">@ethanwhite</a>).</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"footer-container\" ng-include=\"'footer.tpl.html'\"></div>\n" +
    "");
}]);
