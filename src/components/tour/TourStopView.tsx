import { Link } from 'react-router-dom';
import LeahIntro from '../archive/LeahIntro';
import { JOURNAL_VIDEO, getJournal } from '../../data/journals';
import { resolveItem } from '../../data/tour';
import type { FlatStop } from '../../data/tour';

// The first screen of a tour stop: one picture and her words.

interface Props {
  stop: FlatStop;
}

function Words({ stop }: Props): JSX.Element {
  return (
    <div>
      <p className="font-body text-xs uppercase tracking-[0.2em] text-text-muted">
        {stop.chapter.title}
        {stop.chapter.subtitle && <span className="normal-case tracking-normal"> · {stop.chapter.subtitle}</span>}
      </p>
      <h1 className="font-heading text-[clamp(32px,4.5vw,52px)] text-text-primary leading-tight mt-2">{stop.title}</h1>
      {stop.fact && <p className="font-body text-text-secondary mt-4">{stop.fact.text}</p>}
      {stop.quote && (
        <blockquote className="mt-6 border-l-2 border-[#E2DBC9] pl-5">
          <p className="font-heading text-xl md:text-2xl italic text-text-primary leading-relaxed">“{stop.quote.text}”</p>
          <footer className="font-body text-sm text-text-muted mt-3">{stop.quote.label}</footer>
        </blockquote>
      )}
    </div>
  );
}

function TourStopView({ stop }: Props): JSX.Element {
  if (stop.type === 'intro') {
    return (
      <div className="max-w-6xl mx-auto">
        <LeahIntro overview linked={false} />
      </div>
    );
  }

  if (stop.type === 'canvas') {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <h1 className="font-heading text-[clamp(36px,5vw,60px)] text-text-primary leading-tight">{stop.title}</h1>
        {stop.quote && (
          <blockquote className="mt-6">
            <p className="font-heading text-xl md:text-2xl italic text-text-primary leading-relaxed">“{stop.quote.text}”</p>
            <footer className="font-body text-sm text-text-muted mt-3">{stop.quote.label}</footer>
          </blockquote>
        )}
        <Link to="/canvas" className="inline-block mt-10 rounded-full bg-[#8B7355] text-white font-body text-lg px-10 py-4 hover:bg-[#76614a] transition-colors">
          See all of her work at once
        </Link>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 font-body text-text-secondary">
          <Link to="/archive" className="underline underline-offset-4 hover:text-text-primary">Browse the archive</Link>
          <Link to="/studio" className="underline underline-offset-4 hover:text-text-primary">Explore her studio</Link>
          <Link to="/tour" className="underline underline-offset-4 hover:text-text-primary">Start the tour again</Link>
        </div>
      </div>
    );
  }

  let media: JSX.Element | null = null;
  let caption = stop.caption;
  if (stop.type === 'video') {
    media = (
      <video controls preload="metadata" playsInline poster={JOURNAL_VIDEO.poster} className="w-full h-auto rounded-2xl shadow-glass bg-black">
        <source src={JOURNAL_VIDEO.src} type="video/mp4" />
      </video>
    );
  } else if (stop.type === 'journal' && stop.journal) {
    const journal = getJournal(stop.journal.id);
    const page = journal?.pages[stop.journal.page - 1];
    if (journal && page) {
      media = <img src={page.image} width={page.width} height={page.height} alt={`${journal.title} journal, page ${stop.journal.page}`} className="w-full h-auto max-h-[62vh] object-contain rounded-xl shadow-glass" />;
      caption = caption ?? `${journal.title} journal${journal.date ? `, ${journal.date}` : ''}`;
    }
  } else if (stop.image) {
    const item = resolveItem(stop.image);
    if (item) {
      media = <img src={item.full} alt={item.title ?? stop.title} className="w-full h-auto max-h-[62vh] object-contain rounded-xl shadow-glass" />;
      caption = caption ?? item.title;
    }
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-8 lg:gap-12 items-center">
      <figure>
        {media}
        {caption && <figcaption className="font-body text-sm text-text-muted mt-3 text-center">{caption}</figcaption>}
      </figure>
      <Words stop={stop} />
    </div>
  );
}

export default TourStopView;
