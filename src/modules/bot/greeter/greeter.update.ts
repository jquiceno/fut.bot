import {
  Command,
  Ctx,
  Hears,
  Start,
  Update,
  Sender,
  On,
} from "nestjs-telegraf";
import { Context } from "./context.interface";
import { WIZARD_SCENE_ID } from "./constants";

@Update()
export class GreeterUpdate {
  @Start()
  onStart(): string {
    return "Say hello to me v2";
  }

  @Hears(["hi", "hello", "hey", "qq", "hola", "buenos dias", "buenos días"])
  onGreetings(@Sender() sender: any) {
    return `Hola ${sender.first_name}!`;
  }

  @On("location")
  saveLocation(@Ctx() ctx: any) {
    console.log("ctx: ", ctx.update.message);
    return `Bien!`;
  }

  @Command("wizard")
  async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
    console.log("eso!", ctx);
    await ctx.scene.enter(WIZARD_SCENE_ID);
  }
}
