import { CopyButton } from '@/shared/components';

export interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps): JSX.Element => (
  <div className="group relative rounded-lg bg-cf-gray-4 px-6 py-4 text-left font-mono text-sm text-cf-white">
    <pre className="flex items-center justify-between space-x-2 whitespace-pre-wrap break-all">
      <code>$ {code}</code>
      <CopyButton textToCopy={code} gray />
    </pre>
  </div>
);

export default CodeBlock;
