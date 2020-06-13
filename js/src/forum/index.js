import { extend, override } from 'flarum/extend';

import app from 'flarum/app';
import CommentPost from 'flarum/components/CommentPost';
import HeaderPrimary from 'flarum/components/HeaderPrimary';
import LogInModal from 'flarum/components/LogInModal';
import SignUpModal from 'flarum/components/SignUpModal';

app.initializers.add('jslirola-login2seeplus', function()
{
    let jslirolaLogin2seeplusUsePHP;
    let jslirolaLogin2seeplusPostsLength;
    let jslirolaLogin2seeplusReplaceLinks;
    let jslirolaLogin2seeplusReplaceImages;
    const jslirolaLogin2seeplusImgMin = 150;

    // http://stackoverflow.com/questions/6003271/substring-text-with-html-tags-in-javascript/6003713#6003713
    function html_substr(str, count)
    {
        var div = document.createElement('div');
        div.innerHTML = str;
        walk(div, track);

        function track(el)
        {
            if(count > 0)
            {
                var len = el.data.length;
                count -= len;
                if(count <= 0 && el && el.data)
                    el.data = el.substringData(0, el.data.length + count) + '...';
            }
            else
            {
                if (el && el.data)
                    el.data = '';
            }
        }

        function walk(el, fn)
        {
            var node = el.firstChild;
            if (el.innerHTML && count <= 0)
                el.innerHTML='';
            do
            {
                if(node.nodeType === 3)
                    fn(node);
                else if(node.nodeType === 1 && node.childNodes && node.childNodes[0])
                    walk(node, fn);
            }
            while(node = node.nextSibling);
        }

        return div.innerHTML;
    }

    function html_count(str)
    {
        var div = document.createElement("div");
        div.innerHTML = str;
        var text = div.textContent || div.innerText || "";
        return text.length;
    }

    extend(HeaderPrimary.prototype, 'init', function ()
    {
        jslirolaLogin2seeplusPostsLength = parseInt(app.forum.attribute('jslirola.login2seeplus.post') || 100);
        if (isNaN(jslirolaLogin2seeplusPostsLength))
            jslirolaLogin2seeplusPostsLength = -1;
        jslirolaLogin2seeplusReplaceLinks = app.forum.attribute('jslirola.login2seeplus.link') || 'replace_all';
        jslirolaLogin2seeplusReplaceImages = JSON.parse(app.forum.attribute('jslirola.login2seeplus.image') || 0);
        jslirolaLogin2seeplusUsePHP = JSON.parse(app.forum.attribute('jslirola.login2seeplus.php') || 0);
    });

    extend(CommentPost.prototype, 'content', function(list)
    {
        if (app.session.user || this.isEditing())
            return;

        if (jslirolaLogin2seeplusUsePHP)
            return;

        let oldContent = list[1].children[0].toString();
        let newContent = oldContent;
        let subbedContent = false;   

        // hide content
        if (jslirolaLogin2seeplusPostsLength != -1 && html_count(newContent) > jslirolaLogin2seeplusPostsLength)
        {
            try
            {
                newContent = html_substr(newContent, jslirolaLogin2seeplusPostsLength);
            }
            catch (ex) { }
            subbedContent = true;
        }

        // replace links
        if (jslirolaLogin2seeplusReplaceLinks != 'no_replace')
            newContent = newContent.replace(/<a href=".*?"/g, '<a');
        if (jslirolaLogin2seeplusReplaceLinks == 'replace_all')
            newContent = newContent.replace(/(<a[^>]*>)[^<]*<\/a>/g, '$1' + app.translator.trans('jslirola-login2seeplus.forum.link') + '</a>');

        // replace images
        if (jslirolaLogin2seeplusReplaceImages)
        {

            let imgCounter = 0;
            newContent = newContent.replace(/<img((.(?!class=))*)\/?>/g, function(html)
            {
                let img = $(html)[0];
                let src = img.src;

                let loader = new Image();
                loader.onload = function()
                {
                    let imgWidth = loader.width;
                    let imgHeight = loader.height;
                    imgWidth = imgWidth > jslirolaLogin2seeplusImgMin ? imgWidth : jslirolaLogin2seeplusImgMin;
                    imgHeight = imgHeight > jslirolaLogin2seeplusImgMin ? imgHeight : jslirolaLogin2seeplusImgMin;
                    $('.wlip' + this.counter).width(imgWidth);
                    $('.wlip' + this.counter).height(imgHeight);
                }

                loader.counter = imgCounter;
                loader.src = src;

                return '<div class="jslirolaLogin2seeplusImgPlaceholder wlip' + (imgCounter++) + '">' + app.translator.trans('jslirola-login2seeplus.forum.image') + '</div>';
            });
        }

        if (subbedContent)
            newContent += '<div class="jslirolaLogin2seeplusAlert">' + app.translator.trans('jslirola-login2seeplus.forum.post',
            {
                login: "<a class='jslirolaLogin2seeplusLogin'>" + app.translator.trans('core.forum.header.log_in_link') + "</a>",
                register: "<a class='jslirolaLogin2seeplusRegister'>" + app.translator.trans('core.forum.header.sign_up_link') + "</a>"
            }).join('') + '</div>';

        list[1].children[0] = m.trust(newContent);
    });

    extend(CommentPost.prototype, 'config', function()
    {
        if (jslirolaLogin2seeplusReplaceLinks != 'no_replace')
            $('.Post-body a').off('click').on('click', () => app.modal.show(new LogInModal()));
        $('.jslirolaLogin2seeplusLogin').off('click').on('click', () => app.modal.show(new LogInModal()));
        $('.jslirolaLogin2seeplusRegister').off('click').on('click', () => app.modal.show(new SignUpModal()));
    });
});
