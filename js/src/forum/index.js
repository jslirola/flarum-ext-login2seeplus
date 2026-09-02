import { extend } from 'flarum/common/extend';

import app from 'flarum/common/app';
import CommentPost from 'flarum/forum/components/CommentPost';

app.initializers.add('jslirola-login2seeplus', function()
{
    extend(CommentPost.prototype, 'oncreate', function()
    {
        const showLogInModal = () => app.modal.show(() => import('flarum/forum/components/LogInModal'));
        const showSignUpModal = () => app.modal.show(() => import('flarum/forum/components/SignUpModal'));

        $('.Post-body a.l2sp').off('click').on('click', showLogInModal);
        $('.jslirolaLogin2seeplusLogin').off('click').on('click', showLogInModal);
        $('.jslirolaLogin2seeplusRegister').off('click').on('click', showSignUpModal);
    });

});
