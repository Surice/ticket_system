import { Interaction } from "discord.js";
import { handeCommand } from "../service/commandhandlling.service";
import { handleInteractionInput } from "../service/interactionControl.service";

export async function interaction(interaction: Interaction): Promise<void> {
  if (interaction.isCommand()) {
    handeCommand(interaction);
    return;
  }

  if (interaction.isButton() || interaction.isSelectMenu()) {
    if (interaction.customId.startsWith("TicketTool")) {
      handleInteractionInput(interaction);
    }
  }
}
