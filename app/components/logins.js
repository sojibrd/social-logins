import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginsComponent extends Component {
  @service session;
  @tracked identification;
  @tracked password;
  @tracked errorMessage;

  @action
  async authenticate(e) {
    e.preventDefault();
    try {
      await this.session.authenticate('authenticator:oauth2', this.identification, this.password);
    } catch (error) {
      this.errorMessage = error.error || error;
    }
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }
}