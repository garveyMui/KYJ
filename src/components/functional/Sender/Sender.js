
export class Sender {
  _cliet;
  constructor(
    client,
    type,
    id,
    data
  ) {
    this.client = client;
  }
  async sendMessage(message, options){
    return await this.getClient().post(
      this._channelURL()+'/message',
      {
        message,
        ...options,
      }
      );
  }

  sendImage(uri, filename, contentType, user){
    return this.getClient().sendFile(`${this._channelURL()}/image`, uri, filename, contentType, user);
  }

}
export default Sender;