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

use Flarum\Api\Context;
use Flarum\Api\Schema;

class HideContentInPost extends FormatContent
{
    public function __invoke(Schema\Str $field): Schema\Str
    {
        return $field->serialize(function ($newHTML, Context $context) {
            if ($newHTML === null) {
                return $newHTML;
            }

            $actor = $context->getActor();

            if (!$actor->isGuest() && $actor->is_email_confirmed) {
                return $newHTML;
            }

            $s_php = $this->settings->get('jslirola.login2seeplus.php', false);
            $s_post = (int) $this->settings->get('jslirola.login2seeplus.post', 100);
            $s_link = $this->settings->get('jslirola.login2seeplus.link', false);
            $s_image = $this->settings->get('jslirola.login2seeplus.image', false);
            $s_code = $this->settings->get('jslirola.login2seeplus.code', false);

            // truncate
            if ($s_post != -1 && function_exists('mb_substr') && function_exists('mb_strlen')) {
                $newHTML = $this->truncate_html($newHTML, $s_post);
                $newHTML = preg_replace('/(<p>)([^<]*)<\/p>$/is', '$1$2...$3', $newHTML);
            }

            // links
            if ($s_link == 1) {
                $newHTML = preg_replace('/(<a((?!PostMention).)*?>)[^<]*<\/a>/is', $this->get_link('jslirola-login2seeplus.forum.link'), $newHTML);
                $newHTML = preg_replace('/<span data-s9e-mediaembed=(.*?)><span (.*?)><iframe(.*?)><\/iframe><\/span><\/span>/is', $this->get_link('jslirola-login2seeplus.forum.link'), $newHTML);
                $newHTML = preg_replace('/<iframe data-s9e-mediaembed=(.*?)><\/iframe>/is', $this->get_link('jslirola-login2seeplus.forum.link'), $newHTML);
            } elseif ($s_link == 2) // hide address
                $newHTML = preg_replace('/<a href=".*?"/is', '<a class="l2sp"', $newHTML);

            // images
            if ($s_image) {
                $newHTML = preg_replace('/<img\b[^>]*\/?>/is', '<div class="jslirolaLogin2seeplusImgPlaceholder">' . $this->get_link('jslirola-login2seeplus.forum.image') . '</div>', $newHTML);
            }

            // code
            if ($s_code) {
                $newHTML = preg_replace('/<pre><code(.*?)>[^>]*<\/pre>/is', $this->get_link('jslirola-login2seeplus.forum.code'), $newHTML);
                $newHTML = preg_replace('/<code(.*?)>[^>]*<\/code>/is', $this->get_link('jslirola-login2seeplus.forum.code'), $newHTML);
            }

            // show alert
            if ($s_post != -1) {
                $args = [
                    '{login}' => '<a class="jslirolaLogin2seeplusLogin">' . $this->translator->trans('core.forum.header.log_in_link') . '</a>'
                ];

                if ($this->settings->get('allow_sign_up') === '1') {
                    $args['register'] = '<a class="jslirolaLogin2seeplusRegister">' . $this->translator->trans('core.forum.header.sign_up_link') . '</a>';
                }

                $key = $this->settings->get('allow_sign_up') === '1'
                    ? 'jslirola-login2seeplus.forum.post'
                    : 'jslirola-login2seeplus.forum.post_login';
                $newHTML .= '<div class="jslirolaLogin2seeplusAlert">' . $this->translator->trans($key, $args) . '</div>';
            }

            return $newHTML;
        });
    }
}
