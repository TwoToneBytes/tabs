// Comment or uncomment this for production / dev
//console.log = function(){};
chrome.extension.getBackgroundPage();
var cachingData = new function () {
    // Constants:
    var LAST_CHECKED = "lastChecked",
        CACHED_instaBLE_DATA = "cachedinstabbleData",
        USERNAME = "user";

    var storageAPI = window.localStorage,
        self = this;

    self.getLastTimeChecked = function () {
        return storageAPI.getItem(LAST_CHECKED) ? new Date(storageAPI.getItem(LAST_CHECKED)) : null;
    };

    self.getCachedShots = function () {
        return storageAPI.getItem(CACHED_instaBLE_DATA) ? JSON.parse(storageAPI.getItem(CACHED_instaBLE_DATA)) : null;
    };

    self.getUsername = function () {
        return storageAPI.getItem(USERNAME);
    };

    self.setLastChecked = function (date) {
        console.log("Updating last checked", date);
        storageAPI.setItem(LAST_CHECKED, date);
    };

    self.setCachedShots = function (jsonData) {
        console.log("Updating cached shots", jsonData);
        storageAPI.setItem(CACHED_instaBLE_DATA, jsonData);
    };

    self.setUsername = function (username) {
        console.log("Updating username", username);
        storageAPI.setItem(USERNAME, username);
    };

    // clears all the local storage items:
    self.clearCache = function () {
        console.log("clearing cache");
        storageAPI.clear();
    };
};

var showing = 0,
    user = $('#lookup-player'),
    userName = cachingData.getUsername();

var insta = {
    clientId:'?client_id=ae3dcf48bd7543778a31707248781bdd',
    host:'https://api.instagram.com/v1/',
    popular:'media/popular',
    callback: '&callback=cbfunc',


    getPopular:function () {
        var url = insta.host + insta.popular + insta.clientId + insta.callback;
        //var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=cbfunc';
        showing = 0;
        console.log(url);
        this.req(url, function (data) {
            console.log(data);
            getShots.buildShots(data.data);
        });
    },

    req:function (url, cbfunc) {
        var lastTimeChecked = cachingData.getLastTimeChecked(),
            cachedData = cachingData.getCachedShots(),
            toCheckTime = new Date(),
            userName = cachingData.getUsername();

        // cache once every 5 minutes:
        toCheckTime.setMinutes(toCheckTime.getMinutes() - 5);

        // Only call api if the data hasn't been cached or input has changed:
        if (!lastTimeChecked || (lastTimeChecked < toCheckTime)) {
            cachingData.setUsername(user.val());
            $.ajax({
                url:url,
                dataType:'jsonp',
                jsonp:false,
                jsonpCallback:'cbfunc',
                timeout:1000,
                success:function (data) {
                    cachingData.setLastChecked(new Date());
                    cachingData.setCachedShots(JSON.stringify(data));

                    OnSuccess(data);
                },
                error:function (x, t, m) {

                    if (t === "timeout") {
                        insta.showError("We're sorry, we couldn't find that username.  We'll show you the popular shots in the meantime");
                        console.log('timeout error');
                    //    insta.getPopular();
                    } else {
                        $('#lookup-player').addClass('error');
                        console.log('else timeout error');
                    //    insta.getPopular();
                    }
                }
            });
        }
        else {
            // call on succes with cached data:
            console.log('cached data');
            OnSuccess(cachedData);
        }

        function OnSuccess(data) {
            var userName = cachingData.getUsername();
            console.log('showing ' + showing);
            cbfunc(data);
        }
    },

    showError:function (errorMessage) {
      // data is tainted so clear cache:                         
      cachingData.clearCache();
      
        $('#lookup-player').removeClass('playerList').addClass('error');
        $('.subInfo').html("<span style='color:#ce4d73'>" +
            errorMessage +
            "<span>");
    }
};


var getShots = {
    container:$('#picsList'),
    buildShots:function(shots) {
        var imgs = '';
        for (var i = 0; i < 6; i++) {
            console.log(shots[i]);
            /*imgs += '<li class="animate fadeInUp item" style="-webkit-animation-delay: ' + i * 150 + 'ms;">' +
                '    <div class="picture">' +
                '        <img class="shot" src="' + shots[i].images.thumbnail.url + '" style="display:none;"/>' +
                '        <div class="underlay">' +
                '            <a class="r round" href="' + shots[i].link + '"><img src="css/img/arrow.png" /></a>' +
                '            <a class="i round" href="' + shots[i].user.website + '"><img src="' + shots[i].user.profile_picture + '" /></a>' +

                '           <div class="shotStats">' +
                '              <span class="name"><a href="' + shots[i].user.website + '">' + shots[i].user.username + '</a></span>' +
                '              <span class="likes">' + shots[i].likes.count + ' Likes</span>' +
                '           </div>' +
                '        </div>' +
                '        <div class="slits">' +
                '           <div>' +
                '               <b></b>' +
                '               <em></em>' +
                '               <img src="' + shots[i].images.standard_resolution.url + '">' +
                '           </div>' +
                '           <div>' +
                '               <b></b>' +
                '               <em></em>' +
                '               <img src="' + shots[i].images.standard_resolution.url + '">' +
                '           </div>' +
                '        </div>' +
                '    </div>' +
                '</li>';*/
                imgs += '<div class="item">'+
                     '<div class="image">'+
                     '  <div class="placeholder" style="background-image:url(' + shots[i].images.standard_resolution.url + ');"></div>'+
                     '  <div class="underlay" style="background-image:url(' + shots[i].images.standard_resolution.url + ')"></div>'+
                     '  <div class="overlay" style="background-image:url(' + shots[i].images.standard_resolution.url + ');">'+
                     '     <span></span>'+
                     '     <div style="background-image:url(' + shots[i].images.standard_resolution.url + ');"><span></span>'+
                     '        <div style="background-image:url(' + shots[i].images.standard_resolution.url + ');"><span></span>'+
                     '           <div style="background-image:url(' + shots[i].images.standard_resolution.url + ');"><span></span>'+
                     '           </div>'+
                     '        </div>'+
                     '     </div>'+
                     '  </div>'+
                     '</div>'+
                  '</div>';
        }
        this.container.html(imgs);
    }
};

var ui = {
    init:function () {
        //chrome.extension.getBackgroundPage();
         insta.getPopular();
    }
};

$(function () {
    console.log('initialize');
    ui.init();

    $("a.settings").click(function () {
        $(".overlay").fadeIn(250);
        $(".content").removeClass('out').addClass('in').show();
    });

    $(".close").click(function () {
        $(".overlay").delay(250).fadeOut(250);
        $(".content").removeClass('in').addClass('out').css({
            // "display" : "none"
        });
    });

   $('ul.picsList li').hover(function(){
   		$(this).find('.highlight').children().addClass('reveal');
   } ,function(){
  		$(this).find('.highlight').children().removeClass('reveal');
	});

   $('.like').click(function(){
   	
   		$(this).append('<div class="heartAni"></div>');
   		$(this).find('.heartAni').animate({height:"50px", width:"50px", marginTop: "-15px",
marginLeft: "-13px"}, 100);
   		$(this).find('.heartAni').fadeTo(150, 0)
   });
});