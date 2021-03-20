import { extend } from 'flarum/common/extend';
import app from 'flarum/common/app';

import Login2SeePlusSettingsModal from './components/Login2SeePlusSettingsModal';

app.initializers.add('jslirola-login2seeplus', () =>
{
    app.extensionSettings['jslirola-login2seeplus'] = () => app.modal.show(Login2SeePlusSettingsModal);
});
