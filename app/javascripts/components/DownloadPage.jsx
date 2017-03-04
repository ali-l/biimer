import React from 'react';
import utils from '../utils';
import Status from './Status';
import secrets from '../../secrets';

export default class DownloadPage extends React.Component {
  state = {loading: true, downloaded: false, status: ''};

  linkId() {
    return location.pathname.slice(3)
  }

  async getKey() {
    if(!this.key) this.key = await utils.importKey(location.hash.slice(1));
    return this.key
  }

  deleteFile() {
    fetch(`https://api.biimer.com/shares/${this.fileData.id}`, {
      method: 'DELETE',
      headers: {'x-api-key': secrets.apiKey}
    });
  }

  downloadFile = async () => {
    this.setState({status: 'Downloading'});
    let fileBlob = await utils.dropbox.download(this.fileData.shareLink);
    this.setState({status: 'Decrypting'});
    let decrypted = await utils.decrypt(await utils.bufferFromBlob(fileBlob), await this.getKey(), this.fileData.iv);
    this.deleteFile();
    utils.saveToDisk(new Blob([decrypted]), this.decryptedFileName);
    this.setState({downloaded: true, status: 'Done!'})
  };

  async loadFileData() {
    let response = await fetch(`https://api.biimer.com/shares/${this.linkId()}`, {
      headers: {'x-api-key': secrets.apiKey}
    });
    if (response.status != 200) return null;
    let fileData = await response.json();
    return {...fileData, iv: new Uint8Array(fileData.iv)}
  }

  async componentDidMount() {
    this.fileData = await this.loadFileData();
    if (!this.fileData) return this.setState({loading: false});
    this.decryptedFileName = await utils.decryptedFileName(this.fileData.fileName, this.fileData.iv, await this.getKey());
    this.setState({fileName: this.decryptedFileName, loading: false})
  }

  renderDownloadButton() {
    if(!this.state.downloaded) {
      return <button onClick={this.downloadFile}>Download</button>
    }
  }

  renderDownloadSection() {
    if(this.state.fileName) {
      return (
        <div>
          <div>{this.state.fileName}</div>
          {this.renderDownloadButton()}
        </div>
      )
    } else {
      return <div>The file you are looking for no longer exists</div>
    }
  }

  render() {
    return (
      <div className='download-page'>
        <h3>Download File</h3>
        <div className={`download-section ${this.state.loading ? 'hidden' : ''}`}>
          {this.renderDownloadSection()}
        </div>
        <div />
        <Status message={this.state.status} />
      </div>
    )
  }
}
