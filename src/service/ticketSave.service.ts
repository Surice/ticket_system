import { Message, TextChannel } from "discord.js";

export function construcSaveHead(channel: TextChannel): string {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <title>${channel.guild?.name} - ${channel.name}</title>
        <meta charset=utf-8>
        <meta name=viewport content="width=device-width">
        <style>
            @font-face {
                font-family: Whitney;
                src: url(https://discordapp.com/assets/6c6374bad0b0b6d204d8d6dc4a18d820.woff);
                font-weight: 300
            }
    
            @font-face {
                font-family: Whitney;
                src: url(https://discordapp.com/assets/e8acd7d9bf6207f99350ca9f9e23b168.woff);
                font-weight: 400
            }
    
            @font-face {
                font-family: Whitney;
                src: url(https://discordapp.com/assets/3bdef1251a424500c1b3a78dea9b7e57.woff);
                font-weight: 500
            }
    
            @font-face {
                font-family: Whitney;
                src: url(https://discordapp.com/assets/be0060dafb7a0e31d2a1ca17c0708636.woff);
                font-weight: 600
            }
    
            @font-face {
                font-family: Whitney;
                src: url(https://discordapp.com/assets/8e12fb4f14d9c4592eb8ec9f22337b04.woff);
                font-weight: 700
            }
    
            body {
                font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
                font-size: 17px
            }
    
            a {
                text-decoration: none
            }
    
            a:hover {
                text-decoration: underline
            }
    
            img {
                object-fit: contain
            }
    
            .markdown {
                white-space: pre-wrap;
                line-height: 1.3;
                overflow-wrap: break-word
            }
    
            .spoiler {
                border-radius: 3px
            }
    
            .quote {
                border-left: 4px solid;
                border-radius: 3px;
                margin: 8px 0;
                padding-left: 10px
            }
    
            .pre {
                font-family: Consolas, "Courier New", Courier, monospace
            }
    
            .pre--multiline {
                margin-top: 4px;
                padding: 8px;
                border: 2px solid;
                border-radius: 5px
            }
    
            .pre--inline {
                padding: 2px;
                border-radius: 3px;
                font-size: 85%;
            }
    
            .mention {
                font-weight: 500;
                background: #3D414F;
                border-radius: 4px;
                padding: 3px;
            }
    
            .emoji {
                width: 1.45em;
                height: 1.45em;
                margin: 0 1px;
                vertical-align: -.4em
            }
    
            .emoji--small {
                width: 1rem;
                height: 1rem
            }
    
            .emoji--large {
                width: 2rem;
                height: 2rem
            }
    
            .info {
                display: flex;
                max-width: 100%;
                margin: 0 5px 10px
            }
    
            .info__guild-icon-container {
                flex: 0
            }
    
            .info__guild-icon {
                max-width: 88px;
                max-height: 88px
            }
    
            .info__metadata {
                flex: 1;
                margin-left: 10px
            }
    
            .info__guild-name {
                font-size: 1.4em
            }
    
            .info__channel-name {
                font-size: 1.2em
            }
    
            .info__channel-topic {
                margin-top: 2px
            }
    
            .info__channel-message-count {
                margin-top: 2px
            }
    
            .info__channel-date-range {
                margin-top: 2px
            }
    
            .chatlog {
                max-width: 100%;
                margin-bottom: 24px
            }
    
            .chatlog__message-group {
                display: flex;
                margin: 0 10px;
                padding: 15px 0;
                border-top: 1px solid
            }
    
            .chatlog__author-avatar-container {
                flex: 0;
                width: 40px;
                height: 40px
            }
    
            .chatlog__author-avatar {
                border-radius: 50%;
                height: 40px;
                width: 40px
            }
    
            .chatlog__messages {
                flex: 1;
                min-width: 50%;
                margin-left: 20px
            }
    
            .chatlog__author-name {
                font-size: 1em;
                font-weight: 500
            }
    
            .chatlog__timestamp {
                margin-left: 5px;
                font-size: .75em
            }
    
            .chatlog__message {
                padding: 2px 5px;
                margin-right: -5px;
                margin-left: -5px;
                background-color: transparent;
                transition: background-color 1s ease
            }
    
            .chatlog__content {
                font-size: .9375em;
                word-wrap: break-word
            }
    
            .chatlog__edited-timestamp {
                margin-left: 3px;
                font-size: .8em
            }
    
            .chatlog__attachment-thumbnail {
                margin-top: 5px;
                max-width: 50%;
                max-height: 500px;
                border-radius: 3px
            }
    
            .chatlog__embed {
                margin-top: 5px;
                display: flex;
                max-width: 520px
            }
    
            .chatlog__embed-color-pill {
                flex-shrink: 0;
                width: 4px;
                border-top-left-radius: 3px;
                border-bottom-left-radius: 3px
            }
    
            .chatlog__embed-content-container {
                display: flex;
                flex-direction: column;
                padding: 8px 10px;
                border: 1px solid;
                border-top-right-radius: 3px;
                border-bottom-right-radius: 3px
            }
    
            .chatlog__embed-content {
                width: 100%;
                display: flex
            }
    
            .chatlog__embed-text {
                flex: 1
            }
    
            .chatlog__embed-author {
                display: flex;
                align-items: center;
                margin-bottom: 5px
            }
    
            .chatlog__embed-author-icon {
                width: 20px;
                height: 20px;
                margin-right: 9px;
                border-radius: 50%
            }
    
            .chatlog__embed-author-name {
                font-size: .875em;
                font-weight: 600
            }
    
            .chatlog__embed-title {
                margin-bottom: 4px;
                font-size: .875em;
                font-weight: 600
            }
    
            .chatlog__embed-description {
                font-weight: 500;
                font-size: 14px
            }
    
            .chatlog__embed-fields {
                display: flex;
                flex-wrap: wrap
            }
    
            .chatlog__embed-field {
                flex: 0;
                min-width: 100%;
                max-width: 506px;
                padding-top: 10px
            }
    
            .chatlog__embed-field--inline {
                flex: 1;
                flex-basis: auto;
                min-width: 150px
            }
    
            .chatlog__embed-field-name {
                margin-bottom: 4px;
                font-size: .875em;
                font-weight: 600
            }
    
            .chatlog__embed-field-value {
                font-size: .875em;
                font-weight: 500
            }
    
            .chatlog__embed-thumbnail {
                flex: 0;
                margin-left: 20px;
                max-width: 80px;
                max-height: 80px;
                border-radius: 3px
            }
    
            .chatlog__embed-image-container {
                margin-top: 10px
            }
    
            .chatlog__embed-image {
                max-width: 500px;
                max-height: 400px;
                border-radius: 3px
            }
    
            .chatlog__embed-footer {
                margin-top: 10px
            }
    
            .chatlog__embed-footer-icon {
                margin-right: 4px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                vertical-align: middle
            }
    
            .chatlog__embed-footer-text {
                font-weight: 500;
                font-size: .75em
            }
    
            .chatlog__reactions {
                display: flex
            }
    
            .chatlog__reaction {
                display: flex;
                align-items: center;
                margin: 6px 2px 2px;
                padding: 3px 6px;
                border-radius: 3px
            }
    
            .chatlog__reaction-count {
                min-width: 9px;
                margin-left: 6px;
                font-size: .875em
            }
    
            .chatlog__bot-tag {
                margin-left: .3em;
                background: #7289da;
                color: #fff;
                font-size: .625em;
                padding: 1px 2px;
                border-radius: 3px;
                vertical-align: middle;
                line-height: 1.3;
                position: relative;
                top: -.2em
            }
        </style>
        <style>
            body {
                background-color: #36393e;
                color: #dcddde
            }
    
            a {
                color: #0096cf
            }
    
            .spoiler {
                background-color: rgba(255, 255, 255, .1)
            }
    
            .quote {
                border-color: #4f545c
            }
    
            .pre {
                background-color: #2f3136 !important
            }
    
            .pre--multiline {
                border-color: #282b30 !important;
                color: #839496 !important
            }
    
            .mention {
                color: #7289da
            }
    
            .info__guild-name {
                color: #fff
            }
    
            .info__channel-name {
                color: #fff
            }
    
            .info__channel-topic {
                color: #fff
            }
    
            .chatlog__message-group {
                border-color: rgba(255, 255, 255, .1)
            }
    
            .chatlog__author-name {
                color: #fff
            }
    
            .chatlog__timestamp {
                color: rgba(255, 255, 255, .2)
            }
    
            .chatlog__message--highlighted {
                background-color: rgba(114, 137, 218, .2) !important
            }
    
            .chatlog__message--pinned {
                background-color: rgba(249, 168, 37, .05)
            }
    
            .chatlog__edited-timestamp {
                color: rgba(255, 255, 255, .2)
            }
    
            .chatlog__embed-content-container {
                background-color: rgba(46, 48, 54, .3);
                border-color: rgba(46, 48, 54, .6)
            }
    
            .chatlog__embed-author-name {
                color: #fff
            }
    
            .chatlog__embed-author-name-link {
                color: #fff
            }
    
            .chatlog__embed-title {
                color: #fff
            }
    
            .chatlog__embed-description {
                color: rgba(255, 255, 255, .6)
            }
    
            .chatlog__embed-field-name {
                color: #fff
            }
    
            .chatlog__embed-field-value {
                color: rgba(255, 255, 255, .6)
            }
    
            .chatlog__embed-footer {
                color: rgba(255, 255, 255, .6)
            }
    
            .chatlog__reaction {
                background-color: rgba(255, 255, 255, .05)
            }
    
            .chatlog__reaction-count {
                color: rgba(255, 255, 255, .3)
            }
        </style>
    </head>`;
}

export async function generateSaveBody(channel: TextChannel): Promise<string> {
    const messages = (await channel.messages.fetch()).toJSON();

    let data: string = `
    <body>
        <div class=info>
            <div class=info__guild-icon-container><img class=info__guild-icon
                    src=${channel.guild?.iconURL({ dynamic: true })}></div>
            <div class=info__metadata>
                <div class=info__guild-name>${channel.guild?.name}</div>
                <div class=info__channel-name>${channel.name}</div>
                <div class=info__channel-message-count>${messages.length} messages</div>
            </div>
        </div>
        <div class=chatlog>`;

        let messageData: string = "";

        messages.reverse();
        messages.forEach(async (message: Message) => {
            let content = message.content.split(' '),
                mentions = message.mentions.users;

            messageData += `
                <div class=chatlog__message-group>
                    <div class=chatlog__author-avatar-container><img class=chatlog__author-avatar
                            src=${message.author.displayAvatarURL()}>
                    </div>
                    <div class=chatlog__messages><span class=chatlog__author-name title="${message.author.tag}"
                            data-user-id=${message.author.id}>${message.author.username}</span><span class=chatlog__timestamp>${message.createdAt.toLocaleString("de")}</span>
                        <div class=chatlog__message id=message-${message.id} data-message-id=${message.id}>
                            <div class=chatlog__content><span class=markdown>${content.map((word: string) => {
                                let mention = mentions.find(mention => `<@${mention.id}>` == word);

                                if(mention) {
                                    return `<span class=mention title=${mention.tag}>@${mention.username}</span>`;
                                } else {
                                    return word;
                                }
                            }).join(' ')}</span></div>
                            ${checkAttachments(message)}
                            <div class=chatlog__reactions>
                                <div class=chatlog__reactions></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

    data += messageData;

    return data;
}

function checkAttachments(msg: Message): string {
    let response: string = "";
    if(msg.attachments.first()) {
        response += "<div class=chatlog__attachment>";
        msg.attachments.forEach(file => {
            response += `
                <a href=${file.url}>
                    <img class=chatlog__attachment-thumbnail src=${file.url}>
                </a>
            `
        });

        response += "</div>";
    }

    return response;
}