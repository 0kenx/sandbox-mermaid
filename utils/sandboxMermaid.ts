import { SendMessageResult } from '@ton-community/sandbox';

function shortenAddress(addr: string): string {
    if (addr.length < 10) return addr;
    return addr.slice(0, 5) + ".." + addr.slice(-4);
}

// Function to parse SendMessageResult
function parseSendMessageResult(txResult: SendMessageResult) {
  const nodes: string[] = [];
  const edges: string[] = [];

  txResult.transactions.forEach((transaction) => {
    const { address, inMessage, outMessages, outMessagesCount } = transaction;

    // if (inMessage) {
    //   const { info: { src, dest } } = inMessage;

    //   edges.push(`${src} --> ${dest}`);
    // }

    if (outMessagesCount > 0) {
      for (const { info: { src, dest }, body } of outMessages.values()) {
        const srcNode = shortenAddress(`${src}`);
        const destNode = shortenAddress(`${dest}`);

        nodes.push(srcNode);
        nodes.push(destNode);

        edges.push(`${srcNode} ->> ${destNode}: ${body}`);
      }
    }
  });

  return { nodes, edges };
}

// Function to generate Mermaid Diagram
export function generateMermaidDiagram(txResult: SendMessageResult) {
    const { nodes, edges } = parseSendMessageResult(txResult);
    const graph = `
    sequenceDiagram
    ${nodes.map((node, index) => `participant ${node}`).join('\n')}
    ${edges.map((edge, index) => `${edge}`).join('\n')}
  `;

  return graph;
}
