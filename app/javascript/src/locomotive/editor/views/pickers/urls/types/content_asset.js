import React, { Component } from 'react';
import { isBlank } from '../../../../utils/misc';
import i18n from '../../../../i18n';
import { bindAll } from 'lodash';

// Components
import Autosuggest from './shared/autosuggest';
import NewWindowCheckbox from './shared/new_window_checkbox';
import Uploader from './shared/uploader';

class ContentAsset extends Component {

  constructor(props) {
    super();
    this.state = { settings: {} };
    bindAll(this, 'handleContentAssetChanged', 'handleUpload');
  }

  componentDidMount() {
    const { settings, api } = this.props;

    this.setState({ settings }, () => {
      if (isBlank(settings.value)) return; // no selected content asset
    });
  }

  _handleChange(newSettings, extraData) {
    this.setState({
      ...extraData,
      settings: Object.assign(this.state.settings, newSettings)
    }, () => this.props.handleChange(this.state.settings));
  }

  handleContentAssetChanged(newSettings) {
    this._handleChange(newSettings, {});
  }

  handleUpload(content_asset) {
    this.handleContentAssetChanged({
      label: ['Content asset', content_asset.source_filename],
      type: 'content_asset',
      value: { url: content_asset.source.url, id: content_asset._id }
    });
  }

  handleNewWindowChanged(checked) {
    this._handleChange({ new_window: checked }, {});
  }

  renderContentAssetPicker() {
    return (
      <Autosuggest
        label={i18n.t('views.pickers.url.content_asset.label')}
        placeholder={i18n.t('views.pickers.url.content_asset.placeholder')}
        input={(this.state.settings?.label || [])[1] || ''}
        search={input => this.props.api.searchForResources('content_asset', input) }
        handleChange={value => this.handleContentAssetChanged(value)}
        handleNewInput={() => this.setState({ settings: {} })}
      />
    );
  }

  renderContentAssetUploader() {
    return (
      <Uploader
        label={i18n.t('views.pickers.url.upload')}
        handleUpload={this.handleUpload}
        uploadAssets={this.props.api.uploadAssets}
      />
    );
  }

  renderNewWindowCheckbox() {
    return (
      <NewWindowCheckbox
        label={i18n.t('views.pickers.url.open_new_window')}
        checked={this.state.settings.new_window}
        onChange={checked => this.handleNewWindowChanged(checked)}
      />
    )
  }

  render() {
    const { settings } = this.state;

    return (
      <div className="url-picker-page-settings">
        {this.renderContentAssetPicker()}

        {this.renderContentAssetUploader()}

        {settings && this.renderNewWindowCheckbox()}
      </div>
    )
  }

}

export default ContentAsset;
