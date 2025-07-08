export async function transcribe({ model, response_format, file, apiKey }) {
    const formData = new FormData();
    formData.append('model', model);
    formData.append('response_format', response_format);
    formData.append('file', file);

    const resp = await fetch('https://api.stepfun.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData,
    });
    if (!resp.ok) throw new Error(resp.statusText);
    return resp.json();
}