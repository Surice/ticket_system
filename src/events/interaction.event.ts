import { Interaction } from "discord.js";
import { handleInteractionInput } from "../service/interactionControl.service";

export async function interaction(interaction: Interaction): Promise<void> {
    console.log("interaction event");
    if(!interaction.isButton()  && !interaction.isSelectMenu()) return;
    
    if(interaction.customId.startsWith("TicketTool")) {
        handleInteractionInput(interaction);
    }
}