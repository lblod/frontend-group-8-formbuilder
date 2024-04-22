import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TemplatesManagementEditRoute extends Route {
  @tracked editor;
  @service store;
  @service session;
  profile = 'draftDecisionsProfile';

  async model(params) {
    const documentContainer = await this.store.findRecord(
      'document-container',
      params.id,
      { include: 'current-version,snippet-lists,snippet-lists.snippets' },
    );
    const editorDocument = await documentContainer.currentVersion;
    return { documentContainer, editorDocument };
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.set('_editorDocument', '');
  }
}
