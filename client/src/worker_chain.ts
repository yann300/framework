import { Provider } from "@remix-project/remix-simulator";

function onConfigure(evt: MessageEvent): void {
    removeEventListener("message", onConfigure);

    // Without doing runtime type checking, it's impossible to ensure the
    // message data conforms to the options type from ganache.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const provider = new Provider({ fork: 'cancun' })
    addEventListener("message", (evt) => onMessage(provider, evt));
}

function onMessage(provider: any, evt: MessageEvent): void {
    const reply = evt.ports[0];
    provider
        // Without doing runtime type checking, it's impossible to ensure the
        // message data conforms to the JSON RPC spec.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .request(evt.data)
        .then((result) => reply.postMessage({ result }))
        .catch((error) => {
            console.error("Uncaught (in remix-simulator worker thread)", error);
            reply.postMessage({
                error: {
                    message: String(error),
                    code: -32000,
                },
            });
        });
}

addEventListener("message", onConfigure);
