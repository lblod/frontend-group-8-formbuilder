import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { TABLE_OF_CONTENTS_CONFIG } from '../utils/constants';

export default class RdfaEditorContainerComponent extends Component {
  @tracked editor;
  @service currentSession;
  plugins = [
    'article-structure',
    { name: 'rdfa-toc', options: { config: TABLE_OF_CONTENTS_CONFIG } },
    'generate-template',
    {
      name: 'insert-variable',
      options: {
        publisher: this.currentSession.group.uri,
        variableTypes: ['text', 'number', 'date', 'codelist'],
      },
    },
  ];

  get editorOptions() {
    return (
      this.args.editorOptions ?? {
        showToggleRdfaAnnotations: Boolean(this.args.showToggleRdfaAnnotations),
        showInsertButton: false,
        showRdfa: true,
        showRdfaHighlight: true,
        showRdfaHover: true,
        showPaper: true,
        showSidebar: true,
      }
    );
  }

  get toolbarOptions() {
    return (
      this.args.toolbarOptions ?? {
        showTextStyleButtons: true,
        showListButtons: true,
        showIndentButtons: true,
      }
    );
  }

  get documentContext() {
    if (this.args.editorDocument) {
      try {
        return JSON.parse(this.args.editorDocument.context);
      } catch (e) {
        console.warn(
          'Error encountered during parsing of document context. ' +
            'Reverting to default context.',
          e
        );
      }
    }
    return {
      prefix: this.args.prefix ?? '',
      typeof: '',
      vocab: '',
    };
  }

  get vocab() {
    return this.documentContext['vocab'];
  }

  /**
   * this is a workaround because emberjs does not allow us to assign the prefix attribute in the template
   * see https://github.com/emberjs/ember.js/issues/19369
   */
  @action
  setPrefix(element) {
    element.setAttribute(
      'prefix',
      this.prefixToAttrString(this.documentContext.prefix)
    );
  }

  @action
  rdfaEditorInit(editor) {
    if (this.args.rdfaEditorInit) {
      this.args.rdfaEditorInit(editor);
    }
    this.editor = editor;
  }

  prefixToAttrString(prefix) {
    let attrString = '';
    Object.keys(prefix).forEach((key) => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  }
}
