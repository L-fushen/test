function _get(v) {
    return document.getElementById(v);
}
function _url() {
    return encodeURIComponent(window.location.pathname + window.location.search);
}
function _backurl(o, x) {
    var url = _url();
    if (x) {
        url += x;
    }
    ;
    var tar = encodeURI(o.href);
    if (tar.indexOf('?') == -1) {
        tar += '?url=' + url;
    } else {
        tar += '&url=' + url;
    }
    o.href = tar;
}
function _gettimekey(){
    var date = new Date(),
        ye = date.getFullYear(),
        mo = date.getMonth() + 1,
        da = date.getDate(),
        ho = date.getHours(),
        mi = date.getMinutes(),
        se = date.getSeconds(),
        ms = date.getMilliseconds();
    var no = Math.round(Math.random() * 10000);
    var len = no.toString().length;
    while(len < 4){ no = '0' + no; len = no.length; }
    return ''+ ye + mo + da + ho + mi + se + ms + no;
}
baidu.dom.extend({
    FormValidtor: function () {
        var me = this, noerr = true;
        this.ReInit = function () {
            init();
        };
        this.Check = function () {
            noerr = true;
            me.find('[vformat]').each(function () {
                checkRule(baidu(this));
            });
            if (me.find('.error').length > 0) {
                me.find('.error').eq(0).focus();
                noerr = false;
            }
            return noerr;
        };
        this.valid = function (o) {
            noerr = true;
            checkRule(baidu(o));
            return noerr;
        };
        var removeCls = function (o) {
            if (o.hasClass('success')) {
                o.removeClass('success');
            }
            if (o.hasClass('error')) {
                o.removeClass('error');
            }
        };
        var checkRule = function (o) {
            var format = o.attr('vformat') || '';
            if (format == '') {
                return;
            }
            baidu(format.split('/')).each(function (i, v) {
                if (v == '') {
                    return true;
                }
                if (eval('f_' + v).call(this, o)) {
                    o.removeClass('error').addClass('success');
                } else {
                    noerr = false;
                    o.removeClass('success').addClass('error');
                    return false;
                }
            });
        };
        var init = function () {
            me.find('[vformat]').each(function () {
                var o = baidu(this);
                o.unbind('focus').unbind('blur').focus(function () {
                    removeCls(o);
                }).blur(function () {
                    checkRule(o)
                });
            });
        };
        var f_required = function (o) {
            var v = o.val().trim();
            return (v != '');
        };
        var f_letter = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            if (/^[a-zA-Z]+$/.test(v) == false) {
                return false;
            }
            return true;
        };
        var f_number = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            if (/^[0-9]+$/.test(v) == false) {
                return false;
            }
            return true;
        };
        var f_float = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            if (/^[0-9]+(\.\d+)?$/.test(v) == false) {
                return false;
            }
            return true;
        };
        var f_textkey = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            if (/^([a-zA-Z0-9_\-]|%)*$/.test(v) == false) {
                return false;
            }
            return true;
        };
        var f_email = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            if (/^[\w\.-]+(\+[\w-]*)?@([\w-]+\.)+[\w-]+$/.test(v) == false) {
                return false;
            }
            return true;
        };
        var f_mobile = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            if (/^1[3458]\d{9}$/.test(v) == false) {
                return false;
            }
            return true;
        };
        var f_len = function (o) {
            var v = o.val().trim();
            if (v.length == 0) {
                return true;
            }
            var arg = o.attr('vlen') || '';
            if (arg == '') {
                return false;
            }
            var a = arg.split(','), b = v.length;
            if (a.length == 1) {
                if (b != parseInt(arg)) {
                    return false;
                }
            } else {
                var a1 = parseInt(a[0]) || 0, a2 = parseInt(a[1]) || 0;
                if (a1 > 0 && b < a1) {
                    return false;
                }
                if (a2 > 0 && b > a2) {
                    return false;
                }
            }
            return true;
        };
        init();
        return me;
    }
});

baidu.dom.extend({
    SubmitForm: function (opts) {
        var me = this;
        var arg = baidu.extend({
            btnPostTxt: ' 保存中...', beforeSend: function () {
                var btn = me.find('button[type=submit]');
                btn.data('preTxt', btn.html());
                btn.attr('disabled', 'disabled').html(arg.btnPostTxt);
            }, complete: function (arg, html) {
                alert(html);
            }
        }, opts);
        var action = me.attr('action') || '';
        var submit = function (uri, val, callback) {
            baidu.ajax({
                url: uri,
                cache: false,
                type: 'POST',
                data: val,
                async: true,
                success: function (res, status) {
                    var btn = me.find('button[type=submit]');
                    btn.removeAttr('disabled').html(btn.data('preTxt'));
                    callback.call(this, val, res);
                }
            });
        };

        var datas = {};
        baidu(me[0].elements).each(function () {
            var name = this.name || '';
            if (name == '') {
                return true;
            }
            var type = this.type;
            if (type == 'radio' || type == 'checkbox') {
                if (!this.checked) {
                    return true;
                }
            }
            var value = this.value;
            if (type == 'checkbox') {
                if (datas[name] == undefined) {
                    datas[name] = value;
                } else {
                    datas[name] += ',' + value;
                }
            } else {
                datas[name] = value;
            }
        });
        if (arg.beforeSend != null) {
            arg.beforeSend.call(this, datas);
            setTimeout(function () {
                submit(action, datas, arg.complete);
            }, 20);
        } else {
            submit(action, datas, arg.complete);
        }
        return me;
    }
});

baidu.dom.extend({
    dropdown: function (opts) {
        var me = this;
        var arg = baidu.extend({width: 0, height: 'auto', callbefore: null, callback: null}, opts);
        var toid = me.data('to'), toname = me.attr('id'), type = me.data('type'), src = me.data('src'), txt = me.data('txt') || '';
        var get_json = function (url) {
            var json = [];
            if (/[\.\/]/.test(url)) {
                var rel = baidu.ajax(url, {cache: false, async: false}).responseText;
                if (rel.substr(0, 1) == '[') {
                    json = baidu.json.parse(rel);
                }
            } else {
                json = eval(src);
            }
            return json;
        };
        var sel_opt = function (o) {
            var src = baidu(o).data('src');
            document.getElementById(toid).value = src.id;
            document.getElementById(toname).value = src.text;
            if (arg.callback != null) {
                arg.callback.call(this, me, src);
            }
            baidu('#dropdown').remove();
        };
        var dropbox = function () {
            var width = arg.width, height = arg.height;
            var dd = baidu('#dropdown');
            if (dd.length == 0) { dd = baidu('<div id="dropdown" class="input" />').appendTo('body');}
            if (width == 0) { width = me.width() + 16;}
            dd.empty().css({width: width, height: height, top: me.outerHeight()});
            dd.click(function (e) { e.stopPropagation();});
            dd.insertAfter(me).show();
            if (arg.callbefore != null) { arg.callbefore.call(this, me, {id: toid, name: toname});}
            setTimeout(function () {
                baidu(document).one('click', function () {
                    dd.remove();
                });
            }, 50);
            switch (type) {
                case 'table':
                    src = get_json(src);
                    alert(T.json.stringify(src));
                    break;
                case 'json':
                    src = get_json(src);
                    for (var i = 0, j = src.length; i < j; i++) {
                        var text = src[i].text;
                        if (src[i].path) {
                            text = src[i].path + ' ' + text;
                        }
                        var a = baidu('<a class="opt"/>').html(text).data('src', src[i]);
                        a.click(function () {
                            sel_opt(this);
                        });
                        dd.append(a);
                    }
                    break;
                case 'color':
                    dd.css('width', 180);
                    src = ['#000000', '#993300', '#333300', '#003300', '#003366', '#000080', '#333399', '#333333', '#800000', '#FF6600', '#808000', '#008000', '#008080', '#0000FF', '#666699', '#808080', '#FF0000', '#FF9900', '#99CC00', '#339966', '#33CCCC', '#3366FF', '#800080', '#969696', '#FF00FF', '#FFCC00', '#FFFF00', '#00FF00', '#00FFFF', '#00CCFF'];
                    for (var i = 0, j = src.length; i < j; i++) {
                        var val = src[i];
                        var a = baidu('<a class="blc" style="background-color:' + val + '"/>').data('src', {
                            id: val,
                            text: ''
                        });
                        a.click(function () {
                            sel_opt(this);
                            document.getElementById(toname).style.backgroundColor = baidu(this).data('src').id;
                        });
                        dd.append(a);
                    }
                    break;
                case 'icon':
                    dd.css('width', 380).css('height', 210);
                    src = ["fa-angellist","fa-area-chart","fa-at","fa-bell-slash","fa-bell-slash-o","fa-bicycle","fa-binoculars","fa-birthday-cake","fa-bus","fa-calculator","fa-cc","fa-cc-amex","fa-cc-discover","fa-cc-mastercard","fa-cc-paypal","fa-cc-stripe","fa-cc-visa","fa-copyright","fa-eyedropper","fa-futbol-o","fa-google-wallet","fa-ils","fa-ioxhost","fa-lastfm","fa-lastfm-square","fa-line-chart","fa-meanpath","fa-newspaper-o","fa-paint-brush","fa-paypal","fa-pie-chart","fa-plug","fa-slideshare","fa-toggle-off","fa-toggle-on","fa-trash","fa-tty","fa-twitch","fa-wifi","fa-yelp","fa-adjust","fa-anchor","fa-archive","fa-area-chart","fa-arrows","fa-arrows-h","fa-arrows-v","fa-asterisk","fa-at","fa-ban","fa-bar-chart","fa-barcode","fa-bars","fa-beer","fa-bell","fa-bell-o","fa-bell-slash","fa-bell-slash-o","fa-bicycle","fa-binoculars","fa-birthday-cake","fa-bolt","fa-bomb","fa-book","fa-bookmark","fa-bookmark-o","fa-briefcase","fa-bug","fa-building","fa-building-o","fa-bullhorn","fa-bullseye","fa-bus","fa-calculator","fa-calendar","fa-calendar-o","fa-camera","fa-camera-retro","fa-car","fa-caret-square-o-down","fa-caret-square-o-left","fa-caret-square-o-right","fa-caret-square-o-up","fa-cc","fa-certificate","fa-check","fa-check-circle","fa-check-circle-o","fa-check-square","fa-check-square-o","fa-child","fa-circle","fa-circle-o","fa-circle-o-notch","fa-circle-thin","fa-clock-o","fa-cloud","fa-cloud-download","fa-cloud-upload","fa-code","fa-code-fork","fa-coffee","fa-cog","fa-cogs","fa-comment","fa-comment-o","fa-comments","fa-comments-o","fa-compass","fa-copyright","fa-credit-card","fa-crop","fa-crosshairs","fa-cube","fa-cubes","fa-cutlery","fa-database","fa-desktop","fa-dot-circle-o","fa-download","fa-ellipsis-h","fa-ellipsis-v","fa-envelope","fa-envelope-o","fa-envelope-square","fa-eraser","fa-exchange","fa-exclamation","fa-exclamation-circle","fa-exclamation-triangle","fa-external-link","fa-external-link-square","fa-eye","fa-eye-slash","fa-eyedropper","fa-fax","fa-female","fa-fighter-jet","fa-file-archive-o","fa-file-audio-o","fa-file-code-o","fa-file-excel-o","fa-file-image-o","fa-file-pdf-o","fa-file-powerpoint-o","fa-file-video-o","fa-file-word-o","fa-film","fa-filter","fa-fire","fa-fire-extinguisher","fa-flag","fa-flag-checkered","fa-flag-o","fa-flask","fa-folder","fa-folder-o","fa-folder-open","fa-folder-open-o","fa-frown-o","fa-futbol-o","fa-gamepad","fa-gavel","fa-gift","fa-glass","fa-globe","fa-graduation-cap","fa-hdd-o","fa-headphones","fa-heart","fa-heart-o","fa-history","fa-home","fa-inbox","fa-info","fa-info-circle","fa-key","fa-keyboard-o","fa-language","fa-laptop","fa-leaf","fa-lemon-o","fa-level-down","fa-level-up","fa-life-ring","fa-lightbulb-o","fa-line-chart","fa-location-arrow","fa-lock","fa-magic","fa-magnet","fa-male","fa-map-marker","fa-meh-o","fa-microphone","fa-microphone-slash","fa-minus","fa-minus-circle","fa-minus-square","fa-minus-square-o","fa-mobile","fa-money","fa-moon-o","fa-music","fa-newspaper-o","fa-paint-brush","fa-paper-plane","fa-paper-plane-o","fa-paw","fa-pencil","fa-pencil-square","fa-pencil-square-o","fa-phone","fa-phone-square","fa-picture-o","fa-pie-chart","fa-plane","fa-plug","fa-plus","fa-plus-circle","fa-plus-square","fa-plus-square-o","fa-power-off","fa-print","fa-puzzle-piece","fa-qrcode","fa-question","fa-question-circle","fa-quote-left","fa-quote-right","fa-random","fa-recycle","fa-refresh","fa-reply","fa-reply-all","fa-retweet","fa-road","fa-rocket","fa-rss","fa-rss-square","fa-search","fa-search-minus","fa-search-plus","fa-share","fa-share-alt","fa-share-alt-square","fa-share-square","fa-share-square-o","fa-shield","fa-shopping-cart","fa-sign-in","fa-sign-out","fa-signal","fa-sitemap","fa-sliders","fa-smile-o","fa-sort","fa-sort-alpha-asc","fa-sort-alpha-desc","fa-sort-amount-asc","fa-sort-amount-desc","fa-sort-asc","fa-sort-desc","fa-sort-numeric-asc","fa-sort-numeric-desc","fa-space-shuttle","fa-spinner","fa-spoon","fa-square","fa-square-o","fa-star","fa-star-half","fa-star-half-o","fa-star-o","fa-suitcase","fa-sun-o","fa-tablet","fa-tachometer","fa-tag","fa-tags","fa-tasks","fa-taxi","fa-terminal","fa-thumb-tack","fa-thumbs-down","fa-thumbs-o-down","fa-thumbs-o-up","fa-thumbs-up","fa-ticket","fa-times","fa-times-circle","fa-times-circle-o","fa-tint","fa-toggle-off","fa-toggle-on","fa-trash","fa-trash-o","fa-tree","fa-trophy","fa-truck","fa-tty","fa-umbrella","fa-university","fa-unlock","fa-unlock-alt","fa-upload","fa-user","fa-users","fa-video-camera","fa-volume-down","fa-volume-off","fa-volume-up","fa-wheelchair","fa-wifi","fa-wrench","fa-file","fa-file-archive-o","fa-file-audio-o","fa-file-code-o","fa-file-excel-o","fa-file-image-o","fa-file-o","fa-file-pdf-o","fa-file-powerpoint-o","fa-file-text","fa-file-text-o","fa-file-video-o","fa-file-word-o","fa-circle-o-notch","fa-cog","fa-refresh","fa-spinner","fa-check-square","fa-check-square-o","fa-circle","fa-circle-o","fa-dot-circle-o","fa-minus-square","fa-minus-square-o","fa-plus-square","fa-plus-square-o","fa-square","fa-square-o","fa-cc-amex","fa-cc-discover","fa-cc-mastercard","fa-cc-paypal","fa-cc-stripe","fa-cc-visa","fa-credit-card","fa-google-wallet","fa-paypal","fa-area-chart","fa-bar-chart","fa-line-chart","fa-pie-chart","fa-btc","fa-eur","fa-gbp","fa-ils","fa-inr","fa-jpy","fa-krw","fa-money","fa-rub","fa-try","fa-usd","fa-align-center","fa-align-justify","fa-align-left","fa-align-right","fa-bold","fa-chain-broken","fa-clipboard","fa-columns","fa-eraser","fa-file","fa-file-o","fa-file-text","fa-file-text-o","fa-files-o","fa-floppy-o","fa-font","fa-header","fa-indent","fa-italic","fa-link","fa-list","fa-list-alt","fa-list-ol","fa-list-ul","fa-outdent","fa-paperclip","fa-paragraph","fa-repeat","fa-scissors","fa-strikethrough","fa-subscript","fa-superscript","fa-table","fa-text-height","fa-text-width","fa-th","fa-th-large","fa-th-list","fa-underline","fa-undo","fa-angle-double-down","fa-angle-double-left","fa-angle-double-right","fa-angle-double-up","fa-angle-down","fa-angle-left","fa-angle-right","fa-angle-up","fa-arrow-circle-down","fa-arrow-circle-left","fa-arrow-circle-o-down","fa-arrow-circle-o-left","fa-arrow-circle-o-right","fa-arrow-circle-o-up","fa-arrow-circle-right","fa-arrow-circle-up","fa-arrow-down","fa-arrow-left","fa-arrow-right","fa-arrow-up","fa-arrows","fa-arrows-alt","fa-arrows-h","fa-arrows-v","fa-caret-down","fa-caret-left","fa-caret-right","fa-caret-square-o-down","fa-caret-square-o-left","fa-caret-square-o-right","fa-caret-square-o-up","fa-caret-up","fa-chevron-circle-down","fa-chevron-circle-left","fa-chevron-circle-right","fa-chevron-circle-up","fa-chevron-down","fa-chevron-left","fa-chevron-right","fa-chevron-up","fa-hand-o-down","fa-hand-o-left","fa-hand-o-right","fa-hand-o-up","fa-long-arrow-down","fa-long-arrow-left","fa-long-arrow-right","fa-long-arrow-up","fa-arrows-alt","fa-backward","fa-compress","fa-eject","fa-expand","fa-fast-backward","fa-fast-forward","fa-forward","fa-pause","fa-play","fa-play-circle","fa-play-circle-o","fa-step-backward","fa-step-forward","fa-stop","fa-youtube-play","fa-adn","fa-android","fa-angellist","fa-apple","fa-behance","fa-behance-square","fa-bitbucket","fa-bitbucket-square","fa-btc","fa-cc-amex","fa-cc-discover","fa-cc-mastercard","fa-cc-paypal","fa-cc-stripe","fa-cc-visa","fa-codepen","fa-css3","fa-delicious","fa-deviantart","fa-digg","fa-dribbble","fa-dropbox","fa-drupal","fa-empire","fa-facebook","fa-facebook-square","fa-flickr","fa-foursquare","fa-git","fa-git-square","fa-github","fa-github-alt","fa-github-square","fa-gittip","fa-google","fa-google-plus","fa-google-plus-square","fa-google-wallet","fa-hacker-news","fa-html5","fa-instagram","fa-ioxhost","fa-joomla","fa-jsfiddle","fa-lastfm","fa-lastfm-square","fa-linkedin","fa-linkedin-square","fa-linux","fa-maxcdn","fa-meanpath","fa-openid","fa-pagelines","fa-paypal","fa-pied-piper","fa-pied-piper-alt","fa-pinterest","fa-pinterest-square","fa-qq","fa-rebel","fa-reddit","fa-reddit-square","fa-renren","fa-share-alt","fa-share-alt-square","fa-skype","fa-slack","fa-slideshare","fa-soundcloud","fa-spotify","fa-stack-exchange","fa-stack-overflow","fa-steam/a>","fa-steam-square","fa-stumbleupon","fa-stumbleupon-circle","fa-tencent-weibo","fa-trello","fa-tumblr","fa-tumblr-square","fa-twitch","fa-twitter","fa-twitter-square","fa-vimeo-square","fa-vine","fa-vk","fa-weibo","fa-weixin","fa-windows","fa-wordpress","fa-xing","fa-xing-square","fa-yahoo","fa-yelp","fa-youtube","fa-youtube-play","fa-youtube-square","fa-ambulance","fa-h-square","fa-hospital-o","fa-medkit","fa-plus-square","fa-stethoscope","fa-user-md","fa-wheelchair"];
                    for (var i = 0, j = src.length; i < j; i++) {
                        var val = src[i];
                        var txt = '<i class="fa '+ val +'"></i>';
                        var a = baidu('<a class="blc">'+ txt +'</a>').data('src', {
                            id: val,
                            text: txt
                        });
                        a.click(function () {
                            sel_opt(this);
                            document.getElementById(toname).innerHTML = baidu(this).data('src').text;
                        });
                        dd.append(a);
                    }
                    break;
                default:
                    break;
            }
        };
        me.click(function (e) {
            dropbox();
            e.stopPropagation();
        });
        switch (type) {
            case 'json':
                src = get_json(src);
                var _toid = document.getElementById(toid).value;
                var _toname = document.getElementById(toname);
                for (var i = 0, j = src.length; i < j; i++) {
                    if (src[i].id == _toid) {
                        _toname.value = src[i].text;
                    }
                }
                break;
            default:
                break;
        }
        return me;
    }
});

baidu.dom.extend({
    groupCheckBox: function () {
        var chk = this.find('input:checkbox');
        chk.click(function () {
            var c = this.checked;
            if (c == true) {
                chk.removeAttr('checked');
            }
            this.checked = true;
        });
    }
});

baidu.dom.extend({
    CheckboxAll: function (btn) {
        var me = this;
        var all = me.find('input.chkall');
        var ones = me.find('input.chkone');
        var btn = baidu(btn);
        var stxt = btn.html(), atxt = btn.data('tog');
        this.getCheckeds = function () {
            return me.find('input.chkone:checked').map(function () {
                return this.value;
            }).get().join(',');
        };
        ones.click(function () {
            if (me.find('input.chkone:checked').length == ones.length) {
                all[0].checked = true;
                btn.html(atxt);
            } else {
                all[0].checked = false;
                btn.html(stxt);
            }
        });
        all.click(function () {
            if (this.checked) {
                ones.attr('checked', 'checked');
                btn.html(atxt);
            } else {
                ones.removeAttr('checked');
                btn.html(stxt);
            }
        });
        btn.click(function () {
            if (btn.text() == atxt) {
                ones.removeAttr('checked');
                all[0].checked = false;
                btn.html(stxt);
            } else {
                ones.attr('checked', 'checked');
                all[0].checked = true;
                btn.html(atxt);
            }
        });
        return me;
    }
});

baidu.dom.extend({
    AjaxTab: function () {
        var me = this;
        var div = me.next();
        var txt = div.html();
        this.load = function (tar, idx) {
            tar = baidu(tar);
            tar.html(txt).find('div.showtxt').removeClass('showtxt');
            var src = me.find('li.focus').data('src');
            if (src.indexOf('?') == -1) {
                src += '?idx=' + idx;
            } else {
                src += '&idx=' + idx;
            }
            baidu.get(src, function (res) {
                var tmp = baidu('<div></div>').html(res);
                var trs = tmp.find('tr:gt(0)');
                if (trs.length > 0) {
                    tar.closest('tr').after(trs).remove();
                } else {
                    tar.html(tmp.text());
                }
            })
        };
        me.find('li').click(function () {
            var li = baidu(this);
            var src = li.data('src');
            div.html(txt);
            me.find('li').not(li).removeClass('focus');
            li.addClass('focus');
            baidu.get(src, function (res) {
                div.html(res);
            })
        }).eq(0).trigger('click');
        return me;
    }
});

baidu.dom.extend({
    TableAutoRow: function (opts) {
        var me = this;
        var arg = baidu.extend({key: null, evt: null, callback: null}, opts);
        var addlistener = function (tr) {
            tr.find('i.fa-close').css('cursor', 'pointer').click(function () {
                baidu(this).closest('tr').remove();
                fillrow();
            });
            tr.find('input').blur(function () {
                chkkey();
                fillrow();
            });
            if(arg.evt){ arg.evt.call(this, tr); }
        };
        var copyrow = function () {
            var ht = me.find('tr:eq(1)').html();
            ht = ht.replace(/\[rnk\]/img, new Date().getTime());
            var tr = baidu('<tr/>').append(ht);
            addlistener(tr);
            tr.appendTo(me);
            if (arg.callback != null) {
                arg.callback.call(this, tr);
            }
        };
        var chkkey = function () {
            if (arg.key == null) {
                return;
            }
            var vals = [];
            me.find(arg.key).each(function () {
                var val = this.value.trim();
                if (val == '') {
                    return true;
                }
                if (vals.indexOf(val) > -1) {
                    baidu(this).addClass('error');
                } else {
                    baidu(this).removeClass('error');
                }
                vals.push(val);
            });
        };
        var fillrow = function () {
            var blands = 0;
            me.find('tr:gt(1)').each(function () {
                var empty = true;
                baidu(this).find('input:text').each(function () {
                    if (this.value.trim() != '') {
                        empty = false;
                        return false;
                    }
                });
                if (empty) {
                    blands++;
                }
            });
            if (blands == 0) {
                copyrow();
            }
        };
        addlistener(me.find('tr:gt(1)'));
        copyrow();
        return me;
    }
});

baidu.dom.extend({
    msg: function () {
        var me = this;
        var hide = function () {
            baidu('div.msg').remove();
        };
        var fade = function (d, t) {
            setTimeout(function () {
                d.addClass('msg-fade');
            }, t);
            setTimeout(hide, t + 500);
        };
        var close = baidu('<a class="fa fa-close"></a>');
        var div = baidu('<div class="msg"/>').append(close);
        close.click(hide);
        this.alert = function (m, t) {
            div.addClass('msg-alert').append(m);
            if (t != undefined && t > 0) {
                fade(div, t);
            }
        };
        this.success = function (m, t) {
            div.addClass('msg-success').append(m);
            if (t == undefined) {
                t = 1500;
            }
            fade(div, t);
        };
        hide();
        me.append(div);
        return me;
    }
});

baidu.dom.extend({
    blockUI: function () {
        var me = this;
        if (me[0] == undefined) {
            me = baidu.dom('body');
        }
        var id = me.data('blockUI') || '';
        if (id == '') {
            id = new Date().getTime();
            me.data('blockUI', id);
        }

        var div = baidu('#' + id);
        if (div.length == 0) {
            div = baidu('<div class="blockUI"/>').attr('id', id).appendTo(me);
        }
        div.show();

        return me;
    },
    unBlockUI: function () {
        var me = this;
        if (me[0] == undefined) {
            me = baidu.dom('body');
        }
        var id = me.data('blockUI') || '';
        if (id == '') {
            baidu('.blockUI').remove();
        } else {
            baidu('#' + id).remove();
        }
        return me;
    }
});
baidu.blockUI = function () {
    baidu().blockUI();
};
baidu.unBlockUI = function () {
    baidu().unBlockUI();
};
baidu.popwin = function (url, width, height, title, onclose) {
    baidu().blockUI();
    if (width == undefined) {
        width = 600;
    }
    if (height == undefined) {
        height = 300;
    }
    if (title == undefined) {
        title = document.title;
    }
    if (baidu('.popup').length > 0) {
        baidu('.popup').remove();
    }
    var top = (T(window).height() - height - 200) / 2;
    if (top < 50) {
        top = 50;
    }
    var popup = baidu('<div class="popup"/>');
    var wrap = baidu('<div class="wrap"/>').css({width: width, height: height});
    var close = baidu('<a class="close fa fa-close"/>').click(function () {
        if (onclose != undefined && T.isFunction(onclose)) {
            onclose.call(this);
        }
        popup.remove();
        baidu().unBlockUI();
    });
    var head = baidu('<div class="head"/>').html(title).append(close);
    var win = baidu('<iframe id="winframe" name="winframe" frameborder="0" class="win" width="100%" height="100%"/>');
    win.css({width: '100%', height: '100%', border: 0});
    win.attr('src', url);
    popup.css('top', top);
    wrap.append(head).append(win).appendTo(popup);
    baidu('body').append(popup);
    return this;
};
baidu.message = function (txt) {
    baidu().blockUI();
    if (baidu('.popup').length > 0) {
        baidu('.popup').remove();
    }
    var popup = baidu('<div class="popup"/>');
    var wrap = baidu('<div class="wrap"/>');
    var icon = baidu('<i class="fa fa-2x fa-info-circle" />').css('color', '#429842');
    var msg = baidu('<p class="msg"/>').html(txt);
    this.update = function (txt) {
        msg.html(txt);
    };
    wrap.append(icon).append(msg).appendTo(popup);
    baidu('body').append(popup);
    return this;
};
baidu.alert = function (txt, callback) {
    baidu().blockUI();
    if (baidu('.popup').length > 0) {
        baidu('.popup').remove();
    }
    var popup = baidu('<div class="popup"/>');
    var wrap = baidu('<div class="wrap"/>');
    var icon = baidu('<i class="fa fa-3x fa-warning" />').css('color', '#c62b26');
    var msg = baidu('<p class="msg"/>').html(txt);
    var btn = baidu('<div class="btns"/>').append();
    var btn1 = baidu('<button class="btn btn-big btn-primary" />').html('确定');
    btn1.click(function () {
        if (callback && baidu.isFunction(callback)) {
            callback.call(this);
        }
        popup.remove();
        baidu().unBlockUI();
    });
    btn.append(btn1);
    wrap.append(icon).append(msg).append(btn).appendTo(popup);
    baidu('body').append(popup);
    btn1.focus();
};
baidu.confirm = function (txt, callback, isclose) {
    baidu().blockUI();
    if (baidu('.popup').length > 0) {
        baidu('.popup').remove();
    }
    var popup = baidu('<div class="popup"/>');
    var wrap = baidu('<div class="wrap"/>');
    var icon = baidu('<i class="fa fa-3x fa-question-circle" />').css('color', '#f37b1d');
    var msg = baidu('<p class="msg"/>').html(txt);
    var btn = baidu('<div class="btns"/>').append();
    var btn1 = baidu('<button class="btn btn-big btn-primary" />').html('确定').css('margin-right', 10);
    var btn2 = baidu('<button class="btn btn-big btn-default" />').html('取消');
    btn1.click(function () {
        if (callback && baidu.isFunction(callback)) {
            callback.call(this, true);
        }
        if (isclose && baidu.isFunction(isclose)) {
            if (!isclose.call(this)) {
                return;
            }
        }
        popup.remove();
        baidu().unBlockUI();
    });
    btn2.click(function () {
        if (callback && baidu.isFunction(callback)) {
            callback.call(this, false);
        }
        popup.remove();
        baidu().unBlockUI();
    });
    btn.append(btn1).append(btn2);
    wrap.append(icon).append(msg).append(btn).appendTo(popup);
    baidu('body').append(popup);
    btn1.focus();
};
baidu.sure2del = function (d, u, c) {
    T.confirm('确认要删除此内容吗？', function (stat) {
        if (stat == false) {
            return;
        }
        var b = function (res) {
            var rel = res.responseText;
            if (rel == 'ok') {
                if (c != undefined && baidu.isFunction(c)) {
                    c.call(this, d);
                } else {
                    window.location.reload();
                }
            } else {
                T.alert(rel);
            }
        };
        baidu.ajax(u, {cache: false, data: d, type: 'POST', complete: b});
    });
};
baidu.TableExtendRow = function (o, u) {
    var p = baidu(o).parent();
    var n = p.next(), t = p.find('td').length, i = baidu(o).find('i');
    if (n.attr('style').indexOf('none') > -1) {
        i.removeClass('fa-plus').addClass('fa-minus');
        var l = baidu('<i/>').addClass('fa fa-spin fa-spinner');
        var d = n.show().find('td').attr('colspan', t).empty().append(l);
        baidu.get(u, function (r) {
            d.html(r);
        });
    } else {
        i.removeClass('fa-minus').addClass('fa-plus');
        n.hide();
    }
};