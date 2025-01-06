import {connect, disconnect, errorOccurred} from '@/store/modules/Socket';
import {setMessage} from '@/store/modules/Messages';

const webSocket = new WebSocket('ws://localhost:4023');

export { webSocket };
