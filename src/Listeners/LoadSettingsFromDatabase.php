<?php

namespace JSLirola\Login2SeePlus\Listeners;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Api\Event\Serializing;
use Flarum\Settings\SettingsRepositoryInterface;
use Symfony\Component\Translation\TranslatorInterface;

class LoadSettingsFromDatabase
{
    protected $settings;
    protected $translator;
    protected $fields = [
        'post',
        'link',
        'image',
        'php',
    ];

    public function __construct(SettingsRepositoryInterface $settings, TranslatorInterface $translator)
    {
        $this->settings = $settings;
        $this->translator = $translator;
    }

    private function truncate_html($string, $length)
    {
        $string = trim($string);
        $i = 0;
        $tags = array();

        preg_match_all('/<[^>]+>([^<]*)/', $string, $tagMatches, PREG_OFFSET_CAPTURE | PREG_SET_ORDER);
        foreach($tagMatches as $tagMatch)
        {
            if ($tagMatch[0][1] - $i >= $length)
                break;
            $tag = mb_substr(strtok($tagMatch[0][0], " \t\n\r\0\x0B>"), 1);
            if ($tag[0] != '/')
                $tags[] = $tag;
            elseif (end($tags) == mb_substr($tag, 1))
                array_pop($tags);
            $i += $tagMatch[1][1] - $tagMatch[0][1];
        }

        return mb_substr($string, 0, $length = min(mb_strlen($string), $length + $i)) . (count($tags = array_reverse($tags)) ? '</' . implode('></', $tags) . '>' : '');
    }

    public function handle(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class))
        {
            foreach ($this->fields as $field)
            {
                $k = 'jslirola.login2seeplus.' . $field;
                $event->attributes[$k] = $this->settings->get($k);
            }
        }
        else if ($event->isSerializer(PostSerializer::class))
        {
            if (!$event->actor->isGuest())
                return;

            $s_php = $this->settings->get('jslirola.login2seeplus.php', false);
            if (!$s_php)
                return;

            $s_post = (int)$this->settings->get('jslirola.login2seeplus.post', 100);
            $s_link = $this->settings->get('jslirola.login2seeplus.link', 'replace_all');
            $s_image = $this->settings->get('jslirola.login2seeplus.image', false);

            $originalHTML = $event->attributes['contentHtml'];
            $newHTML = $originalHTML;

            // truncate
            if ($s_post != -1)
                $newHTML =  $this->truncate_html($newHTML, $s_post);

            // links
            if ($s_link != 'no_replace')
                $newHTML = preg_replace('/<a href=".*?"/is', '<a', $newHTML);
            if ($s_link == 'replace_all')
                $newHTML = preg_replace('/(<a[^>]*>)[^<]*<\/a>/is', '$1' . $this->translator->trans('jslirola-login2seeplus.forum.link') . '</a>', $newHTML);

            // images
            if ($s_image)
                $newHTML = preg_replace('/<img((.(?!class=))*)\/?>/is', '<div class="jslirolaLogin2seeplusImgPlaceholder">' . $this->translator->trans('jslirola-login2seeplus.forum.image') . '</div>', $newHTML);
            
            // show alert
            if ($s_post != -1)
                $newHTML .= '<div class="jslirolaLogin2seeplusAlert">' . $this->translator->trans('jslirola-login2seeplus.forum.post', array(
                    '{login}' => '<a class="jslirolaLogin2seeplusLogin">' . $this->translator->trans('core.forum.header.log_in_link') . '</a>',
                    '{register}' => '<a class="jslirolaLogin2seeplusRegister">' . $this->translator->trans('core.forum.header.sign_up_link') . '</a>'
                )) . '</div>';

            $event->attributes['contentHtml'] = $newHTML;
        }
    }
}
