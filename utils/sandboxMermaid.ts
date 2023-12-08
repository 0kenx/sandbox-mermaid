import { SendMessageResult } from '@ton-community/sandbox';
import { CommonMessageInfoInternal } from 'ton-core';

function shortenAddress(addr: string): string {
    if (addr.length < 10) return addr;
    return addr.slice(0, 5) + ".." + addr.slice(-4);
}

function bigIntDisplay(key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

// Function to parse SendMessageResult
function parseSendMessageResult(txResult: SendMessageResult) {
  const nodeSet = new Set<string>();
  const edges: string[] = [];

  txResult.transactions.forEach((transaction) => {
    const { address, inMessage, outMessages, outMessagesCount } = transaction;

    // if (inMessage) {
    //   const { info: { src, dest } } = inMessage;

    //   edges.push(`${src} --> ${dest}`);
    // }

    if (outMessagesCount > 0) {
      for (const { info, body } of outMessages.values()) {
        if ("value" in info && (info as CommonMessageInfoInternal).value !== undefined) {
          const { src, dest, value } = (info as CommonMessageInfoInternal);
          const srcNode = shortenAddress(`${src}`);
          const destNode = shortenAddress(`${dest}`);

          nodeSet.add(srcNode);
          nodeSet.add(destNode);

          edges.push(`${srcNode} ->> ${destNode}: ${JSON.stringify(value, bigIntDisplay)}`);
        }
        
      }
    }
  });

  const nodes = [...nodeSet!];
  return { nodes, edges };
}

// Function to generate Mermaid Diagram
export function generateMermaidDiagram(txResult: SendMessageResult) {
    const { nodes, edges } = parseSendMessageResult(txResult);
    const graph = `
sequenceDiagram
  autonumber
  ${nodes.map((node, index) => `participant ${node}`).join('\n  ')}
  ${edges.map((edge, index) => `${edge}`).join('\n  ')}
  `;

  return graph;
}
