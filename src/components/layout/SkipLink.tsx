function SkipLink(): JSX.Element {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]
        focus:px-4 focus:py-2 focus:bg-text-primary focus:text-white focus:rounded-lg
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
