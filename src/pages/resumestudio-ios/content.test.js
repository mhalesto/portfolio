import fs from 'fs';
import path from 'path';
import content from './content.json';

const textOf = sections => sections.flatMap(section => section.paragraphs || []).join(' ');
const section = title => content.privacySections.find(item => item.title === title);

test('privacy distinguishes raw AI import and live audio from redacted writing and local recording', () => {
  expect(section('AI résumé import').paragraphs.join(' ')).toMatch(/extracted text.*contact/is);
  expect(section('Spoken mock interviews').paragraphs.join(' ')).toMatch(/audio.*directly.*OpenAI/is);
  expect(section('Spoken mock interviews').paragraphs.join(' ')).toMatch(/retention/i);
  expect(textOf(content.privacySections)).not.toMatch(/never sends audio|no audio ever leaves|all AI requests are redacted/i);
});

test('privacy distinguishes Proof Pack sharing from trackable-link engagement and aggregate insights', () => {
  expect(section('Career Proof Packs').paragraphs.join(' ')).toMatch(/does not record.*opens|without viewer analytics/i);
  expect(section('Trackable résumé links and public CV pages').paragraphs.join(' ')).toMatch(/cookie.*reading|reading.*cookie/i);
  expect(section('Privacy-safe product measurement').paragraphs.join(' ')).toMatch(/off by default/i);
  expect(section('Retention and deletion').paragraphs.join(' ')).toMatch(/does not cancel an App Store subscription/i);
});

test('public static privacy, data and support pages contain the same current disclosures as the app routes', () => {
  const page = name => new DOMParser().parseFromString(
    fs.readFileSync(path.join(process.cwd(), 'public/projects/resumestudio-ios', name, 'index.html'), 'utf8'),
    'text/html',
  );
  const privacy = page('privacy');
  for (const item of content.privacySections) {
    expect(privacy.body.textContent).toContain(item.title);
    for (const paragraph of item.paragraphs) expect(privacy.body.textContent).toContain(paragraph);
  }
  const data = page('data-collection');
  for (const card of content.dataCards) for (const item of card.items) expect(data.body.textContent).toContain(item);
  const support = page('support');
  for (const card of content.supportCards) expect(support.body.textContent).toContain(card.body);
  for (const [name, document] of [['privacy', privacy], ['data-collection', data], ['support', support]]) {
    expect(document.querySelector('link[rel="canonical"]').href).toBe(`https://www.halalisani.com/projects/resumestudio-ios/${name}/`);
  }
});
