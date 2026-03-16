import { getLiveTvChannels } from '@/lib/api';
import { LiveTvWatchClient } from './LiveTvWatchClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LiveTvWatchPage({ params }: PageProps) {
  const { id } = await params;

  let channelName = '';
  let channelImage = '';

  try {
    const allChannels = await getLiveTvChannels(0, 0, 1, 100);
    const found = allChannels.rows.find((ch) => ch.id === id);
    if (found) {
      channelName = found.name;
      channelImage = found.coverImage;
    }

    if (!channelName) {
      const page2 = await getLiveTvChannels(0, 0, 2, 100);
      const found2 = page2.rows.find((ch) => ch.id === id);
      if (found2) {
        channelName = found2.name;
        channelImage = found2.coverImage;
      }
    }

    if (!channelName) {
      const page3 = await getLiveTvChannels(0, 0, 3, 100);
      const found3 = page3.rows.find((ch) => ch.id === id);
      if (found3) {
        channelName = found3.name;
        channelImage = found3.coverImage;
      }
    }

    if (!channelName) {
      const page4 = await getLiveTvChannels(0, 0, 4, 100);
      const found4 = page4.rows.find((ch) => ch.id === id);
      if (found4) {
        channelName = found4.name;
        channelImage = found4.coverImage;
      }
    }
  } catch {
    notFound();
  }

  if (!channelName) {
    channelName = 'Live Channel';
  }

  return (
    <LiveTvWatchClient
      channelId={id}
      channelName={channelName}
      channelImage={channelImage}
    />
  );
}
