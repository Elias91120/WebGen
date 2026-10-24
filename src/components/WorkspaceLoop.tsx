import React, { useMemo } from 'react';

import LoopVideo from './LoopVideo';

// Bump when a file in public/videos/workspace changes: the CDN keeps the old copy otherwise.
const VIDEO_VERSION = '1';
const DIR = '/videos/workspace';

/**
 * The login loop of workspace.3geeks.fr (25 s, copied into public/videos/workspace so the site does not
 * depend on Workspace being up): project cards that fill up, in the visitor's language.
 */
const WorkspaceLoop: React.FC<{ lang: 'fr' | 'en'; className?: string }> = ({ lang, className }) => {
  const sources = useMemo(
    () => ({
      poster: `${DIR}/loop-${lang}-poster.jpg?v=${VIDEO_VERSION}`,
      wide: [
        { src: `${DIR}/loop-${lang}.mp4?v=${VIDEO_VERSION}`, type: 'video/mp4' },
        { src: `${DIR}/loop-${lang}.webm?v=${VIDEO_VERSION}`, type: 'video/webm' },
      ],
      narrow: `${DIR}/loop-${lang}-720.mp4?v=${VIDEO_VERSION}`,
    }),
    [lang],
  );
  return <LoopVideo sources={sources} className={className} />;
};

export default WorkspaceLoop;
