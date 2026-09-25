import { useEffect, useRef, useState } from 'react';
import { setScrollLocked } from '../scroll';
import { IDEA_MAX, NAME_MAX, cleanYourApp, drawYourAppIcon } from '../yourApp';

// Lets a visitor name their own app idea. The icon preview redraws as they
// type; nothing leaves the browser until they choose to email it.
export default function YourAppDialog({ open, initial, scene = true, onSave, onRemove, onClose }) {
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setName(initial ? initial.name : '');
    setIdea(initial ? initial.idea : '');
    returnFocus.current = document.activeElement;
    setScrollLocked(true);
    const id = window.setTimeout(() => nameRef.current && nameRef.current.focus(), 60);
    const onKey = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      setScrollLocked(false);
      if (returnFocus.current && returnFocus.current.focus) returnFocus.current.focus();
    };
    // Only re-run when the dialog opens or closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const preview = cleanYourApp({ name: name || 'Your app', idea });
  useEffect(() => {
    if (open && canvasRef.current) drawYourAppIcon(canvasRef.current, preview, 320);
  });

  if (!open) return null;

  const submit = event => {
    event.preventDefault();
    const app = cleanYourApp({ name, idea });
    if (app) onSave(app);
  };

  return (
    <div className="yourapp" role="dialog" aria-modal="true" aria-labelledby="yourapp-title">
      <div className="yourapp__backdrop" onClick={onClose} />
      <form className="yourapp__panel" onSubmit={submit}>
        <div className="yourapp__preview" aria-hidden="true">
          <canvas ref={canvasRef} width="320" height="320" />
          <span>{preview.name}</span>
        </div>
        <div className="yourapp__fields">
          <p className="eyebrow">Your app</p>
          <h2 id="yourapp-title">{scene ? 'Put your app on this phone' : 'Add your app idea'}</h2>
          <p className="yourapp__lede">
            {scene
              ? 'Name it and say what it does. It gets its own icon, launches with my apps and joins the orbit at the end.'
              : 'Name it and say what it does. It gets its own icon next to my apps, and you can send it to me from the end of the page.'}
          </p>
          <label className="yourapp__field">
            <span>App name</span>
            <input
              ref={nameRef}
              value={name}
              maxLength={NAME_MAX}
              required
              autoComplete="off"
              placeholder="e.g. SalonBook"
              onChange={event => setName(event.target.value)}
            />
          </label>
          <label className="yourapp__field">
            <span>
              What it does <em>(optional)</em>
            </span>
            <input
              value={idea}
              maxLength={IDEA_MAX}
              autoComplete="off"
              placeholder="Bookings and reminders for my salon"
              onChange={event => setIdea(event.target.value)}
            />
          </label>
          <div className="yourapp__actions">
            <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
              {scene ? 'Put it on the phone' : 'Save my app'}
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            {initial && (
              <button type="button" className="text-link yourapp__remove" onClick={onRemove}>
                Remove
              </button>
            )}
          </div>
          <p className="yourapp__note">
            Nothing is sent anywhere. It stays in this browser until you choose to email it.
          </p>
        </div>
      </form>
    </div>
  );
}
