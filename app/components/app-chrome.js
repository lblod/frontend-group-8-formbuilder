import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class AppChromeComponent extends Component {
  @service currentSession;
  @service features;
  @service intl;
  @service router;

  get documentStatus() {
    const status = this.args.documentContainer?.get('status');
    return status;
  }

  get showFileDropdown() {
    return (
      this.args.copyAgendapunt ||
      this.args.exportHtmlFunction ||
      this.args.sendToTrash
    );
  }

  @action
  updateDocumentTitle(title) {
    this.args.editorDocument.title = title;
  }

  @action
  async resetDocument() {
    this.args.editorDocument.rollbackAttributes();
  }

  @action
  async saveDocument() {
    await this.args.editorDocument.save();
  }

  @action
  goBack() {
    history.back();
  }
}
