import SettingsModal from 'flarum/components/SettingsModal';
import Switch from "flarum/components/Switch";
import Select from 'flarum/components/Select';
import app from 'flarum/app';

export default class Login2SeeSettingsModal extends SettingsModal
{
    constructor()
    {
        super();
        this.linkOptions =
        {
            'no_replace': app.translator.trans('jslirola-login2see.admin.link.no_replace'),
            'replace_address': app.translator.trans('jslirola-login2see.admin.link.replace_address'),
            'replace_all': app.translator.trans('jslirola-login2see.admin.link.replace_all'),
        };
    }

    className()
    {
        return 'Login2SeeSettingsModal Modal--small';
    }

    title()
    {
        return app.translator.trans('jslirola-login2see.admin.title');
    }

    form()
    {
        return [
            m('div', {className: 'JSLirolaLogin2SeePlus'}, [
                m('fieldset', {className: 'JSLirolaLogin2SeePlus-post'}, [
                    m('legend', {}, app.translator.trans('jslirola-login2seeplus.admin.post.title')),
                    m('div', {className: 'helpText'}, app.translator.trans('jslirola-login2seeplus.admin.post.help')),
                    m('input', {className: 'FormControl', bidi: this.setting('jslirola.login2seeplus.post', '100')}),
                ]),
                m('fieldset', {className: 'JSLirolaLogin2SeePlus-link'}, [
                    m('legend', {}, app.translator.trans('jslirola-login2seeplus.admin.link.title')),
                    Select.component(
                    {
                        options: this.linkOptions,
                        onchange: this.setting('jslirola.login2seeplus.link', Object.keys(this.linkOptions)[1]),
                        value: this.setting('jslirola.login2seeplus.link', Object.keys(this.linkOptions)[1])()
                    })
                ]),
                m('fieldset', {className: 'JSLirolaLogin2SeePlus-image'}, [
                    m('legend', {}, app.translator.trans('jslirola-login2seeplus.admin.image.title')),
                    Switch.component(
                    {
                        state: JSON.parse(this.setting('jslirola.login2seeplus.image', 0)()),
                        onchange: this.setting('jslirola.login2seeplus.image', 1),
                        children: app.translator.trans('jslirola-login2seeplus.admin.image.label'),
                    }),
                ]),
                m('fieldset', {className: 'JSLirolaLogin2SeePlus-php'}, [
                    m('legend', {}, app.translator.trans('jslirola-login2seeplus.admin.php.title')),
                    m('div', {className: 'helpText'}, app.translator.trans('jslirola-login2seeplus.admin.php.help')),
                    Switch.component(
                    {
                        state: JSON.parse(this.setting('jslirola.login2seeplus.php', 0)()),
                        onchange: this.setting('jslirola.login2seeplus.php', 1),
                        children: app.translator.trans('jslirola-login2seeplus.admin.php.label'),
                    }),
                ]),
            ]),
        ];
    }
}
