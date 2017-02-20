import React from 'react';

export default class App extends React.Component {
  state = {data: '', encrypted: '', decrypted: ''};

  componentDidMount() {
    this.refs.input.focus()
  }

  onInputChange = async ({target: {value}}) => {
    await this.setState({data: parseInt(value)});

    let buffer = new ArrayBuffer(4);
    let dataView = new DataView(buffer);

    dataView.setUint8(0, value);

    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    console.log(iv)
    let key = await window.crypto.subtle.generateKey({name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
    console.log(key)
    let encrypted = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, dataView);

    this.setState({encrypted: new DataView(encrypted).getUint8()})

    let decrypted = await window.crypto.subtle.decrypt({name: "AES-GCM", iv: iv}, key, encrypted)

    this.setState({decrypted: new DataView(decrypted).getUint8()})
  };

  render() {
    return (
      <div id="content">
        <input ref='input' value={this.state.data} onChange={this.onInputChange} />
        <span>{this.state.encrypted}</span>
        <span style={{marginLeft: '10px'}}>{this.state.decrypted}</span>
      </div>
    );
  }
}
