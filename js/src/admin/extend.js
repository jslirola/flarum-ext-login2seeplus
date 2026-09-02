import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';

export default [
    new Extend.Admin()
        .customSetting(() => <legend className="login2seeplus-lenght">{app.translator.trans('jslirola-login2seeplus.admin.post.title')}</legend>)
        .setting(() => ({
            setting: 'jslirola.login2seeplus.post',
            type: 'number',
            min: -1
        }))
        .customSetting(() => <legend className="login2seeplus-hide">{app.translator.trans('jslirola-login2seeplus.admin.hide')}</legend>)
        .setting(() => ({
            setting: 'jslirola.login2seeplus.link',
            type: 'select',
            label: app.translator.trans('jslirola-login2seeplus.admin.link'),
            options: {
                '0': app.translator.trans('jslirola-login2seeplus.admin.link_off'),
                '1': app.translator.trans('jslirola-login2seeplus.admin.link_hide'),
                '2': app.translator.trans('jslirola-login2seeplus.admin.link_mask'),
            },
            default: '1'
        }))
        .setting(() => ({
            setting: 'jslirola.login2seeplus.image',
            type: 'switch',
            label: app.translator.trans('jslirola-login2seeplus.admin.image')
        }))
        .setting(() => ({
            setting: 'jslirola.login2seeplus.code',
            type: 'switch',
            label: app.translator.trans('jslirola-login2seeplus.admin.code')
        })),
];
