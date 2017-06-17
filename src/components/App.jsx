import React from 'react';
import UploadPage from './UploadPage';
import DownloadPage from './DownloadPage';
import AuthPage from './AuthPage';

export default class App extends React.Component {
  state = this.parseHashParams();

  parseHashParams() {
    return {params: new URLSearchParams(location.hash.slice(1))}
  }

  routeToPage() {
    let dropboxAccessToken = this.state.params.get('access_token');

    if(this.downloadParamsPresent()) {
      return (
        <DownloadPage
          jwk={this.state.params.get('key')}
          iv={this.state.params.get('iv')}
          filename={this.state.params.get('filename')}
          shareLink={this.state.params.get('shareLink')}
        />
      )
    } else if(!dropboxAccessToken) {
      return <AuthPage />
    } else {
      return <UploadPage dropboxAccessToken={dropboxAccessToken} />
    }
  }

  downloadParamsPresent() {
    let params = this.state.params;
    return params.has('iv') && params.has('key') && params.has('shareLink') && params.has('filename')
  }

  componentDidMount() {
    window.onpopstate = () => this.setState(this.parseHashParams())
  }

  render() {
    return (
      <div className="app">
        {this.routeToPage()}
      </div>
    );
  }
}
