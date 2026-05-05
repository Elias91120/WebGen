
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  status?: string;
}

const Loading: React.FC<LoadingProps> = ({ status = "Chargement..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-cyan-300 animate-spin mb-2" />
      <p className="text-slate-300 text-sm font-mono">{status}</p>
    </div>
  );
};

export default Loading;
