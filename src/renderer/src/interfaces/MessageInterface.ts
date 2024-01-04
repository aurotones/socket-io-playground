export enum MessageStatus {
    SUCCESS,
    WARNING,
    ERROR,
}

interface MessageInterface {
    id: string,
    instanceId: string,
    type: string,
    message: string,
    timestamp: number,
    status: MessageStatus,
}

export default MessageInterface;
