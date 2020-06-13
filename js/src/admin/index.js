import { extend } from 'flarum/extend';
import app from 'flarum/app';

import Login2SeeSettingsModal from './components/Login2SeePlusSettingsModal';

app.initializers.add('jslirola-login2seeplus', () =>
{
    app.extensionSettings['jslirola-login2seeplus'] = () => app.modal.show(new Login2SeeSettingsModal());
});
