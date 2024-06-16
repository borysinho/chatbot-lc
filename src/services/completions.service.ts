import { groq, openaiComplettions } from "../objects/completions.object";
import { HttpException } from "../utils";

export const srvIASend = async (
  name: string,
  content: string,
  chatHistory: Array<any>
) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `El usuario ${name} te esta escribiendo, responde con respuestas personalizadas, toma en cuenta que el usuario se ha comunicado contigo antes. Aquí te paso el historial de mensajes que te ha enviado: ${chatHistory}`,
      },
      {
        role: "user",
        content,
        name,
      },
    ],
    model: "mixtral-8x7b-32768",
    // This ensures reproducibility. With the same seed value, the model will generate the same or similar text sequence for a given input. It’s handy for testing and comparing model behavior.
    seed: 10,
    // 2000 Tokens, this is a fairly high limit, so longer texts are allowed. It’s great for applications that need detailed responses, like writing articles, reports, or stories. However, generating such a long sequence might increase computational demands and processing time.
    max_tokens: 1024,
    // A low temperature value like this biases the model towards more predictable, less varied text. It’s great for technical documentation or specific factual answers, where accuracy and relevance are more important than creativity.
    temperature: 0.2,
    // With this setting, tokens that cumulatively make up 80% of the probability mass are taken into account, which allows for a moderate level of creativity and variability. It’s a good balance that can keep the text coherent while adding diversity.
    top_p: 0.8,

    // })
    // .catch(async (err) => {
    //   if (err instanceof APIError) {
    //     console.log(err.message); // 'Bad Request'
    //     console.log(err.status); // 400
    //     console.log(err.name); // BadRequestError
    //     console.log(err.headers); // {server: 'nginx', ...}
    //     return new HttpException(err.status || 400, err.message);
    //   } else {
    //     throw err;
    //   }
  });
  return completion;
};

export async function completarChat(
  whatsappNumber: string,
  nombreUsuario: string,
  systemTemplate: CompletionMessageType[],
  historialChat: CompletionMessageType[],
  lastUserMessage: string
) {
  const messages = systemTemplate
    .concat(historialChat)
    .concat({ role: "user", content: lastUserMessage });

  const chatCompletion = await groq.chat.completions.create({
    messages,
    model: "mixtral-8x7b-32768",
    temperature: 0,
    stream: false,
    stop: null,
    user: nombreUsuario,
  });

  return chatCompletion;
}

/**
 * ===================OPENAI CHAT===================
 */

export type CompletionMessageType = {
  role: string;
  content: string;
};

export const systemContext = (contentArray: string[]) => {
  return `Eres una IA especialista en venta de servicios, productos y paquetes de weeding planner.
1. No te salgas de contexto. Si el usuario pregunta por cosas que no se encuentran en el catálogo, deberás contestar lo más gentilmente posible que solo vendes productos y servicios para planes de bodas.
2. Las respuestas que generas no deben exceder los 250 caracteres.
3. No proveas precios a menos que te lo pidan.
A continuación envío el contexto para que elabores las respuestas:
${contentArray.map((cadena: string) => cadena).join("\n")}`;
};

export const openAICompletion = async (
  chat: CompletionMessageType[],
  context: string[],
  lastUserMessage: string
) => {
  //Agegamos el contexto
  const contexto: CompletionMessageType = {
    role: "system",
    content: systemContext(context),
  };
  const messages = [contexto].concat(chat);
  console.log({ messages });

  const completion = await openaiComplettions.chat.completions.create({
    messages: [
      { role: "system", content: systemContext(context) },
      { role: "user", content: lastUserMessage },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0,
  });

  console.log({ completion });

  return completion;
};
