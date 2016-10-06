/**
 * @description
 ** Use IDPT namespace for global variables and objects
 ** Extending IDPT (Namespace/Object) with coreUtils to provide utility methods.
 ** Usage: IDPT.coreUtils.getUrl("404"); returns "404.html";
 ** Usage: IDPT.coreUtils.getViewportSize(); returns current viewport;
 */

 var IDPT = IDPT || {};
 
(function($, window, document, IDPT, undefined) {
    IDPT.coreUtils = (function() {
        function _coreUtils() {
            var utilityMethods = {
                /**
                 * @method: getViewportSize
                 * @usage: IDPT.coreUtils.getViewportSize();
                 * @returns Array: an array with current viewport width and height values.
                 * @useCase: Use this method to find out current viewport size.
                 */
                getViewportSize: function() {
                    var size = [0, 0];
                    if (typeof window.innerWidth != 'undefined') {
                        size = [window.innerWidth, window.innerHeight];
                    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
                        size = [document.documentElement.clientWidth, document.documentElement.clientHeight];
                    } else {
                        size = [document.getElementsByTagName('body')[0].clientWidth, document.getElementsByTagName('body')[0].clientHeight];
                    }
                    return size;
                },
                /**
				 * @method: getViewPortName
				 * @usage: IDPT.coreUtils.getViewPortName(true/false, [
								{
									lowerLimit: 320,
									upperLimit: 699,
									viewPortName: "mobile"
								},
								{
									lowerLimit: 700,
									upperLimit: 1280,
									viewPortName: "tab"
								}
							]);
				 * @param forceTouch: Boolean: true/false to decide for tab/mobile viewport name, is passed as true then on desktop it will always give the value as "web"
				 * @param dimensionsArr: Array: an array of two objects to decide the viewport name, this method will use getViewPortSize method.
				 * @returns String: "web" or string mention in "viewPortName" property.
				 * @useCase: Use this method to find out the viewport name depending upon the window size. It can be used once on page load to add class on <body> tag for targetting different styles in mobile/tab/web. This can also be  used for other JS work depending upon viewport name, but for resize event initWindowResize method is suggested which internally uses this method.
				 */
                getViewPortName: function(forceTouch, dimensionsArr) {
                    if (typeof dimensionsArr !== "undefined") {
                        var dimensionsArr = dimensionsArr;
                    } else if (typeof IDPT.config !== "undefined" && typeof IDPT.config.viewPorts !== "undefined") {
                        var dimensionsArr = IDPT.config.viewPorts;
                    } else {
                        var dimensionsArr = [{
                            lowerLimit: 320,
                            upperLimit: 699,
                            viewPortName: "mobile"
                        }, {
                            lowerLimit: 700,
                            upperLimit: 1280,
                            viewPortName: "tab"
                        }];
                    }
                    var screenWidth,
                        coreUtils = IDPT.coreUtils,
                        viewPortName = "web",
                        forceTouch = ((typeof forceTouch).toLowerCase() === "boolean" && forceTouch === true) ? true : false,
                        isTouchDevice;
                    if (coreUtils.isEmptyObject(dimensionsArr) === false) {
                        screenWidth = coreUtils.getViewportSize()[0];
                        for (var i = 0, len = dimensionsArr.length; i < len; i++) {
                            if (dimensionsArr[i].hasOwnProperty("lowerLimit") === false || dimensionsArr[i].hasOwnProperty("upperLimit") === false) {
                                continue;
                            }

                            if (forceTouch === false) {
                                if (screenWidth >= dimensionsArr[i]["lowerLimit"] && screenWidth <= dimensionsArr[i]["upperLimit"]) {
                                    viewPortName = dimensionsArr[i]["viewPortName"];
                                    break;
                                }
                            } else {
                                isTouchDevice = coreUtils.isTouchDevice();
                                if (screenWidth >= dimensionsArr[i]["lowerLimit"] && screenWidth <= dimensionsArr[i]["upperLimit"] && isTouchDevice === true) {
                                    viewPortName = dimensionsArr[i]["viewPortName"];
                                    break;
                                }
                            }
                        }
                        return viewPortName;
                    }
                },
                /**
                 * @method: isEmptyObject
                 * @usage: sapeLibMod.coreUtils.isEmptyObject(Object Literal);
                 * @param Object: any object literal.
                 * @returns Boolean: true/false, If given Object is empty or not.
                 * @useCase: Use this method to check if the given object is empty or not.
                 */
                isEmptyObject: function(obj) {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            return false;
                        }
                    }
                    return true;
                },
                /**
                 * @method: isTouchDevice
                 * @usage: IDPT.coreUtils.isTouchDevice();
                 * @returns Boolean: true/false, If the OS is touch enabled or not.
                 * @useCase: Use this method to check if the devivce is a touch device or only the desktop.
                 */
                isTouchDevice: function() {
                    var tempElem = document.createElement('div');
                    tempElem.setAttribute('ongesturestart', 'return;');
                    if (typeof tempElem.ongesturestart === "function") {
                        return true;
                    } else {
                        return false
                    }
                },
                /**
                 * @method: getScrollPosition
                 * @usage: IDPT.coreUtils.getScrollPosition();
                 * @returns: Number: returns the current scroll position for body.
                 * @useCase: This method can be used to get current scroll position.
                 */
                getScrollPosition: function() {
                    var body = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
                    return document.all ? body.scrollTop : pageYOffset;
                },
                /**
                 * @method: checkBrowserForIE
                 * @usage: IDPT.coreUtils.checkBrowserForIE()
                 * @returns Number/String: Returns the IE Browser version number or string "non IE" if Browser is not IE.
                 * @useCase: Check if the current browser is IE or not.
                 */
                checkBrowserForIE: function() {
                    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
                        var ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
                        if (ieversion >= 9) return 9;
                        else if (ieversion >= 8) return 8;
                        else if (ieversion >= 7) return 7;
                        else if (ieversion >= 6) return 6;
                    } else {
                        return "non IE";
                    }
                },
                /**
                 * @method: isIOS
                 * @usage: IDPT.coreUtils.isIOS()
                 * @returns Boolean: true/false
                 * @useCase: Confirm if current operating system is IOS.
                 */
                isIOS: function() {
                    var ua = navigator.userAgent;
                    return /iPad/i.test(ua) || /iPhone/i.test(ua) || /iPod/i.test(ua);
                },
				/**
                 * @method: isAndroid
                 * @usage: IDPT.coreUtils.isAndroid()
                 * @returns Boolean: true/false
                 * @useCase: Confirm if current operating system is Android.
                 */
                isAndroid: /Android/i.test(navigator.userAgent),
                /**
                 * @method: isSafari
                 * @usage: IDPT.coreUtils.isSafari()
                 * @returns Boolean: true/false
                 * @useCase: Confirm if current operating system is Safari.
                 */
                isSafari: /Safari/i.test(navigator.userAgent),
				
				/**
                 * @method: facebookShare
                 * @usage: IDPT.coreUtils.facebookShare(Number AppId, String URL, String redirectURI, String image URL, String name, String Caption, String Description)
                 * @returns Nothing
                 * @useCase: Share content on Facebook using JS and facebook sharer.php functionality.
                 */
                facebookShare: function(appid, url, redirectURI, image, name, caption, desc) {
                    var fbAppid = (appid && appid.length > 0) ? appid : '',
                        fbUrl = encodeURIComponent((url && url.length > 0) ? url : ''),
                        fbRedirectURI = encodeURIComponent((redirectURI && redirectURI.length > 0) ? redirectURI : ''),
                        fbName = encodeURIComponent((name && name.length > 0) ? name : ''),
                        fbCaption = encodeURIComponent((caption && caption.length > 0) ? caption : ''),
                        fbDesc = encodeURIComponent((desc && desc.length > 0) ? desc : ''),
                        fbImage = encodeURIComponent((image && image.length > 0) ? image : ''),
                        facebookUrl = 'https://www.facebook.com/dialog/feed'+
                                '?app_id='+fbAppid+
                                '&display=popup&link='+fbUrl+
                                '&redirect_uri='+fbRedirectURI+
                                '&picture='+fbImage+
                                '&name='+fbName+
                                '&caption='+fbCaption+
                                '&description='+fbDesc;

                     IDPT.coreUtils.popup(facebookUrl, 'Share on Facebook', '575', '300');
                },

                /**
                 * @method: twitterShare
                 * @usage: IDPT.coreUtils.twitterShare(String URL, String text to tweet, String hashtag)
                 * @returns Nothing
                 * @useCase: Tweet text on twitter using Twitter JS API.
                 */
                twitterShare: function(url, text, hashtag) {
                    var fbUrl = encodeURIComponent((url && url.length > 0) ? url : ''),
                        fbText = encodeURIComponent((text && text.length > 0) ? text : ''),
                        fbHashtag = encodeURIComponent((hashtag && hashtag.length > 0) ? hashtag : ''),
                        twitterUrl = 'https://twitter.com/intent/tweet?hashtags=' + fbHashtag + '&text=' + fbText + '&tw_p=tweetbutton&url=' + fbUrl;
                     IDPT.coreUtils.popup(twitterUrl, 'Share a link on Twitter', '550', '450');
                },

                /**
                 * @method: popup
                 * @usage: IDPT.coreUtils.popup(String URL, String windowName, Number width, Number height)
                 * @returns Nothing
                 * @useCase: Open a URL in popup. This popup may be blocked by popup blocker in modern browsers.
                 */
                popup: function(url, windowName, width, height) {
                    leftPosition = (window.screen.width / 2) - ((width / 2) + 10),
                    topPosition = (window.screen.height / 2) - ((height / 2) + 50);
                    //Open the window.
                    window.open(url, windowName, "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
                }                
            };

            return utilityMethods;
        }
        return new _coreUtils();
    }());
}(jQuery, this, this.document, IDPT));
