<?php

/*
 * This file is part of jslirola/flarum-ext-login2seeplus.
 *
 * Copyright (c) 2020
 * Original Extension by WiseClock
 * Updated by jslirola
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JSLirola\Login2SeePlus;

use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;
use JSLirola\Login2SeePlus\HideContentInPosts;
use JSLirola\Login2SeePlus\HideContentInPostPreviews;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/login2seeplus.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/login2seeplus-settings.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\Settings())
        ->serializeToForum('jslirola.login2seeplus.post', 'jslirola.login2seeplus.post', function ($val) {
            return $val;
        })
        ->serializeToForum('jslirola.login2seeplus.link', 'jslirola.login2seeplus.link', function ($val) {
            return $val;
        })
        ->serializeToForum('jslirola.login2seeplus.image', 'jslirola.login2seeplus.image', function ($val) {
            return $val;
        })
        ->serializeToForum('jslirola.login2seeplus.php', 'jslirola.login2seeplus.php', function ($val) {
            return $val;
        })
        ->serializeToForum('jslirola.login2seeplus.code', 'jslirola.login2seeplus.code', function ($val) {
            return $val;
        }),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->mutate(function ($serializer, $model, $attributes) {
            $m = app(HideContentInPosts::class);
            $attributes['contentHtml'] = $m->getContent($serializer, $attributes);
            return $attributes;
        }),

    (new Extend\ApiSerializer(BasicPostSerializer::class))
        ->mutate(function ($serializer, $model, $attributes) {
            $m = app(HideContentInPostPreviews::class);
            $attributes['contentHtml'] = $m->getContent($serializer, $attributes);
            return $attributes;
        }),

];
