import { Injectable } from "@nestjs/common";

@Injectable()
export class EchoService {
  echo(text: string): string {
    console.log("text", text);
    return `Echo: ${text}`;
  }
}
