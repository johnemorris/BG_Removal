import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];

  try {
    const contentType = req.headers.get('content-type') || '';
    const isInternalApp = req.headers.get('x-internal-app') === 'true';
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');

    if (!isInternalApp && !apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Please provide a valid X-Api-Key header.' },
        { status: 401 }
      );
    }

    const tmpDir = os.tmpdir();
    const id = Math.random().toString(36).substring(2, 10);
    const tempIn = path.join(tmpDir, `clearcut_in_${id}.png`);
    const tempOut = path.join(tmpDir, `clearcut_out_${id}.png`);
    tempFiles.push(tempIn, tempOut);

    let format = 'png';
    let defringe = '2';
    let shift = '-1';
    let feather = '0.5';
    let alphaMatting = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('image_file') as File | null;
      if (!file) {
        return NextResponse.json(
          { error: 'Missing image_file in multipart/form-data payload.' },
          { status: 400 }
        );
      }
      format = (formData.get('format') as string) || 'png';
      if (formData.has('defringe')) defringe = (formData.get('defringe') as string);
      if (formData.has('shift')) shift = (formData.get('shift') as string);
      if (formData.has('feather')) feather = (formData.get('feather') as string);
      if (formData.get('alpha_matting') === 'true') alphaMatting = true;

      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(tempIn, Buffer.from(arrayBuffer));
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      format = body.format || 'png';
      if (body.defringe !== undefined) defringe = String(body.defringe);
      if (body.shift !== undefined) shift = String(body.shift);
      if (body.feather !== undefined) feather = String(body.feather);
      if (body.alpha_matting) alphaMatting = true;

      if (body.image_base64) {
        const base64Data = body.image_base64.replace(/^data:image\/\w+;base64,/, '');
        await fs.writeFile(tempIn, Buffer.from(base64Data, 'base64'));
      } else if (body.image_url) {
        const fetched = await fetch(body.image_url);
        if (!fetched.ok) {
          return NextResponse.json(
            { error: `Failed to fetch image from URL: ${body.image_url}` },
            { status: 400 }
          );
        }
        const ab = await fetched.arrayBuffer();
        await fs.writeFile(tempIn, Buffer.from(ab));
      } else {
        return NextResponse.json(
          { error: 'Must provide either image_file, image_base64, or image_url.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported Content-Type. Use multipart/form-data or application/json.' },
        { status: 415 }
      );
    }

    // Run AI segmentation model with hair defringe & edge choke parameters
    const scriptPath = path.resolve(process.cwd(), 'scripts/remove_bg.py');
    const cliArgs = [
      scriptPath,
      tempIn,
      tempOut,
      '--defringe', defringe,
      '--shift', shift,
      '--feather', feather,
    ];
    if (alphaMatting) {
      cliArgs.push('--alpha-matting');
    }

    const startTime = Date.now();
    await execFileAsync('python3', cliArgs, {
      timeout: 30000,
    });
    const durationMs = Date.now() - startTime;

    const outputBuffer = await fs.readFile(tempOut);

    const acceptHeader = req.headers.get('accept') || '';
    if (acceptHeader.includes('application/json') || (contentType.includes('application/json') && !req.headers.get('x-return-binary'))) {
      const base64Output = `data:image/png;base64,${outputBuffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        status: 'completed',
        credits_remaining: 18,
        execution_time_ms: durationMs,
        cutout_data_url: base64Output,
      });
    }

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': `image/${format}`,
        'X-Credits-Remaining': '18',
        'X-Execution-Time-Ms': durationMs.toString(),
      },
    });
  } catch (err: any) {
    console.error('AI Segmentation Error:', err);
    return NextResponse.json(
      { error: 'Failed to process background removal.', details: err.message },
      { status: 500 }
    );
  } finally {
    for (const f of tempFiles) {
      try {
        await fs.unlink(f);
      } catch {}
    }
  }
}
