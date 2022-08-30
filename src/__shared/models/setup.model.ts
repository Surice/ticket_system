import { SetActivity } from './setActivity.model';

interface TicketTool {
    messageId: string;
    parentId: string;
    ticketId: number;
}

interface SupportChannel {
    channelId: string;
    mentions: string[];
}


export interface Setup {
    activity: SetActivity;
    log: string;
   
    ticketTool: TicketTool;
    supportChannel: SupportChannel;
}