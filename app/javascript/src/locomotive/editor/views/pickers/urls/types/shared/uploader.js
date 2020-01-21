import React, { Component } from 'react';
import { bindAll, map, compact } from 'lodash';
import i18n from '../../../../../i18n';

class Uploader extends Component {

  constructor(props) {
    super(props);
    this.state = { uploading: false };
    bindAll(this, 'openDialog', 'handleUpload');
  }

  openDialog() {
    this.input.click();
  }

  _handleUpload(files) {
    this.props.uploadAssets(files)
    .then((assets) => {
      this.setState({ uploading: false }, () => {
        this.props.handleUpload(assets[0]);
      });
      this.input.value = '';
    })
    .catch(error => { alert('error!', error) })
  }

  handleUpload(event) {
    const files = compact(map(event.target.files, file => file.size > window.Locomotive.maximum_uploaded_file_size ? null : file));

    if (files.length > 0)
      this.setState({ uploading: true }, () => {
        this._handleUpload(files)
      });
  }

  render() {
    return (
      <div className='editor-input editor-input-uploader'>
        <input className='hidden' type='file' ref={el => this.input = el} onChange={this.handleUpload} />
        <a onClick={this.openDialog} className="editor-list-add--button">
          {i18n.t('views.pickers.url.content_asset.upload')}
        </a>
      </div>
    )
  }

}

export default Uploader
