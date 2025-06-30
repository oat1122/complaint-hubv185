import { NextRequest } from 'next/server';
import { notificationEmitter } from '@/lib/notificationEmitter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: any) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  notificationEmitter.on('new-notification', sendEvent);

  const interval = setInterval(() => {
    writer.write(encoder.encode(': keep-alive\n\n'));
  }, 20000);

  req.signal.addEventListener('abort', () => {
    notificationEmitter.off('new-notification', sendEvent);
    clearInterval(interval);
    writer.close();
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
