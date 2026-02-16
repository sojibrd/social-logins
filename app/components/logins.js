import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LoginsComponent extends Component {
  constructor(owner, args) {
    super(owner, args);
    this.checkGithubCallback();
  }

  checkGithubCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      console.log('GitHub Code:', code);
      alert(`GitHub Code received: ${code}`);
      // Note: In a production app, you would send this 'code' to your backend
      // to exchange it for an access token via the GitHub API.
    }
  }

  @action
  async loginWithGoogle() {
    await this.loadGoogleScript();

    /* global google */
    const client = google.accounts.oauth2.initTokenClient({
      client_id:
        '904413682544-3jdle2rob93j7kc78ar5dl91vm03ibgq.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
      callback: (tokenResponse) => {
        if (tokenResponse.access_token) {
          this.onGoogleLoginSuccess(tokenResponse.access_token);
        }
      },
    });

    client.requestAccessToken();
  }

  loadGoogleScript() {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined') {
        return resolve();
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  async onGoogleLoginSuccess(accessToken) {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const user = await response.json();
    console.log('User:', user);
    alert(`Welcome, ${user.name}!`);
  }

  @action
  async loginWithFacebook() {
    await this.loadFacebookScript();

    /* global FB */
    FB.init({
      appId: '1430232628491377',
      cookie: true,
      xfbml: true,
      version: 'v16.0',
    });

    FB.login(
      (response) => {
        if (response.authResponse) {
          this.onFacebookLoginSuccess(response.authResponse.accessToken);
        }
      },
      { scope: 'public_profile,email' }
    );
  }

  loadFacebookScript() {
    return new Promise((resolve) => {
      if (typeof FB !== 'undefined') {
        return resolve();
      }
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  onFacebookLoginSuccess(accessToken) {
    FB.api('/me', { fields: 'name,email' }, (response) => {
      console.log('User:', response);
      alert(`Welcome, ${response.name}!`);
    });
  }

  @action
  loginWithGithub() {
    const clientId = 'Ov23liLBvvd5WZth0O4u';
    const redirectUri = window.location.href;
    const scope = 'read:user';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  }
}
