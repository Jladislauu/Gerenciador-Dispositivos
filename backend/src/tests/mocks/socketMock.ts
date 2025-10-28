export class SocketMock {
  public emitted: { event: string; data: any }[] = [];

  emit(event: string, data: any) {
    this.emitted.push({ event, data });
  }

  clear() {
    this.emitted = [];
  }
}

export class IOMock {
  public socket = new SocketMock();

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  to(room: string) {
    return this;
  }

  clear() {
    this.socket.clear();
  }
}