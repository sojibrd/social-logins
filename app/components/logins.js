import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LoginsComponent extends Component {
  @action
  loginWithGoogle() {
    // Implement your Google login logic here
    console.log('Login with Google button clicked');
  }
}
